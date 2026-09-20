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
  TextInputProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { CardDotPattern } from '../components/CardDotPattern';
import { KairosWordmark } from '../components/KairosWordmark';
import { FieldError } from '../components/FieldError';
import { PhoneCountryInput } from '../components/PhoneCountryInput';
import { OtpModal } from '../components/OtpModal';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';
import { registerUser, ApiError, AuthResponse } from '../api/auth';
import { saveToken } from '../api/tokenStorage';
import { isWeakPassword, MIN_PASSWORD_LENGTH } from '../utils/passwordPolicy';
import { Country, DEFAULT_COUNTRY } from '../constants/countries';
import { isValidPhoneForCountry } from '../utils/phone';

type Props = {
  onSubmit?: (result: AuthResponse) => void;
  onLoginPress?: () => void;
};

const STEP_COUNT = 3;
const STEP_INSTRUCTIONS = [
  "LET'S CREATE YOUR ACCOUNT",
  'LET US KNOW WHERE TO DELIVER',
  'LET US KNOW HOW TO CONTACT YOU',
];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldProps = TextInputProps & {
  label: string;
  scaleFont: (size: number) => number;
  style?: object;
  error?: string;
};

function FormField({ label, scaleFont, style, error, ...inputProps }: FieldProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, { fontSize: scaleFont(13) }, error ? styles.inputError : null]}
        autoCorrect={false}
        spellCheck={false}
        {...inputProps}
      />
      <FieldError message={error} scaleFont={scaleFont} />
    </View>
  );
}

function MaskedPasswordInput({
  value,
  onChangeText,
  onBlur,
  visible,
  placeholder,
  scaleFont,
  error,
  style,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  visible: boolean;
  placeholder: string;
  scaleFont: (size: number) => number;
  error?: string;
  style?: object;
}) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      style={[styles.input, { fontSize: scaleFont(13) }, style, error ? styles.inputError : null]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      textContentType="oneTimeCode"
    />
  );
}

