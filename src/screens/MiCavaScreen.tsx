import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWines } from '../hooks/useWines';
import { WineCard } from '../components/WineCard';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import type { MainTabScreenProps } from '../navigation/types';

export function MiCavaScreen({ navigation }: MainTabScreenProps<'MiCava'>) {
  const { wines, loading, toggleFavorite } = useWines();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return wines;
    const q = query.trim().toLowerCase();
    return wines.filter((w) =>
      [w.nombre, w.bodega, w.varietal, w.region].filter(Boolean).some((v) => v!.toLowerCase().includes(q))
    );
  }, [wines, query]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi cava</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscá por nombre, bodega, varietal…"
          placeholderTextColor={colors.roseLight}
          style={styles.search}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(w) => w.id}
        contentContainerStyle={{ padding: 24, paddingTop: 8, gap: 10 }}
        renderItem={({ item }) => (
          <WineCard
            wine={item}
            onPress={() => navigation.navigate('FichaVino', { wineId: item.id })}
            onToggleFavorite={() => toggleFavorite(item.id, !item.favorito)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading
              ? 'Cargando tu cava…'
              : query
              ? 'No encontramos vinos que coincidan con tu búsqueda.'
              : 'Todavía no registraste ningún vino.'}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { paddingHorizontal: 24, paddingTop: 8 },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.maroon },
  searchWrap: { paddingHorizontal: 24, paddingTop: 16 },
  search: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.creamCard,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.maroon,
  },
  empty: { fontFamily: fonts.body, fontSize: 13, color: colors.rose, textAlign: 'center', marginTop: 32 },
});
