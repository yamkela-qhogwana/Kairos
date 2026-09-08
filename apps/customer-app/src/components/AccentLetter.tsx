import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

type Props = {
  letter: string;
  style?: TextStyle;
};

export function AccentLetter({ letter, style }: Props) {
  return (
    <View style={styles.column}>
      <View style={styles.dotsRow}>
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <MaskedView maskElement={<Text style={style}>{letter}</Text>}>
        <LinearGradient
          colors={colors.wordmarkGradient}
          locations={colors.wordmarkGradientLocations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[style, styles.hidden]}>{letter}</Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
  },
  hidden: {
    opacity: 0,
  },
  dotsRow: {
    height: 7,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.dotGold,
  },
});