export function SignUpScreen({ onSubmit, onLoginPress }: Props) {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();

  const [step, setStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [step]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [streetAddress, setStreetAddress] = useState('');
  const [apartmentUnit, setApartmentUnit] = useState('');
  const [suburb, setSuburb] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [locating, setLocating] = useState(false);
  const [useCurrentLocationChecked, setUseCurrentLocationChecked] = useState(false);

  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const isFirstStep = step === 0;
  const isLastStep = step === STEP_COUNT - 1;

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const STEP_FIELDS: Record<number, string[]> = {
    0: ['firstName', 'lastName', 'email', 'password', 'confirmPassword'],
    1: ['streetAddress', 'suburb', 'city', 'postalCode'],
    2: ['phone'],
  };

  const validateField = (field: string): string | undefined => {
    switch (field) {
      case 'firstName':
        return firstName.trim() ? undefined : 'First name is required.';
      case 'lastName':
        return lastName.trim() ? undefined : 'Last name is required.';
      case 'email':
        if (!email.trim()) return 'Email address is required.';
        if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address.';
        return undefined;
      case 'password':
        if (!password) return 'Password is required.';
        if (password.length < MIN_PASSWORD_LENGTH) {
          return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
        }
        if (isWeakPassword(password, email, firstName, lastName)) {
          return 'This password is too easy to guess. Please choose another.';
        }
        return undefined;
      case 'confirmPassword':
        if (!confirmPassword) return 'Please confirm your password.';
        if (password !== confirmPassword) return 'Passwords do not match.';
        return undefined;
      case 'streetAddress':
        return streetAddress.trim() ? undefined : 'Street address is required.';
      case 'suburb':
        return suburb.trim() ? undefined : 'Suburb is required.';
      case 'city':
        return city.trim() ? undefined : 'City is required.';
      case 'postalCode':
        return postalCode.trim() ? undefined : 'Postal code is required.';
      case 'phone':
        if (!phone.trim()) return 'Cellphone number is required.';
        if (!isValidPhoneForCountry(phone, country.code)) {
          return `Enter a valid ${country.name} number.`;
        }
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

  const validateStep = (stepToValidate: number): boolean => {
    const fields = STEP_FIELDS[stepToValidate] ?? [];
    const nextErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const message = validateField(field);
      if (message) nextErrors[field] = message;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleToggleUseCurrentLocation = async () => {
    if (useCurrentLocationChecked) {
      setUseCurrentLocationChecked(false);
      return;
    }
    setUseCurrentLocationChecked(true);
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location permission needed', 'Enable location access to autofill your address.');
        setUseCurrentLocationChecked(false);
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      if (place) {
        const street = [place.streetNumber, place.street].filter(Boolean).join(' ');
        if (street) setStreetAddress(street);
        const suburbValue = place.subregion ?? place.district ?? '';
        if (suburbValue) setSuburb(suburbValue);
        if (place.city) setCity(place.city);
        if (place.postalCode) setPostalCode(place.postalCode);
      }
    } catch {
      Alert.alert('Could not detect location', 'Please enter your address manually.');
      setUseCurrentLocationChecked(false);
    } finally {
      setLocating(false);
    }
  };

  const handlePhoneChange = (digits: string) => {
    setPhone(digits);
    setPhoneVerified(false);
    setOtpSent(false);
    setOtpModalVisible(false);
    clearError('phone');
  };

  const handleSelectCountry = (nextCountry: Country) => {
    setCountry(nextCountry);
    setPhoneVerified(false);
    setOtpSent(false);
    clearError('phone');
  };

  const handleSendOtp = () => {
    const phoneError = validateField('phone');
    if (phoneError) {
      setErrors((prev) => ({ ...prev, phone: phoneError }));
      return;
    }
    setOtpSent(true);
    setOtpModalVisible(true);
  };

  const submitRegistration = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await registerUser({
        firstName,
        lastName,
        email: email.trim(),
        password,
        streetAddress,
        apartmentUnit: apartmentUnit.trim() || undefined,
        suburb,
        city,
        postalCode,
        phoneNumber: `${country.dialCode}${phone}`,
      });
      await saveToken(result.token);
      onSubmit?.(result);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setStep(0);
        setErrors((prev) => ({ ...prev, email: err.message }));
      } else if (err instanceof ApiError && err.status === 400) {
        setStep(0);
        setErrors((prev) => ({ ...prev, password: err.message }));
      } else {
        Alert.alert('Registration failed', 'Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerified = () => {
    setPhoneVerified(true);
    submitRegistration();
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      return;
    }
    if (isLastStep) {
      if (!phoneVerified) {
        Alert.alert('Verify your phone number', 'Please confirm your cellphone number before signing up.');
        return;
      }
      submitRegistration();
      return;
    }
    setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

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
          ref={scrollViewRef}
          style={styles.flexFill}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.stepIntro}>
            <Text style={[styles.stepLabel, { fontSize: scaleFont(11) }]}>
              STEP {step + 1}/{STEP_COUNT}: {STEP_INSTRUCTIONS[step]}
            </Text>
          </View>

          <View style={{ display: step === 0 ? 'flex' : 'none' }}>
              <Text style={{ ...styles.sectionHeading, fontSize: scaleFont(11) }}>PROFILE</Text>
              <View style={styles.row}>
                <FormField
                  label="FIRST NAME"
                  scaleFont={scaleFont}
                  placeholder="Jane"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    clearError('firstName');
                  }}
                  onBlur={() => deferredFieldBlur('firstName')}
                  autoCapitalize="words"
                  style={styles.rowField}
                  error={errors.firstName}
                />
                <FormField
                  label="LAST NAME"
                  scaleFont={scaleFont}
                  placeholder="Doe"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    clearError('lastName');
                  }}
                  onBlur={() => deferredFieldBlur('lastName')}
                  autoCapitalize="words"
                  style={styles.rowField}
                  error={errors.lastName}
                />
              </View>

              <FormField
                label="EMAIL ADDRESS"
                scaleFont={scaleFont}
                placeholder="jane.doe@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError('email');
                }}
                onBlur={() => deferredFieldBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

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
                <MaskedPasswordInput
                  style={{ marginTop: 6 }}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearError('password');
                  }}
                  onBlur={() => deferredFieldBlur('password')}
                  visible={passwordVisible}
                  scaleFont={scaleFont}
                  error={errors.password}
                />
                <FieldError message={errors.password} scaleFont={scaleFont} />
              </View>

              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>
                  CONFIRM PASSWORD
                </Text>
                <MaskedPasswordInput
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    clearError('confirmPassword');
                  }}
                  onBlur={() => deferredFieldBlur('confirmPassword')}
                  visible={passwordVisible}
                  scaleFont={scaleFont}
                  error={errors.confirmPassword}
                />
                <FieldError message={errors.confirmPassword} scaleFont={scaleFont} />
              </View>
          </View>

          <View style={{ display: step === 1 ? 'flex' : 'none' }}>
              <Text style={{ ...styles.sectionHeading, fontSize: scaleFont(11) }}>ADDRESS</Text>

              <Pressable
                onPress={handleToggleUseCurrentLocation}
                style={styles.checkboxRow}
                disabled={locating}
              >
                <View
                  style={[styles.checkbox, useCurrentLocationChecked && styles.checkboxChecked]}
                >
                  {locating ? (
                    <ActivityIndicator size="small" color={colors.text} />
                  ) : useCurrentLocationChecked ? (
                    <MaterialIcons name="check" size={13} color={colors.text} />
                  ) : null}
                </View>
                <Text style={[styles.checkboxLabel, { fontSize: scaleFont(10) }]}>
                  Use my current location to fill this in
                </Text>
              </Pressable>

              <FormField
                label="STREET ADDRESS"
                scaleFont={scaleFont}
                placeholder="12 Main Road"
                value={streetAddress}
                onChangeText={(text) => {
                  setStreetAddress(text);
                  clearError('streetAddress');
                }}
                onBlur={() => deferredFieldBlur('streetAddress')}
                error={errors.streetAddress}
              />
              <FormField
                label="APARTMENT / UNIT / COMPLEX (OPTIONAL)"
                scaleFont={scaleFont}
                placeholder="e.g. Unit 4B, Ivy Complex"
                value={apartmentUnit}
                onChangeText={setApartmentUnit}
              />
              <View style={styles.row}>
                <FormField
                  label="SUBURB"
                  scaleFont={scaleFont}
                  placeholder="Rondebosch"
                  value={suburb}
                  onChangeText={(text) => {
                    setSuburb(text);
                    clearError('suburb');
                  }}
                  onBlur={() => deferredFieldBlur('suburb')}
                  style={styles.rowField}
                  error={errors.suburb}
                />
                <FormField
                  label="CITY"
                  scaleFont={scaleFont}
                  placeholder="Cape Town"
                  value={city}
                  onChangeText={(text) => {
                    setCity(text);
                    clearError('city');
                  }}
                  onBlur={() => deferredFieldBlur('city')}
                  style={styles.rowField}
                  error={errors.city}
                />
              </View>
              <FormField
                label="POSTAL CODE"
                scaleFont={scaleFont}
                placeholder="7700"
                value={postalCode}
                onChangeText={(text) => {
                  setPostalCode(text);
                  clearError('postalCode');
                }}
                onBlur={() => deferredFieldBlur('postalCode')}
                keyboardType="number-pad"
                error={errors.postalCode}
              />
          </View>

          <View style={{ display: step === 2 ? 'flex' : 'none' }}>
              <Text style={{ ...styles.sectionHeading, fontSize: scaleFont(11) }}>
                PHONE VERIFICATION
              </Text>

              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>
                  CELLPHONE NUMBER
                </Text>
                <PhoneCountryInput
                  country={country}
                  onChangeCountry={handleSelectCountry}
                  phone={phone}
                  onChangePhone={handlePhoneChange}
                  onBlur={() => deferredFieldBlur('phone')}
                  error={errors.phone}
                  scaleFont={scaleFont}
                />
                <FieldError message={errors.phone} scaleFont={scaleFont} />
                <Pressable onPress={handleSendOtp} disabled={phoneVerified} style={styles.otpSendButton}>
                  <LinearGradient
                    colors={colors.wordmarkGradient}
                    locations={colors.wordmarkGradientLocations}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.otpSendButtonGradient}
                  >
                    <Text style={[styles.nextButtonText, { fontSize: scaleFont(11) }]}>
                      {phoneVerified ? 'VERIFIED' : otpSent ? 'RESEND OTP' : 'SEND OTP'}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
          </View>

        </ScrollView>

        <View
          style={[
            styles.footerWrap,
            { paddingBottom: keyboardVisible ? 12 : insets.bottom + 20 },
          ]}
        >
          <View style={styles.navRow}>
            {!isFirstStep && (
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Text style={[styles.backButtonText, { fontSize: scaleFont(10.5) }]}>BACK</Text>
              </Pressable>
            )}
            <Pressable onPress={handleNext} style={styles.nextButton} disabled={isSubmitting}>
              <LinearGradient
                colors={colors.wordmarkGradient}
                locations={colors.wordmarkGradientLocations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextButtonGradient}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#08090b" />
                ) : (
                  <Text style={[styles.nextButtonText, { fontSize: scaleFont(11) }]}>
                    {isLastStep ? 'SIGN UP' : 'NEXT'}
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          <View style={styles.loginRow}>
            <Text style={[styles.loginText, { fontSize: scaleFont(11.5) }]}>
              Already have an account?{' '}
            </Text>
            <Pressable onPress={onLoginPress} hitSlop={8}>
              <Text style={[styles.loginLink, { fontSize: scaleFont(11.5) }]}>Log in</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <OtpModal
        visible={otpModalVisible}
        onClose={() => setOtpModalVisible(false)}
        onVerified={handleOtpVerified}
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
  stepIntro: {
    marginBottom: 22,
  },
  stepLabel: {
    fontFamily: typography.bold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.dotGold,
    textTransform: 'uppercase',
  },
  sectionHeading: {
    fontFamily: typography.bold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.dotGold,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowField: {
    flex: 1,
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
  otpSendButton: {
    marginTop: 8,
  },
  otpSendButtonGradient: {
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  checkboxLabel: {
    fontFamily: typography.semiBold,
    color: colors.text,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
    flexShrink: 1,
  },
  navRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontFamily: typography.bold,
    fontSize: 10.5,
    letterSpacing: 1.3,
    color: colors.text,
  },
  nextButton: {
    flex: 1,
  },
  nextButtonGradient: {
    paddingVertical: 13,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontFamily: typography.bold,
    fontSize: 11,
    letterSpacing: 1.3,
    color: '#08090b',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontFamily: typography.regular,
    fontSize: 11.5,
    color: colors.muted,
  },
  loginLink: {
    fontFamily: typography.semiBold,
    fontSize: 11.5,
    color: colors.dotGold,
    textDecorationLine: 'underline',
  },
});
