import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

export type TabKey = 'home' | 'trending' | 'forYou' | 'onPromotion';

type Props = {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
};

const TABS: {
  key: TabKey;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconActive: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { key: 'trending', label: 'Trending', icon: 'trending-up', iconActive: 'trending-up' },
  { key: 'forYou', label: 'For You', icon: 'thumb-up-outline', iconActive: 'thumb-up' },
  { key: 'onPromotion', label: 'On Promotion', icon: 'tag-outline', iconActive: 'tag' },
];

export function BottomTabBar({ activeTab, onTabPress }: Props) {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + 8 }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const color = isActive ? colors.dotGold : colors.muted;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={styles.tabButton}
            hitSlop={6}
          >
            <MaterialCommunityIcons
              name={isActive ? tab.iconActive : tab.icon}
              size={scaleFont(21)}
              color={color}
            />
            <Text style={[styles.tabLabel, { fontSize: scaleFont(9), color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(232, 201, 160, 0.15)',
    backgroundColor: colors.bgTop,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    fontFamily: typography.medium,
  },
});
