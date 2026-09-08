import React from "react";
import { StyleSheet, View } from "react-native";
import { GradientText } from "./GradientText";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

type Props = {
  fontSize: number;
};

// Shared KAIR-O-S wordmark (the "O" carries the two signature dots), scaled
// from a single fontSize prop so the same proportions hold whether it's the
// large splash-screen lockup or a small in-card logo.
export function KairosWordmark({ fontSize }: Props) {
  const letterStyle = {
    fontFamily: typography.wordmark,
    fontSize,
    letterSpacing: fontSize * 0.13,
  };
  const dotSize = fontSize * 0.16;
  const dotGap = fontSize * 0.1;
  const dotsTop = -fontSize * 0.32;

  return (
    <View style={styles.row}>
      <GradientText
        colors={colors.wordmarkGradient}
        locations={colors.wordmarkGradientLocations}
        style={letterStyle}
      >
        KAIR
      </GradientText>

      <View style={styles.oWrap}>
        <GradientText
          colors={colors.wordmarkGradient}
          locations={colors.wordmarkGradientLocations}
          style={letterStyle}
        >
          O
        </GradientText>
        <View style={[styles.dotsRow, { top: dotsTop, gap: dotGap }]}>
          <View
            style={[
              styles.dot,
              {
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: colors.dotGold,
              },
            ]}
          />
          <View
            style={[
              styles.dot,
              {
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: colors.dotBlue,
              },
            ]}
          />
        </View>
      </View>

      <GradientText
        colors={colors.wordmarkGradient}
        locations={colors.wordmarkGradientLocations}
        style={letterStyle}
      >
        S
      </GradientText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  oWrap: {
    position: "relative",
  },
  dotsRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {},
});
