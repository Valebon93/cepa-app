import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useWines } from '../hooks/useWines';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export function PerfilScreen() {
  const { user, signOut } = useAuth();
  const { wines } = useWines();

  const nombre = (user?.user_metadata as any)?.nombre ?? 'Vos';
  const regiones = new Set(wines.map((w) => w.region).filter(Boolean)).size;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
        <View>
          <Text style={styles.title}>Perfil</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 24 }}>🙂</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{nombre}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat value={wines.length} label="catas" />
          <Stat value={new Set(wines.map((w) => w.bodega).filter(Boolean)).size} label="bodegas" />
          <Stat value={regiones} label="regiones" />
        </View>

        <Button label="Cerrar sesión" variant="secondary" onPress={signOut} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.maroon },
  card: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: 20,
    padding: 18,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontFamily: fonts.display, fontSize: 17, color: colors.white },
  email: { fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statTile: {
    flex: 1,
    backgroundColor: colors.creamCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    alignItems: 'center',
    gap: 2,
  },
  statValue: { fontFamily: fonts.display, fontSize: 20, color: colors.maroon },
  statLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.rose },
});
