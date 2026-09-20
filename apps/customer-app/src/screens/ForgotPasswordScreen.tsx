import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CardDotPattern } from '../components/CardDotPattern';
import { KairosWordmark } from '../components/KairosWordmark';
import { FieldError } from '../components/FieldError';
import { PhoneCountryInput } from '../components/PhoneCountryInput';
import { OtpModal } from '../components/OtpModal';
import { OrbitGlow } from '../components/OrbitGlow';
import { RotatingClock } from '../components/RotatingClock';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';
import { resetPassword, checkEmailExists, ApiError } from '../api/auth';
import { isWeakPassword, MIN_PASSWORD_LENGTH } from '../utils/passwordPolicy';
import { Country, DEFAULT_COUNTRY } from '../constants/countries';
import { isValidPhoneForCountry } from '../utils/phone';

type Props = {
  onOtpVerified?: () => void;
  onLoginPress?: () => void;
  onSignUpPress?: () => void;
};

type Stage = 'request' | 'reset' | 'success';

const AUTO_REDIRECT_MS = 2500;

export function ForgotPasswordScreen({ onOtpVerified, onLoginPress, onSignUpPress }: Props) {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();

  const [stage, setStage] = useState<Stage>('request');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneError, setPhoneError] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (stage !== 'success') return;
    successOpacity.setValue(0);
    Animated.timing(successOpacity, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => onOtpVerified?.(), AUTO_REDIRECT_MS);
    return () => clearTimeout(timer);
  }, [stage, onOtpVerified, successOpacity]);

  const handlePhoneChange = (digits: string) => {
    setPhone(digits);
    setPhoneError('');
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setPhoneError('Enter your email address first.');
      return;
    }
    if (!phone.trim() || !isValidPhoneForCountry(phone, country.code)) {
      setPhoneError(`Enter a valid ${country.name} number.`);
      return;
    }
    if (isCheckingEmail) return;
    setPhoneError('');
    setIsCheckingEmail(true);
    try {
      const exists = await checkEmailExists(email.trim());
      if (!exists) {
        setPhoneError('No account found with that email address.');
        return;
      }
      setOtpModalVisible(true);
    } catch {
      Alert.alert('Something went wrong', 'Please check your connection and try again.');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateField = (field: string): string | undefined => {
    switch (field) {
      case 'newPassword':
        if (!newPassword) return 'Password is required.';
        if (newPassword.length < MIN_PASSWORD_LENGTH) {
          return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
        }
        if (isWeakPassword(newPassword, email)) {
          return 'This password is too easy to guess. Please choose another.';
        }
        return undefined;
      case 'confirmPassword':
        if (!confirmPassword) return 'Please confirm your password.';
        if (newPassword !== confirmPassword) return 'Passwords do not match.';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleFieldBlur = (field: string) => {
    const message = validateField(field);
    setErrors((prev) => {
      if (message) {
        if (prev[field] === message) return prev;
        return { ...prev, [field]: message };
      }
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // Autofill (and fast IME commits on Android) can land the field's value a
  // beat after the blur event fires, so a same-tick "is it filled" check can
  // see stale/empty state. Defer one tick, and read the check through a ref
  // that's refreshed every render so we always validate against the latest
  // state regardless of exactly when the deferred callback runs.
  const handleFieldBlurRef = useRef(handleFieldBlur);
  handleFieldBlurRef.current = handleFieldBlur;

  const deferredFieldBlur = (field: string) => {
    setTimeout(() => handleFieldBlurRef.current(field), 80);
  };

  const handleResetPassword = async () => {
    const newPasswordError = validateField('newPassword');
    const confirmPasswordError = validateField('confirmPassword');
    const nextErrors: Record<string, string> = {};
    if (newPasswordError) nextErrors.newPassword = newPasswordError;
    if (confirmPasswordError) nextErrors.confirmPassword = confirmPasswordError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await resetPassword({ email: email.trim(), newPassword });
      setStage('success');
    } catch (err) {
      if (err instanceof ApiError && (err.status === 409 || err.status === 400)) {
        setErrors({ newPassword: err.message });
      } else if (err instanceof ApiError && err.status === 404) {
        setStage('request');
        setPhoneError(err.message);
      } else {
        Alert.alert('Reset failed', 'Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView style={styles.flexFill} behavior="padding">
        <CardDotPattern />

        <View style={[styles.headerWrap, { paddingTop: insets.top + 48 }]}>
          <KairosWordmark fontSize={scaleFont(22)} />
          <Text style={[styles.tagline, { fontSize: scaleFont(9) }]}>SHOP BETTER · SHOP KAIROS</Text>
        </View>

        <ScrollView
          style={styles.flexFill}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.stepLabel, { fontSize: scaleFont(11) }]}>FORGOT PASSWORD</Text>

          <View style={{ display: stage === 'request' ? 'flex' : 'none' }}>
            <Text style={[styles.instruction, { fontSize: scaleFont(11.5) }]}>
              Enter your email address and mobile number, and we'll send you an SMS code to reset
              your password
            </Text>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>EMAIL ADDRESS</Text>
              <TextInput
                placeholderTextColor={colors.muted}
                style={[styles.input, { fontSize: scaleFont(13) }]}
                placeholder="jane.doe@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setPhoneError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>MOBILE NUMBER</Text>
              <PhoneCountryInput
                country={country}
                onChangeCountry={setCountry}
                phone={phone}
                onChangePhone={handlePhoneChange}
                error={phoneError ? phoneError : undefined}
                scaleFont={scaleFont}
              />
            </View>

            {phoneError ? (
              <Text style={[styles.errorText, { fontSize: scaleFont(10) }]}>{phoneError}</Text>
            ) : null}

            <Pressable onPress={handleSendOtp} style={styles.actionButton} disabled={isCheckingEmail}>
              <LinearGradient
                colors={colors.wordmarkGradient}
                locations={colors.wordmarkGradientLocations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionButtonGradient}
              >
                {isCheckingEmail ? (
                  <ActivityIndicator size="small" color="#08090b" />
                ) : (
                  <Text style={[styles.actionButtonText, { fontSize: scaleFont(11) }]}>
                    SEND OTP
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          <View style={{ display: stage === 'reset' ? 'flex' : 'none' }}>
            <Text style={[styles.instruction, { fontSize: scaleFont(11.5) }]}>
              Your number is verified. Choose a new password for your account.
            </Text>

            <View style={styles.field}>
              <View style={styles.fieldLabelRow}>
                <Text style={[styles.fieldLabel, { fontSize: scaleFont(10), marginBottom: 0 }]}>
                  NEW PASSWORD
                </Text>
                <Pressable onPress={() => setPasswordVisible((v) => !v)} hitSlop={8}>
                  <Text style={[styles.showHideText, { fontSize: scaleFont(9.5) }]}>
                    {passwordVisible ? 'HIDE' : 'SHOW'}
                  </Text>
                </Pressable>
              </View>
              <TextInput
                placeholderTextColor={colors.muted}
                style={[
                  styles.input,
                  { fontSize: scaleFont(13), marginTop: 6 },
                  errors.newPassword ? styles.inputError : null,
                ]}
                placeholder="••••••••"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  clearError('newPassword');
                }}
                onBlur={() => deferredFieldBlur('newPassword')}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                textContentType="oneTimeCode"
              />
              <FieldError message={errors.newPassword} scaleFont={scaleFont} />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>CONFIRM PASSWORD</Text>
              <TextInput
                placeholderTextColor={colors.muted}
                style={[
                  styles.input,
                  { fontSize: scaleFont(13) },
                  errors.confirmPassword ? styles.inputError : null,
                ]}
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  clearError('confirmPassword');
                }}
                onBlur={() => deferredFieldBlur('confirmPassword')}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                textContentType="oneTimeCode"
              />
              <FieldError message={errors.confirmPassword} scaleFont={scaleFont} />
            </View>

            <Pressable onPress={handleResetPassword} style={styles.actionButton} disabled={isSubmitting}>
              <LinearGradient
                colors={colors.wordmarkGradient}
                locations={colors.wordmarkGradientLocations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionButtonGradient}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#08090b" />
                ) : (
                  <Text style={[styles.actionButtonText, { fontSize: scaleFont(11) }]}>
                    RESET PASSWORD
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          <View style={{ display: stage === 'success' ? 'flex' : 'none' }}>
            <Animated.View style={[styles.successWrap, { opacity: successOpacity }]}>
              <OrbitGlow size={90} centerContent={<RotatingClock size={24} />} />
              <Text style={[styles.successTitle, { fontSize: scaleFont(14) }]}>
                Password reset successfully
              </Text>
              <Text style={[styles.redirectText, { fontSize: scaleFont(10.5) }]}>
                Redirecting to login...
              </Text>
            </Animated.View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.footerWrap,
            { paddingBottom: keyboardVisible ? 12 : insets.bottom + 20 },
          ]}
        >
          <Text style={[styles.backText, { fontSize: scaleFont(11.5) }]}>
            Already have an account?{' '}
            <Text onPress={onLoginPress} style={styles.backLink}>
              Login
            </Text>
            {', or alternatively, '}
            <Text onPress={onSignUpPress} style={styles.backLink}>
              Register
            </Text>
            {' to start shopping with Kairos.'}
          </Text>
        </View>
      </KeyboardAvoidingView>

      <OtpModal
        visible={otpModalVisible}
        onClose={() => setOtpModalVisible(false)}
        onVerified={() => setStage('reset')}
        phoneDisplay={phone ? `${country.dialCode} ${phone}` : ''}
        scaleFont={scaleFont}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgTop,
  },
  flexFill: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 26,
    paddingBottom: 24,
  },
  headerWrap: {
    alignItems: 'center',
    paddingHorizontal: 26,
    marginBottom: 20,
  },
  footerWrap: {
    paddingHorizontal: 26,
  },
  tagline: {
    fontFamily: typography.medium,
    letterSpacing: 2,
    color: colors.muted,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  stepLabel: {
    fontFamily: typography.bold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.dotGold,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  instruction: {
    fontFamily: typography.regular,
    fontSize: 11.5,
    color: colors.muted,
    marginBottom: 26,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: typography.semiBold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  showHideText: {
    fontFamily: typography.semiBold,
    fontSize: 9.5,
    letterSpacing: 1,
    color: colors.dotGold,
  },
  input: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: colors.text,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontFamily: typography.medium,
    color: colors.error,
    marginTop: 6,
  },
  actionButton: {
    marginTop: 4,
  },
  actionButtonGradient: {
    paddingVertical: 13,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: typography.bold,
    fontSize: 11,
    letterSpacing: 1.3,
    color: '#08090b',
  },
  successWrap: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successTitle: {
    fontFamily: typography.bold,
    color: colors.text,
    textAlign: 'center',
    marginTop: 18,
  },
  redirectText: {
    fontFamily: typography.medium,
    color: colors.dotGold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  backText: {
    fontFamily: typography.regular,
    fontSize: 11.5,
    color: colors.muted,
    textAlign: 'center',
  },
  backLink: {
    fontFamily: typography.semiBold,
    fontSize: 11.5,
    color: colors.dotGold,
    textDecorationLine: 'underline',
  },
});
