import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import type { AuthStackScreenProps } from '../../navigation/types';

export function LoginScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (!email || !password) {
      setError('Completá tu email y contraseña.');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) setError('No pudimos ingresar. Revisá tus datos e intentá de nuevo.');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.logo}>CEPA</Text>
          <Text style={styles.title}>Bienvenido de nuevo</Text>
          <Text style={styles.subtitle}>Ingresá para ver tu cava.</Text>

          <View style={{ gap: 16, marginTop: 32 }}>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="vos@email.com"
            />
            <TextField
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          <Button
            label="Ingresar"
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: 28 }}
          />

          <Button
            label="Crear una cuenta nueva"
            variant="ghost"
            onPress={() => navigation.navigate('SignUp')}
            style={{ marginTop: 4 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logo: { fontFamily: fonts.display, fontSize: 32, color: colors.maroon, marginBottom: 24 },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.maroon },
  subtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.rose, marginTop: 6 },
  error: { fontFamily: fonts.body, fontSize: 13, color: colors.alertRed },
});
