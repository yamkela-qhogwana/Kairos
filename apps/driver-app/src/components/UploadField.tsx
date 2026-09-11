import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = {
  label: string;
  hint?: string;
  imageUri: string | null;
  onPress: () => void;
  scaleFont: (size: number) => number;
};

export function UploadField({ label, hint, imageUri, onPress, scaleFont }: Props) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>{label}</Text>
      {hint ? <Text style={[styles.hint, { fontSize: scaleFont(8.5) }]}>{hint}</Text> : null}
      <Pressable onPress={onPress} style={styles.uploadBox}>
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.thumbnail} />
            <View style={styles.changeBadge}>
              <Text style={[styles.changeText, { fontSize: scaleFont(9) }]}>CHANGE</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.uploadPlus, { fontSize: scaleFont(20) }]}>+</Text>
            <Text style={[styles.uploadText, { fontSize: scaleFont(10) }]}>TAP TO UPLOAD</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  uploadBox: {
    height: 110,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(232, 201, 160, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  uploadPlus: {
    fontFamily: typography.bold,
    color: colors.dotGold,
    marginBottom: 4,
  },
  uploadText: {
    fontFamily: typography.semiBold,
    letterSpacing: 1,
    color: colors.muted,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  changeBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(8, 9, 11, 0.75)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeText: {
    fontFamily: typography.bold,
    letterSpacing: 1,
    color: colors.dotGold,
  },
  hint: {
    fontFamily: typography.bold,
    color: '#ffffff',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
});
