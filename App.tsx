import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
import { colors } from './src/theme/colors';
import { typography } from './src/theme/typography';

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
    <SafeAreaProvider>
      <View style={styles.root} onLayout={onLayoutRootView}>
        <StatusBar style="light" />
        {showSplash ? (
          <SplashScreen />
        ) : !onboardingDone ? (
          <OnboardingScreen onDone={() => setOnboardingDone(true)} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Home screen coming soon</Text>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    backgroundColor: colors.bgBottom,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.muted,
  },
});
