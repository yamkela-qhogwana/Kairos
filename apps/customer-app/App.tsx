import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenNative from 'expo-splash-screen';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { SignUpScreen } from './src/screens/SignUpScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { colors } from './src/theme/colors';
import { typography } from './src/theme/typography';
import { AuthResponse } from './src/api/auth';

SplashScreenNative.preventAutoHideAsync();

const SPLASH_DURATION_MS = 2200;

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [authScreen, setAuthScreen] = useState<'signup' | 'login' | 'forgotPassword'>('signup');
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreenNative.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!fontsLoaded) return;
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <View style={styles.root} onLayout={onLayoutRootView}>
        <StatusBar style="light" />
        {showSplash ? (
          <SplashScreen />
        ) : !onboardingDone ? (
          <OnboardingScreen onDone={() => setOnboardingDone(true)} />
        ) : currentUser ? (
          <View style={styles.homePlaceholder}>
            <Text style={styles.homeTitle}>Welcome, {currentUser.firstName}!</Text>
            <Text style={styles.homeSubtitle}>Your account was created successfully.</Text>
          </View>
        ) : authScreen === 'signup' ? (
          <SignUpScreen
            onLoginPress={() => setAuthScreen('login')}
            onSubmit={(result) => setCurrentUser(result)}
          />
        ) : authScreen === 'login' ? (
          <LoginScreen
            onSignUpPress={() => setAuthScreen('signup')}
            onForgotPasswordPress={() => setAuthScreen('forgotPassword')}
          />
        ) : (
          <ForgotPasswordScreen
            onOtpVerified={() => setAuthScreen('login')}
            onLoginPress={() => setAuthScreen('login')}
            onSignUpPress={() => setAuthScreen('signup')}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgBottom,
  },
  homePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  homeTitle: {
    fontFamily: typography.bold,
    fontSize: 22,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  homeSubtitle: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
});
