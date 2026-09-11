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
import { OrbitGlow } from '../components/OrbitGlow';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

type Props = {
  onSubmit?: () => void;
  onSignUpPress?: () => void;
  onForgotPasswordPress?: () => void;
};

export function LoginScreen({ onSubmit, onSignUpPress, onForgotPasswordPress }: Props) {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

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
              style={[styles.input, { fontSize: scaleFont(13) }]}
              placeholder="jane.doe@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
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
              style={[styles.input, { fontSize: scaleFont(13), marginTop: 6 }]}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
            />
            <Pressable onPress={onForgotPasswordPress} hitSlop={8} style={styles.forgotPasswordButton}>
              <Text style={[styles.forgotPasswordText, { fontSize: scaleFont(10.5) }]}>
                Forgot password?
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <View style={[styles.footerWrap, { paddingBottom: insets.bottom + 20 }]}>
          <Pressable onPress={onSubmit} style={styles.loginButton}>
            <LinearGradient
              colors={colors.wordmarkGradient}
              locations={colors.wordmarkGradientLocations}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButtonGradient}
            >
              <Text style={[styles.loginButtonText, { fontSize: scaleFont(11) }]}>LOG IN</Text>
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
