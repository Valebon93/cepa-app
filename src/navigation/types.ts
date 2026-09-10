import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type TabParamList = {
  Home: undefined;
  MiCava: undefined;
  Favoritos: undefined;
  Perfil: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  RegistrarVino: undefined;
  FichaVino: { wineId: string };
};

export type MainTabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<MainStackParamList>
>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = NativeStackScreenProps<
  MainStackParamList,
  T
>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;
