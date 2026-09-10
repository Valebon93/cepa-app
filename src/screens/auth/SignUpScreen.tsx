import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import type { AuthStackScreenProps } from '../../navigation/types';

export function SignUpScreen({ navigation }: AuthStackScreenProps<'SignUp'>) {
  const { signUp } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (!nombre || !email || !password) {
      setError('Completá todos los campos para crear tu cuenta.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña tiene que tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email.trim(), password, nombre.trim());
    setLoading(false);
    if (error) setError('No pudimos crear tu cuenta. ' + error);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Creá tu cuenta</Text>
          <Text style={styles.subtitle}>Registrá cada vino que probás, a tu manera.</Text>

          <View style={{ gap: 16, marginTop: 28 }}>
            <TextField label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Tu nombre" />
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
              placeholder="Mínimo 6 caracteres"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          <Button label="Crear mi cuenta" onPress={handleSubmit} loading={loading} style={{ marginTop: 28 }} />
          <Button label="Ya tengo cuenta" variant="ghost" onPress={() => navigation.navigate('Login')} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.maroon },
  subtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.rose, marginTop: 6 },
  error: { fontFamily: fonts.body, fontSize: 13, color: colors.alertRed },
});
