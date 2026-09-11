import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = {
  label: string;
  hint?: string;
  frontUri: string | null;
  backUri: string | null;
  onPressFront: () => void;
  onPressBack: () => void;
  scaleFont: (size: number) => number;
};

function Slot({
  caption,
  imageUri,
  onPress,
  scaleFont,
}: {
  caption: string;
  imageUri: string | null;
  onPress: () => void;
  scaleFont: (size: number) => number;
}) {
  return (
    <View style={styles.slot}>
      <Pressable onPress={onPress} style={styles.uploadBox}>
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.thumbnail} />
            <View style={styles.changeBadge}>
              <Text style={[styles.changeText, { fontSize: scaleFont(8.5) }]}>CHANGE</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.uploadPlus, { fontSize: scaleFont(18) }]}>+</Text>
            <Text style={[styles.uploadText, { fontSize: scaleFont(9) }]}>TAP TO UPLOAD</Text>
          </>
        )}
      </Pressable>
      <Text style={[styles.sideCaption, { fontSize: scaleFont(9) }]}>{caption}</Text>
    </View>
  );
}

export function DualUploadField({
  label,
  hint,
  frontUri,
  backUri,
  onPressFront,
  onPressBack,
  scaleFont,
}: Props) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { fontSize: scaleFont(10) }]}>{label}</Text>
      {hint ? <Text style={[styles.hint, { fontSize: scaleFont(8.5) }]}>{hint}</Text> : null}
      <View style={styles.row}>
        <Slot caption="FRONT" imageUri={frontUri} onPress={onPressFront} scaleFont={scaleFont} />
        <Slot caption="BACK" imageUri={backUri} onPress={onPressBack} scaleFont={scaleFont} />
      </View>
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  slot: {
    flex: 1,
  },
  uploadBox: {
    height: 90,
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
    marginBottom: 2,
  },
  uploadText: {
    fontFamily: typography.semiBold,
    letterSpacing: 0.5,
    color: colors.muted,
    textAlign: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  changeBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(8, 9, 11, 0.75)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  changeText: {
    fontFamily: typography.bold,
    letterSpacing: 0.5,
    color: colors.dotGold,
  },
  sideCaption: {
    fontFamily: typography.semiBold,
    letterSpacing: 1,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  hint: {
    fontFamily: typography.bold,
    color: '#ffffff',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
});
