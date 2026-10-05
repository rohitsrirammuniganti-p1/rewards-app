import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalletScreen from '../screens/WalletScreen';
import AddCardScreen from '../screens/AddCardScreen';

const WalletStack = createNativeStackNavigator();

export default function WalletStackNavigator() {
  return (
    <WalletStack.Navigator>
      <WalletStack.Screen 
        name="WalletHome" 
        component={WalletScreen}
        options={{ headerShown: false }}
      />
      <WalletStack.Screen 
        name="AddCard"
        component={AddCardScreen}
        options={{ title: 'Add a Card', headerBackTitle: 'Back' }}
      />
    </WalletStack.Navigator>
  );
}