import React, { useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingCollage } from '../components/OnboardingCollage';
import { CardDotPattern } from '../components/CardDotPattern';
import { AccentLetter } from '../components/AccentLetter';
import { PaginationDots } from '../components/PaginationDots';
import { onboardingSlides, OnboardingSlide } from '../data/onboardingSlides';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

const CARD_HORIZONTAL_PADDING = 26;
// Tuned to fit the longest slide's copy at the default system font size.
// Scaled up below by the user's actual font-scale setting so "Larger Text"
// accessibility users don't get their description clipped.
const CARD_TEXT_BASE_HEIGHT = 160;

type Props = {
  onDone?: () => void;
};

const SlideText = React.memo(function SlideText({ item }: { item: OnboardingSlide }) {
  const { width } = useWindowDimensions();
  const pageWidth = width - CARD_HORIZONTAL_PADDING * 2;
  const scaleFont = useScaleFont();
  const eyebrowStyle = [styles.eyebrow, { fontSize: scaleFont(10) }];

  return (
    <View style={[styles.slideText, { width: pageWidth }]}>
      <View style={styles.eyebrowRow}>
        <Text style={[styles.eyebrowMuted, { fontSize: scaleFont(10) }]}>SHOP </Text>
        <Text style={eyebrowStyle}>KAIR</Text>
        <AccentLetter letter="O" style={{ ...styles.eyebrow, fontSize: scaleFont(10) }} />
        <Text style={eyebrowStyle}>S</Text>
      </View>
      <Text style={[styles.title, { fontSize: scaleFont(21) }]}>{item.title}</Text>
      <Text style={[styles.description, { fontSize: scaleFont(12.5) }]}>{item.description}</Text>
    </View>
  );
});

export function OnboardingScreen({ onDone }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // The FlatList sits inside the card's horizontal padding, so each page is
  // narrower than the full screen width — everything driven by scroll
  // position (paging math, getItemLayout, index-from-offset) must agree on
  // this value. Derived from useWindowDimensions (not Dimensions.get, which
  // is captured once and goes stale on Android split-screen/foldables).
  const pageWidth = width - CARD_HORIZONTAL_PADDING * 2;
  const scaleFont = useScaleFont();
  // Real measured height of the tallest slide's text, so the fixed-height
  // pager only reserves as much space as the longest slide actually needs
  // (a hardcoded guess left visible dead space under shorter slides' copy).
  // Starts at a safe fallback estimate to avoid a 0-height flash before the
  // hidden measurement pass below reports in.
  const [cardTextHeight, setCardTextHeight] = useState(
    CARD_TEXT_BASE_HEIGHT * PixelRatio.getFontScale()
  );
  const measuredMax = useRef(0);
  const handleMeasureSlide = (e: LayoutChangeEvent) => {
    const measured = e.nativeEvent.layout.height;
    // Compare against the running max of real measurements only — comparing
    // against the fallback state would let a too-generous initial guess
    // "stick" forever, since Math.max never shrinks.
    if (measured > measuredMax.current) {
      measuredMax.current = measured;
      setCardTextHeight(measured);
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<Animated.FlatList<OnboardingSlide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
        setActiveIndex((prev) => (index !== prev ? index : prev));
      },
    }
  );

  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === onboardingSlides.length - 1;

  const goTo = (index: number) => listRef.current?.scrollToIndex({ index, animated: true });

  const handleNext = () => (isLastSlide ? onDone?.() : goTo(activeIndex + 1));
  const handleBack = () => goTo(Math.max(activeIndex - 1, 0));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <OnboardingCollage />

      <View style={styles.card}>
       <View style={[styles.cardInner, { paddingBottom: 28 + insets.bottom }]}>
        <CardDotPattern />
        <View style={styles.measureLayer} pointerEvents="none">
          {onboardingSlides.map((slide) => (
            <View key={slide.id} onLayout={handleMeasureSlide}>
              <SlideText item={slide} />
            </View>
          ))}
        </View>
        <Animated.FlatList
          ref={listRef}
          style={{ height: cardTextHeight }}
          data={onboardingSlides}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          bounces={false}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          initialNumToRender={onboardingSlides.length}
          getItemLayout={(_, index) => ({
            length: pageWidth,
            offset: pageWidth * index,
            index,
          })}
          renderItem={({ item }) => <SlideText item={item} />}
        />

        <View style={styles.dotsWrap}>
          <PaginationDots count={onboardingSlides.length} activeIndex={activeIndex} />
        </View>

        <View style={styles.buttonRow}>
          <Pressable onPress={isFirstSlide ? onDone : handleBack} style={styles.skipButton}>
            <Text style={[styles.skipButtonText, { fontSize: scaleFont(10.5) }]}>
              {isFirstSlide ? 'SKIP' : 'BACK'}
            </Text>
          </Pressable>
          <Pressable onPress={handleNext} style={styles.nextButton}>
            <LinearGradient
              colors={colors.wordmarkGradient}
              locations={colors.wordmarkGradientLocations}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text style={[styles.nextButtonText, { fontSize: scaleFont(10.5) }]}>
                {isLastSlide ? 'GET STARTED' : 'NEXT'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        <Text style={[styles.legalText, { fontSize: scaleFont(10) }]}>
          By continuing, you are accepting our{' '}
          {/* TODO: link to actual Terms of Service URL once available */}
          <Text style={styles.legalLink}>Terms of Service</Text> and{' '}
          {/* TODO: link to actual Privacy Policy URL once available */}
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </Text>
       </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBottom,
  },
  card: {
    marginTop: -50,
    backgroundColor: colors.bgTop,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: colors.dotGold,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  cardInner: {
    backgroundColor: colors.bgTop,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    paddingHorizontal: 26,
    paddingTop: 18,
    paddingBottom: 28,
  },
  slideText: {
    // width is set inline per-render from useWindowDimensions
  },
  measureLayer: {
    position: 'absolute',
    opacity: 0,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 9,
  },
  eyebrow: {
    fontFamily: typography.bold,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.dotGold,
  },
  eyebrowMuted: {
    fontFamily: typography.semiBold,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.muted,
  },
  title: {
    fontFamily: typography.bold,
    fontSize: 21,
    color: colors.text,
    textAlign: 'left',
    marginTop: 6,
  },
  description: {
    fontFamily: typography.regular,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.muted,
    marginTop: 12,
    textAlign: 'left',
  },
  dotsWrap: {
    marginTop: 22,
  },
  buttonRow: {
    marginTop: 22,
    flexDirection: 'row',
    gap: 10,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
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
    fontSize: 10.5,
    letterSpacing: 1.3,
    color: '#08090b',
  },
  legalText: {
    fontFamily: typography.regular,
    fontSize: 10,
    lineHeight: 15,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 14,
  },
  legalLink: {
    fontFamily: typography.semiBold,
    color: colors.dotGold,
    textDecorationLine: 'underline',
  },
});
