import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { OrbitGlow } from '../components/OrbitGlow';
import { FieldError } from '../components/FieldError';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';
import { loginUser, ApiError, AuthResponse } from '../api/auth';
import { saveToken } from '../api/tokenStorage';

type Props = {
  onSubmit?: (result: AuthResponse) => void;
  onSignUpPress?: () => void;
  onForgotPasswordPress?: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen({ onSubmit, onSignUpPress, onForgotPasswordPress }: Props) {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
      case 'email':
        if (!email.trim()) return 'Email address is required.';
        if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address.';
        return undefined;
      case 'password':
        return password ? undefined : 'Password is required.';
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

  const handleSubmit = async () => {
    const emailError = validateField('email');
    const passwordError = validateField('password');
    const nextErrors: Record<string, string> = {};
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await loginUser({ email: email.trim(), password });
      await saveToken(result.token);
      onSubmit?.(result);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setErrors({ password: err.message });
      } else {
        Alert.alert('Login failed', 'Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flexFill}
        behavior="padding"
      >
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
          <Text style={[styles.stepLabel, { fontSize: scaleFont(11) }]}>WELCOME BACK</Text>
          <Text style={[styles.instruction, { fontSize: scaleFont(11.5) }]}>
            Enter your email address and password to continue
          </Text>

          <View style={styles.glowWrap}>
            <OrbitGlow />
          </View>

          <View style={styles.field}>
            <TextInput
              placeholderTextColor={colors.muted}
              style={[styles.input, { fontSize: scaleFont(13) }, errors.email ? styles.inputError : null]}
              placeholder="jane.doe@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError('email');
              }}
              onBlur={() => deferredFieldBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
            />
            <FieldError message={errors.email} scaleFont={scaleFont} />
          </View>

          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={[styles.fieldLabel, { fontSize: scaleFont(10), marginBottom: 0 }]}>
                PASSWORD
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
                errors.password ? styles.inputError : null,
              ]}
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError('password');
              }}
              onBlur={() => deferredFieldBlur('password')}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              textContentType="oneTimeCode"
            />
            <FieldError message={errors.password} scaleFont={scaleFont} />
            <Pressable onPress={onForgotPasswordPress} hitSlop={8} style={styles.forgotPasswordButton}>
              <Text style={[styles.forgotPasswordText, { fontSize: scaleFont(10.5) }]}>
                Forgot password?
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <View
          style={[
            styles.footerWrap,
            { paddingBottom: keyboardVisible ? 12 : insets.bottom + 20 },
          ]}
        >
          <Pressable onPress={handleSubmit} style={styles.loginButton} disabled={isSubmitting}>
            <LinearGradient
              colors={colors.wordmarkGradient}
              locations={colors.wordmarkGradientLocations}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButtonGradient}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#08090b" />
              ) : (
                <Text style={[styles.loginButtonText, { fontSize: scaleFont(11) }]}>LOG IN</Text>
              )}
            </LinearGradient>
          </Pressable>

          <View style={styles.signUpRow}>
            <Text style={[styles.signUpText, { fontSize: scaleFont(11.5) }]}>
              Don't have an account?{' '}
            </Text>
            <Pressable onPress={onSignUpPress} hitSlop={8}>
              <Text style={[styles.signUpLink, { fontSize: scaleFont(11.5) }]}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    marginBottom: 22,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    fontFamily: typography.semiBold,
    color: colors.dotGold,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
  },
  glowWrap: {
    alignItems: 'center',
    marginBottom: 40,
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
  loginButton: {
    marginTop: 12,
  },
  loginButtonGradient: {
    paddingVertical: 13,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontFamily: typography.bold,
    fontSize: 11,
    letterSpacing: 1.3,
    color: '#08090b',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontFamily: typography.regular,
    fontSize: 11.5,
    color: colors.muted,
  },
  signUpLink: {
    fontFamily: typography.semiBold,
    fontSize: 11.5,
    color: colors.dotGold,
    textDecorationLine: 'underline',
  },
});
