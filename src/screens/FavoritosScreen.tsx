import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWines } from '../hooks/useWines';
import { WineCard } from '../components/WineCard';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import type { MainTabScreenProps } from '../navigation/types';

export function FavoritosScreen({ navigation }: MainTabScreenProps<'Favoritos'>) {
  const { wines, toggleFavorite } = useWines();
  const favoritos = useMemo(() => wines.filter((w) => w.favorito), [wines]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>{favoritos.length} vinos que marcaste con corazón</Text>
      </View>

      <FlatList
        data={favoritos}
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
            Todavía no marcaste ningún vino como favorito. Tocá el corazón en cualquier vino de tu cava.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { paddingHorizontal: 24, paddingTop: 8, gap: 4 },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.maroon },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.rose },
  empty: { fontFamily: fonts.body, fontSize: 13, color: colors.rose, textAlign: 'center', marginTop: 32 },
});
