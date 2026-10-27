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
  // Below a certain fontSize, scaling the dots and their offset purely
  // linearly makes them shrink into disconnected-looking specks rather than
  // a cohesive mark sitting on the O — clamp to minimums so small usages
  // (e.g. inline in a heading) still read as one unit.
  const dotSize = Math.max(fontSize * 0.16, 3);
  const dotGap = Math.max(fontSize * 0.1, 2);
  const dotsTop = -Math.max(fontSize * 0.32, dotSize + 1);

  // RN's letterSpacing adds trailing space after a Text block's last
  // character, not just between characters — so splitting "KAIROS" into
  // separate KAIR / O / S blocks (needed so the dots can sit over just the
  // O) leaves each block visually detached from the next by that trailing
  // space. Pull each block back by that amount so the word reads as one
  // continuous unit again.
  const trailingSpaceFix = { marginRight: -(fontSize * 0.13) };

  return (
    <View style={styles.row}>
      <View style={trailingSpaceFix}>
        <GradientText
          colors={colors.wordmarkGradient}
          locations={colors.wordmarkGradientLocations}
          style={letterStyle}
        >
          KAIR
        </GradientText>
      </View>

      <View style={[styles.oWrap, trailingSpaceFix]}>
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
