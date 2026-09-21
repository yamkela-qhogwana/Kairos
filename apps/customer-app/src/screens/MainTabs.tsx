import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomTabBar, TabKey } from '../components/BottomTabBar';
import { colors } from '../theme/colors';
import { HomeScreen } from './HomeScreen';
import { TrendingScreen } from './TrendingScreen';
import { ForYouScreen } from './ForYouScreen';
import { OnPromotionScreen } from './OnPromotionScreen';

export function MainTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {activeTab === 'home' ? <HomeScreen /> : null}
        {activeTab === 'trending' ? <TrendingScreen /> : null}
        {activeTab === 'forYou' ? <ForYouScreen /> : null}
        {activeTab === 'onPromotion' ? <OnPromotionScreen /> : null}
      </View>
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgTop,
  },
  content: {
    flex: 1,
  },
});
