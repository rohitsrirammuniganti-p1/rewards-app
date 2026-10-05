import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RecommendScreen from '../screens/RecommendScreen';
import WalletStackNavigator from './WalletStackNavigator';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#0a5cbf',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen
        name="Recommend"
        component={RecommendScreen}
        options={{
          title: 'Find Card',
          tabBarLabel: 'Recommend',
        }}
      />
      <Tab.Screen
        name="WalletTab"
        component={WalletStackNavigator}
        options={{
          title: 'My Cards',
          tabBarLabel: 'Wallet',
        }}
      />
    </Tab.Navigator>
  );
}