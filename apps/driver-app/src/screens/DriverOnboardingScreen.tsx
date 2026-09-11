import React, { useState } from 'react';
import {
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
import * as ImagePicker from 'expo-image-picker';
import { CardDotPattern } from '../components/CardDotPattern';
import { KairosWordmark } from '../components/KairosWordmark';
import { UploadField } from '../components/UploadField';
import { DualUploadField } from '../components/DualUploadField';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

type Props = {
  onSubmit?: () => void;
};

const STEP_COUNT = 7;
// No SMS provider wired up yet — this fixed code stands in for the real
// backend-issued OTP until that integration exists.
const MOCK_OTP = '1234';

const VEHICLE_TYPES = ['Car', 'Motorbike', 'Scooter', 'Bicycle'] as const;
type VehicleType = (typeof VEHICLE_TYPES)[number];

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

export function DriverOnboardingScreen({ onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();

  const [step, setStep] = useState(0);

  // Step 0 — personal details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Step 1 — identity
  const [idNumber, setIdNumber] = useState('');
  const [idDocumentFrontUri, setIdDocumentFrontUri] = useState<string | null>(null);
  const [idDocumentBackUri, setIdDocumentBackUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);

  // Step 2 — driver's license
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [licensePhotoFrontUri, setLicensePhotoFrontUri] = useState<string | null>(null);
  const [licensePhotoBackUri, setLicensePhotoBackUri] = useState<string | null>(null);
  const [prdpNumber, setPrdpNumber] = useState('');
  const [prdpPhotoUri, setPrdpPhotoUri] = useState<string | null>(null);

  // Step 3 — vehicle
  const [vehicleType, setVehicleType] = useState<VehicleType>('Car');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleRegoUri, setVehicleRegoUri] = useState<string | null>(null);

  // Step 4 — banking
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchCode, setBranchCode] = useState('');

  // Step 5 — phone verification
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  const isFirstStep = step === 0;
  const isLastStep = step === STEP_COUNT - 1;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const pickImage = async (setter: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Photo access needed', 'Enable photo library access to upload this document.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setter(result.assets[0].uri);
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
    // Validation temporarily disabled while reviewing the screens.
    if (isLastStep) {
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
          <Text style={[styles.tagline, { fontSize: scaleFont(9) }]}>APP FOR DRIVERS</Text>
        </View>

        <ScrollView
          style={styles.flexFill}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.stepIntro}>
            <Text style={[styles.stepLabel, { fontSize: scaleFont(11) }]}>
              STEP {step + 1}/{STEP_COUNT}
            </Text>
          </View>

          {step === 0 && (
            <>
              <Text style={{ ...styles.sectionHeading, fontSize: scaleFont(11) }}>PERSONAL DETAILS</Text>
              <View style={styles.row}>
                <FormField
                  label="FIRST NAME"
                  scaleFont={scaleFont}
                  placeholder="Thabo"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  style={styles.rowField}
                />
                <FormField
                  label="LAST NAME"
                  scaleFont={scaleFont}
                  placeholder="Nkosi"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  style={styles.rowField}
                />
              </View>
              <FormField
                label="EMAIL ADDRESS"
                scaleFont={scaleFont}
                placeholder="thabo.nkosi@email.com"
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
                <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>CONFIRM PASSWORD</Text>
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
              <Text style={{ ...styles.sectionHeading, fontSize: scaleFont(11) }}>
                IDENTITY VERIFICATION
              </Text>
              <FormField
                label="ID NUMBER"
                scaleFont={scaleFont}
                placeholder="South African ID or passport number"
                value={idNumber}
                onChangeText={setIdNumber}
              />
              <DualUploadField
                label="ID DOCUMENT"
                hint="A clear photo of both sides of your ID book, ID card, or passport."
                frontUri={idDocumentFrontUri}
                backUri={idDocumentBackUri}
                onPressFront={() => pickImage(setIdDocumentFrontUri)}
                onPressBack={() => pickImage(setIdDocumentBackUri)}
                scaleFont={scaleFont}
              />
              <UploadField
                label="SELFIE"
                hint="A clear photo of your face, used to match against your ID."
                imageUri={selfieUri}
                onPress={() => pickImage(setSelfieUri)}
                scaleFont={scaleFont}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={{ ...styles.sectionHeading, fontSize: scaleFont(11) }}>
                DRIVER'S LICENSE
              </Text>
              <FormField
                label="LICENSE NUMBER"
                scaleFont={scaleFont}
                placeholder="e.g. 1234567890123"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
              <FormField
                label="EXPIRY DATE"
                scaleFont={scaleFont}
                placeholder="DD/MM/YYYY"
                value={licenseExpiry}
                onChangeText={setLicenseExpiry}
              />
              <DualUploadField
                label="LICENSE PHOTO"
                hint="A clear photo of both sides of your valid driver's license."
                frontUri={licensePhotoFrontUri}
                backUri={licensePhotoBackUri}
                onPressFront={() => pickImage(setLicensePhotoFrontUri)}
                onPressBack={() => pickImage(setLicensePhotoBackUri)}
                scaleFont={scaleFont}
              />
            </>
          )}

          {step === 3 && (
            <>
              <Text style={{ ...styles.sectionHeading, fontSize: scaleFont(11) }}>
                PROFESSIONAL DRIVING PERMIT
              </Text>
              <FormField
                label="PrDP NUMBER"
                scaleFont={scaleFont}
                placeholder="Professional Driving Permit number"
                value={prdpNumber}
                onChangeText={setPrdpNumber}
              />
              <UploadField
                label="PrDP DOCUMENT"
                hint="Required in South Africa for transporting goods for reward."
                imageUri={prdpPhotoUri}
                onPress={() => pickImage(setPrdpPhotoUri)}
                scaleFont={scaleFont}
              />
            </>
          )}

          {step === 4 && (
            <>
              <Text style={{ ...styles.sectionHeading, fontSize: scaleFont(11) }}>
                VEHICLE DETAILS
              </Text>
              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>VEHICLE TYPE</Text>
                <View style={styles.chipRow}>
                  {VEHICLE_TYPES.map((type) => (
                    <Pressable
                      key={type}
                      onPress={() => setVehicleType(type)}
                      style={[styles.chip, vehicleType === type && styles.chipActive]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          vehicleType === type && styles.chipTextActive,
                          { fontSize: scaleFont(10) },
                        ]}
                      >
                        {type.toUpperCase()}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={styles.row}>
                <FormField
                  label="MAKE"
                  scaleFont={scaleFont}
                  placeholder="Toyota"
                  value={vehicleMake}
                  onChangeText={setVehicleMake}
                  style={styles.rowField}
                />
                <FormField
                  label="MODEL"
                  scaleFont={scaleFont}
                  placeholder="Corolla"
                  value={vehicleModel}
                  onChangeText={setVehicleModel}
                  style={styles.rowField}
                />
              </View>
              <View style={styles.row}>
                <FormField
                  label="YEAR"
                  scaleFont={scaleFont}
                  placeholder="2020"
                  value={vehicleYear}
                  onChangeText={setVehicleYear}
                  keyboardType="number-pad"
                  style={styles.rowField}
                />
                <FormField
                  label="LICENSE PLATE"
                  scaleFont={scaleFont}
                  placeholder="CA 123-456"
                  value={licensePlate}
                  onChangeText={setLicensePlate}
                  autoCapitalize="characters"
                  style={styles.rowField}
                />
              </View>
              <UploadField
                label="VEHICLE REGISTRATION"
                hint="A clear photo of your vehicle registration document."
                imageUri={vehicleRegoUri}
                onPress={() => pickImage(setVehicleRegoUri)}
                scaleFont={scaleFont}
              />
            </>
          )}

          {step === 5 && (
            <>
              <Text style={{ ...styles.sectionHeading, fontSize: scaleFont(11) }}>
                BANKING DETAILS
              </Text>
              <FormField
                label="BANK NAME"
                scaleFont={scaleFont}
                placeholder="e.g. Standard Bank"
                value={bankName}
                onChangeText={setBankName}
              />
              <FormField
                label="ACCOUNT HOLDER NAME"
                scaleFont={scaleFont}
                placeholder="As it appears on your account"
                value={accountHolder}
                onChangeText={setAccountHolder}
                autoCapitalize="words"
              />
              <FormField
                label="ACCOUNT NUMBER"
                scaleFont={scaleFont}
                placeholder="1234567890"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="number-pad"
              />
              <FormField
                label="BRANCH CODE"
                scaleFont={scaleFont}
                placeholder="e.g. 051001"
                value={branchCode}
                onChangeText={setBranchCode}
                keyboardType="number-pad"
              />
            </>
          )}

          {step === 6 && (
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
                  {isLastStep ? 'SUBMIT' : 'NEXT'}
                </Text>
              </LinearGradient>
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  chipActive: {
    borderColor: colors.dotGold,
    backgroundColor: 'rgba(232, 201, 160, 0.14)',
  },
  chipText: {
    fontFamily: typography.semiBold,
    letterSpacing: 1,
    color: colors.muted,
  },
  chipTextActive: {
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
  otpHint: {
    fontFamily: typography.semiBold,
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
