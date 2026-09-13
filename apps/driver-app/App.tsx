import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initialWindowMetrics, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { DriverOnboardingScreen } from './src/screens/DriverOnboardingScreen';
import { DriverLoginScreen } from './src/screens/DriverLoginScreen';
import { DriverForgotPasswordScreen } from './src/screens/DriverForgotPasswordScreen';
import { colors } from './src/theme/colors';

SplashScreenNative.preventAutoHideAsync();

const SPLASH_DURATION_MS = 2200;

function Home() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.home, { paddingTop: insets.top + 24 }]}>
      <Text style={styles.homeTitle}>KAIROS DRIVER</Text>
      <Text style={styles.homeSubtitle}>Deliveries will show up here.</Text>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });
  const [showSplash, setShowSplash] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [authScreen, setAuthScreen] = useState<'signup' | 'login' | 'forgotPassword'>('signup');

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
        ) : registered ? (
          <Home />
        ) : authScreen === 'login' ? (
          <DriverLoginScreen
            onSubmit={() => setRegistered(true)}
            onSignUpPress={() => setAuthScreen('signup')}
            onForgotPasswordPress={() => setAuthScreen('forgotPassword')}
          />
        ) : authScreen === 'forgotPassword' ? (
          <DriverForgotPasswordScreen
            onOtpVerified={() => setAuthScreen('login')}
            onLoginPress={() => setAuthScreen('login')}
            onSignUpPress={() => setAuthScreen('signup')}
          />
        ) : (
          <DriverOnboardingScreen
            onSubmit={() => setRegistered(true)}
            onLoginPress={() => setAuthScreen('login')}
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
  home: {
    flex: 1,
    backgroundColor: colors.bgTop,
    alignItems: 'center',
  },
  homeTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.text,
  },
  homeSubtitle: {
    marginTop: 10,
    fontSize: 13,
    color: colors.muted,
  },
});
