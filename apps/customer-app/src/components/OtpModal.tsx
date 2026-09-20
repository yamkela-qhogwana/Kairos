import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// No SMS provider wired up yet — this fixed code stands in for the real
// backend-issued OTP until that integration exists.
export const MOCK_OTP = '1234';

type Props = {
  visible: boolean;
  onClose: () => void;
  onVerified: () => void;
  phoneDisplay: string;
  scaleFont: (size: number) => number;
};

export function OtpModal({ visible, onClose, onVerified, phoneDisplay, scaleFont }: Props) {
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setOtpValue('');
      setOtpError('');
      setOtpSuccess(false);
    }
  }, [visible]);

  const handleConfirm = () => {
    if (otpValue !== MOCK_OTP) {
      setOtpError('That code is wrong. Please try again.');
      return;
    }
    setOtpSuccess(true);
    successScale.setValue(0);
    successOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(successScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => {
      onClose();
      onVerified();
    }, 950);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalBackdrop} behavior="padding">
        <View style={styles.modalCard}>
          {otpSuccess ? (
            <View style={styles.otpSuccessWrap}>
              <Animated.View
                style={[
                  styles.otpSuccessBadge,
                  { opacity: successOpacity, transform: [{ scale: successScale }] },
                ]}
              >
                <LinearGradient
                  colors={colors.wordmarkGradient}
                  locations={colors.wordmarkGradientLocations}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.otpSuccessBadgeGradient}
                >
                  <MaterialIcons name="check" size={34} color={colors.bgTop} />
                </LinearGradient>
              </Animated.View>
              <Animated.Text
                style={[
                  styles.modalTitle,
                  { fontSize: scaleFont(13), marginTop: 18, opacity: successOpacity },
                ]}
              >
                Number verified
              </Animated.Text>
            </View>
          ) : (
            <>
              <Text style={[styles.modalTitle, { fontSize: scaleFont(13) }]}>Verify your number</Text>
              <Text style={[styles.otpHint, { fontSize: scaleFont(10) }]}>
                Enter the 4-digit code sent to {phoneDisplay || 'your phone'} (use {MOCK_OTP} for
                testing)
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
                autoCorrect={false}
                spellCheck={false}
              />
              {otpError ? (
                <Text style={[styles.errorText, { fontSize: scaleFont(10), textAlign: 'center' }]}>
                  {otpError}
                </Text>
              ) : null}
              <Pressable onPress={handleConfirm} style={styles.modalConfirmButton}>
                <LinearGradient
                  colors={colors.wordmarkGradient}
                  locations={colors.wordmarkGradientLocations}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalConfirmGradient}
                >
                  <Text style={[styles.confirmButtonText, { fontSize: scaleFont(11) }]}>CONFIRM</Text>
                </LinearGradient>
              </Pressable>
              <Pressable onPress={onClose} hitSlop={8} style={styles.modalCancel}>
                <Text style={[styles.modalCancelText, { fontSize: scaleFont(10.5) }]}>Cancel</Text>
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  otpSuccessWrap: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  otpSuccessBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  otpSuccessBadgeGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpHint: {
    fontFamily: typography.regular,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 16,
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
  errorText: {
    fontFamily: typography.medium,
    color: colors.error,
    marginTop: 6,
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
  confirmButtonText: {
    fontFamily: typography.bold,
    fontSize: 11,
    letterSpacing: 1.3,
    color: '#08090b',
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
