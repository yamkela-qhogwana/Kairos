import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KairosWordmark } from './KairosWordmark';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

const SCREEN_PADDING = 16;

type Props = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
};

export function AppHeader({ searchQuery, onSearchChange }: Props) {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.headerTopRow}>
        <KairosWordmark fontSize={scaleFont(18)} />
        <View style={styles.headerIconsRow}>
          <Pressable hitSlop={10} style={styles.headerIconButton}>
            <MaterialCommunityIcons name="heart-outline" size={scaleFont(22)} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={10} style={styles.headerIconButton}>
            <MaterialCommunityIcons name="shopping-outline" size={scaleFont(22)} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={10} style={styles.headerIconButton}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={scaleFont(24)}
              color={colors.text}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={scaleFont(18)} color={colors.muted} />
        <TextInput
          placeholder="Search Kairos"
          placeholderTextColor={colors.muted}
          style={[styles.searchInput, { fontSize: scaleFont(13) }]}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 14,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    padding: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.regular,
    color: colors.text,
    padding: 0,
  },
});
