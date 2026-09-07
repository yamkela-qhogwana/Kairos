import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
import * as Location from 'expo-location';
import { CardDotPattern } from '../components/CardDotPattern';
import { KairosWordmark } from '../components/KairosWordmark';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

type Props = {
  onSubmit?: () => void;
  onLoginPress?: () => void;
};

const STEP_COUNT = 3;
const STEP_INSTRUCTIONS = [
  "LET'S CREATE YOUR ACCOUNT",
  'LET US KNOW WHERE TO DELIVER',
  'LET US KNOW HOW TO CONTACT YOU',
];
// No SMS provider wired up yet — this fixed code stands in for the real
// backend-issued OTP until that integration exists.
const MOCK_OTP = '1234';

type FieldProps = TextInputProps & {
  label: string;
  scaleFont: (size: number) => number;
  style?: object;
};

function FormField({ label, scaleFont, style, ...inputProps }: FieldProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, { fontSize: scaleFont(13) }]}
        {...inputProps}
      />
    </View>
  );
}

export function SignUpScreen({ onSubmit, onLoginPress }: Props) {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();

  const [step, setStep] = useState(0);

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
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isFirstStep = step === 0;
  const isLastStep = step === STEP_COUNT - 1;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

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

  const handlePhoneChange = (text: string) => {
    setPhone(text);
    setPhoneVerified(false);
    setOtpSent(false);
    setOtpModalVisible(false);
    setOtpValue('');
    setOtpError('');
  };

  const handleSendOtp = () => {
    if (!phone.trim()) {
      Alert.alert('Phone number needed', 'Enter your cellphone number first.');
      return;
    }
    setOtpValue('');
    setOtpError('');
    setOtpSent(true);
    setOtpModalVisible(true);
  };

  const handleConfirmOtp = () => {
    if (otpValue === MOCK_OTP) {
      setPhoneVerified(true);
      setOtpModalVisible(false);
    } else {
      setOtpError('That code is wrong. Please try again.');
    }
  };

  const handleNext = () => {
    if (step === 0 && passwordsMismatch) {
      Alert.alert('Passwords do not match', 'Please make sure both password fields match.');
      return;
    }
    if (isLastStep) {
      if (!phoneVerified) {
        Alert.alert('Verify your phone number', 'Please confirm your cellphone number before signing up.');
        return;
      }
      onSubmit?.();
      return;
    }
    setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flexFill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          <View style={styles.stepIntro}>
            <Text style={[styles.stepLabel, { fontSize: scaleFont(11) }]}>
              STEP {step + 1}/{STEP_COUNT}: {STEP_INSTRUCTIONS[step]}
            </Text>
          </View>

          {step === 0 && (
            <>
              <Text style={{ ...styles.sectionHeading, fontSize: scaleFont(11) }}>PROFILE</Text>
              <View style={styles.row}>
                <FormField
                  label="FIRST NAME"
                  scaleFont={scaleFont}
                  placeholder="Jane"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  style={styles.rowField}
                />
                <FormField
                  label="LAST NAME"
                  scaleFont={scaleFont}
                  placeholder="Doe"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  style={styles.rowField}
                />
              </View>

              <FormField
                label="EMAIL ADDRESS"
                scaleFont={scaleFont}
                placeholder="jane.doe@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
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
                <TextInput
                  placeholderTextColor={colors.muted}
                  style={[styles.input, { fontSize: scaleFont(13), marginTop: 6 }]}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>
                  CONFIRM PASSWORD
                </Text>
                <TextInput
                  placeholderTextColor={colors.muted}
                  style={[
                    styles.input,
                    { fontSize: scaleFont(13) },
                    passwordsMismatch && styles.inputError,
                  ]}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                />
                {passwordsMismatch && (
                  <Text style={[styles.errorText, { fontSize: scaleFont(10) }]}>
                    Passwords do not match.
                  </Text>
                )}
              </View>
            </>
          )}

          {step === 1 && (
            <>
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
                    <Text style={styles.checkboxTick}>✓</Text>
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
                onChangeText={setStreetAddress}
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
                  onChangeText={setSuburb}
                  style={styles.rowField}
                />
                <FormField
                  label="CITY"
                  scaleFont={scaleFont}
                  placeholder="Cape Town"
                  value={city}
                  onChangeText={setCity}
                  style={styles.rowField}
                />
              </View>
              <FormField
                label="POSTAL CODE"
                scaleFont={scaleFont}
                placeholder="7700"
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="number-pad"
              />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={{ ...styles.sectionHeading, fontSize: scaleFont(11) }}>
                PHONE VERIFICATION
              </Text>

              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>
                  CELLPHONE NUMBER
                </Text>
                <TextInput
                  placeholderTextColor={colors.muted}
                  style={[styles.input, { fontSize: scaleFont(13) }]}
                  placeholder="+27 71 234 5678"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                />
                <Pressable onPress={handleSendOtp} disabled={phoneVerified} style={styles.otpSendButton}>
                  <LinearGradient
                    colors={colors.wordmarkGradient}
                    locations={colors.wordmarkGradientLocations}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.otpSendButtonGradient}
                  >
                    <Text style={[styles.nextButtonText, { fontSize: scaleFont(11) }]}>
                      {phoneVerified ? 'VERIFIED ✓' : otpSent ? 'RESEND OTP' : 'SEND OTP'}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </>
          )}

        </ScrollView>

        <View style={[styles.footerWrap, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.navRow}>
            {!isFirstStep && (
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Text style={[styles.backButtonText, { fontSize: scaleFont(10.5) }]}>BACK</Text>
              </Pressable>
            )}
            <Pressable onPress={handleNext} style={styles.nextButton}>
              <LinearGradient
                colors={colors.wordmarkGradient}
                locations={colors.wordmarkGradientLocations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextButtonGradient}
              >
                <Text style={[styles.nextButtonText, { fontSize: scaleFont(11) }]}>
                  {isLastStep ? 'SIGN UP' : 'NEXT'}
                </Text>
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

      <Modal
        visible={otpModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOtpModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={[styles.modalTitle, { fontSize: scaleFont(13) }]}>Verify your number</Text>
            <Text style={[styles.otpHint, { fontSize: scaleFont(10) }]}>
              Enter the 4-digit code sent to {phone || 'your phone'} (use {MOCK_OTP} for testing)
            </Text>
            <TextInput
              placeholderTextColor={colors.muted}
              style={[styles.modalInput, { fontSize: scaleFont(18) }]}
              placeholder="0000"
              value={otpValue}
              onChangeText={(text) => {
                setOtpValue(text);
                setOtpError('');
              }}
              keyboardType="number-pad"
              maxLength={4}
              autoFocus
            />
            {otpError ? (
              <Text style={[styles.errorText, { fontSize: scaleFont(10), textAlign: 'center' }]}>
                {otpError}
              </Text>
            ) : null}
            <Pressable onPress={handleConfirmOtp} style={styles.modalConfirmButton}>
              <LinearGradient
                colors={colors.wordmarkGradient}
                locations={colors.wordmarkGradientLocations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalConfirmGradient}
              >
                <Text style={[styles.nextButtonText, { fontSize: scaleFont(11) }]}>CONFIRM</Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => setOtpModalVisible(false)} hitSlop={8} style={styles.modalCancel}>
              <Text style={[styles.modalCancelText, { fontSize: scaleFont(10.5) }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  errorText: {
    fontFamily: typography.medium,
    color: colors.error,
    marginTop: 6,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.2,
    borderColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  checkboxTick: {
    color: colors.text,
    fontFamily: typography.bold,
    fontSize: 10,
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
  otpHint: {
    fontFamily: typography.regular,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.bgTop,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.25)',
    paddingHorizontal: 22,
    paddingVertical: 26,
  },
  modalTitle: {
    fontFamily: typography.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalInput: {
    fontFamily: typography.bold,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.2)',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 6,
  },
  modalConfirmButton: {
    marginTop: 16,
  },
  modalConfirmGradient: {
    paddingVertical: 13,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancel: {
    marginTop: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontFamily: typography.semiBold,
    color: colors.muted,
  },
});
