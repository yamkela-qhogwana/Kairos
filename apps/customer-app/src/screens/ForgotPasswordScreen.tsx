import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

type Props = {
  onOtpVerified?: () => void;
  onLoginPress?: () => void;
  onSignUpPress?: () => void;
};

// No SMS provider wired up yet — this fixed code stands in for the real
// backend-issued OTP until that integration exists.
const MOCK_OTP = '1234';

export function ForgotPasswordScreen({ onOtpVerified, onLoginPress, onSignUpPress }: Props) {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleSendOtp = () => {
    if (!email.trim() || !phone.trim()) {
      setOtpError('Enter your email address and mobile number first.');
      return;
    }
    setOtpValue('');
    setOtpError('');
    setOtpSent(true);
  };

  const handleConfirmOtp = () => {
    if (otpValue === MOCK_OTP) {
      onOtpVerified?.();
    } else {
      setOtpError('That code is wrong. Please try again.');
    }
  };

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
          <Text style={[styles.stepLabel, { fontSize: scaleFont(11) }]}>FORGOT PASSWORD</Text>
          <Text style={[styles.instruction, { fontSize: scaleFont(11.5) }]}>
            Enter your email address and mobile number, and we'll send you a code to reset your
            password
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
                setOtpSent(false);
                setOtpValue('');
                setOtpError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>MOBILE NUMBER</Text>
            <TextInput
              placeholderTextColor={colors.muted}
              style={[styles.input, { fontSize: scaleFont(13) }]}
              placeholder="+27 71 234 5678"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setOtpSent(false);
                setOtpValue('');
                setOtpError('');
              }}
              keyboardType="phone-pad"
            />
          </View>

          {!otpSent ? (
            <Pressable onPress={handleSendOtp} style={styles.otpSendButton}>
              <LinearGradient
                colors={colors.wordmarkGradient}
                locations={colors.wordmarkGradientLocations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.otpSendButtonGradient}
              >
                <Text style={[styles.otpButtonText, { fontSize: scaleFont(11) }]}>SEND OTP</Text>
              </LinearGradient>
            </Pressable>
          ) : (
            <View style={styles.otpBlock}>
              <Text style={[styles.otpHint, { fontSize: scaleFont(10.5) }]}>
                Enter the 4-digit code sent to {phone} (use {MOCK_OTP} for testing)
              </Text>
              <TextInput
                placeholderTextColor={colors.muted}
                style={[styles.otpInput, { fontSize: scaleFont(18) }]}
                placeholder="0000"
                value={otpValue}
                onChangeText={(text) => {
                  setOtpValue(text);
                  setOtpError('');
                }}
                keyboardType="number-pad"
                maxLength={4}
              />
              <Pressable onPress={handleConfirmOtp} style={styles.otpSendButton}>
                <LinearGradient
                  colors={colors.wordmarkGradient}
                  locations={colors.wordmarkGradientLocations}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.otpSendButtonGradient}
                >
                  <Text style={[styles.otpButtonText, { fontSize: scaleFont(11) }]}>
                    ENTER OTP
                  </Text>
                </LinearGradient>
              </Pressable>
              <Pressable onPress={handleSendOtp} hitSlop={8} style={styles.resendButton}>
                <Text style={[styles.resendText, { fontSize: scaleFont(10.5) }]}>RESEND OTP</Text>
              </Pressable>
            </View>
          )}

          {otpError ? (
            <Text style={[styles.errorText, { fontSize: scaleFont(10) }]}>{otpError}</Text>
          ) : null}
        </ScrollView>

        <View style={[styles.footerWrap, { paddingBottom: insets.bottom + 20 }]}>
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
  errorText: {
    fontFamily: typography.medium,
    color: colors.error,
    marginTop: 6,
  },
  otpSendButton: {
    marginTop: 4,
  },
  otpSendButtonGradient: {
    paddingVertical: 13,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpButtonText: {
    fontFamily: typography.bold,
    fontSize: 11,
    letterSpacing: 1.3,
    color: '#08090b',
  },
  otpBlock: {
    marginTop: 4,
  },
  otpHint: {
    fontFamily: typography.regular,
    color: colors.muted,
    marginBottom: 12,
  },
  otpInput: {
    fontFamily: typography.bold,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.2)',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  resendButton: {
    alignSelf: 'center',
    marginTop: 14,
  },
  resendText: {
    fontFamily: typography.semiBold,
    color: colors.dotGold,
    letterSpacing: 1,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
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
