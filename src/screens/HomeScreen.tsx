import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useWines } from '../hooks/useWines';
import { WineCard } from '../components/WineCard';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import type { MainTabScreenProps } from '../navigation/types';

export function HomeScreen({ navigation }: MainTabScreenProps<'Home'>) {
  const { user } = useAuth();
  const { wines, toggleFavorite } = useWines();

  const nombre = (user?.user_metadata as any)?.nombre ?? 'vos';
  const recientes = useMemo(() => wines.slice(0, 5), [wines]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={recientes}
        keyExtractor={(w) => w.id}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, gap: 18 }}>
            <View>
              <Text style={styles.greeting}>Buenas, {nombre}</Text>
              <Text style={styles.title}>¿Qué vino vamos a{'\n'}recordar hoy?</Text>
            </View>

            <View style={styles.cta} onTouchEnd={() => navigation.navigate('RegistrarVino')}>
              <Text style={styles.ctaIcon}>📷</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.ctaTitle}>Sacale una foto a tu vino</Text>
                <Text style={styles.ctaSubtitle}>Guardá la etiqueta y registrá lo que sentiste</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <Stat value={wines.length} label="vinos registrados" color={colors.maroon} />
              <Stat
                value={
                  wines.length
                    ? (wines.reduce((s, w) => s + (w.puntaje ?? 0), 0) / wines.length).toFixed(1)
                    : '—'
                }
                label="puntaje promedio"
                color={colors.purple}
              />
              <Stat value={wines.filter((w) => w.favorito).length} label="favoritos" color={colors.olive} />
            </View>

            <Text style={styles.sectionTitle}>Últimas catas</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 24, marginBottom: 10 }}>
            <WineCard
              wine={item}
              onPress={() => navigation.navigate('FichaVino', { wineId: item.id })}
              onToggleFavorite={() => toggleFavorite(item.id, !item.favorito)}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Todavía no registraste ningún vino. ¡Sacale una foto al primero!</Text>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}

function Stat({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <View style={[styles.statTile, { backgroundColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  greeting: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.purple },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.maroon, marginTop: 4 },
  cta: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.maroon,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
  },
  ctaIcon: { fontSize: 28 },
  ctaTitle: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.white },
  ctaSubtitle: { fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statTile: { flex: 1, borderRadius: 16, padding: 12, gap: 2 },
  statValue: { fontFamily: fonts.display, fontSize: 20, color: colors.white },
  statLabel: { fontFamily: fonts.body, fontSize: 11, color: 'rgba(255,255,255,0.85)' },
  sectionTitle: { fontFamily: fonts.display, fontSize: 17, color: colors.maroon, marginTop: 4 },
  empty: { fontFamily: fonts.body, fontSize: 13, color: colors.rose, paddingHorizontal: 24 },
});
