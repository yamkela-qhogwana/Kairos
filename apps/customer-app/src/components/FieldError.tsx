import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export function FieldError({
  message,
  scaleFont,
}: {
  message?: string;
  scaleFont: (size: number) => number;
}) {
  if (!message) return null;
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>✕</Text>
      </View>
      <Text style={[styles.text, { fontSize: scaleFont(9.5) }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 5,
  },
  icon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(224, 133, 126, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: colors.error,
    fontSize: 9,
    fontFamily: typography.bold,
    lineHeight: 10,
  },
  text: {
    fontFamily: typography.medium,
    color: colors.error,
    flexShrink: 1,
  },
});
