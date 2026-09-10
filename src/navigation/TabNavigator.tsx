import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { MiCavaScreen } from '../screens/MiCavaScreen';
import { FavoritosScreen } from '../screens/FavoritosScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, string> = {
  Home: '🏠',
  MiCava: '🍷',
  Favoritos: '♥',
  Perfil: '🙂',
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.maroon,
        tabBarInactiveTintColor: colors.roseLight,
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 8, backgroundColor: colors.cream, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fonts.bodySemiBold, fontSize: 11 },
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>{ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="MiCava" component={MiCavaScreen} options={{ tabBarLabel: 'Mi cava' }} />
      <Tab.Screen name="Favoritos" component={FavoritosScreen} options={{ tabBarLabel: 'Favoritos' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}
