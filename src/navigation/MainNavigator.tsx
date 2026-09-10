import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { RegistrarVinoScreen } from '../screens/RegistrarVinoScreen';
import { FichaVinoScreen } from '../screens/FichaVinoScreen';
import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="RegistrarVino" component={RegistrarVinoScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="FichaVino" component={FichaVinoScreen} />
    </Stack.Navigator>
  );
}
