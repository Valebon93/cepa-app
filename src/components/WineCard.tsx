import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import type { Wine } from '../types/models';

interface Props {
  wine: Wine;
  onPress: () => void;
  onToggleFavorite?: () => void;
}

export function WineCard({ wine, onPress, onToggleFavorite }: Props) {
  const subtitle = [wine.varietal, wine.cosecha, wine.bodega].filter(Boolean).join(' · ');

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.thumb}>
        {wine.foto_url ? (
          <Image source={{ uri: wine.foto_url }} style={styles.thumbImg} />
        ) : (
          <Text style={styles.thumbPlaceholder}>🍷</Text>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {wine.nombre}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle || 'Sin datos adicionales'}
        </Text>
      </View>

      {onToggleFavorite ? (
        <Pressable onPress={onToggleFavorite} hitSlop={10} style={styles.heart}>
          <Text style={{ fontSize: 18, color: wine.favorito ? colors.maroon : colors.roseLight }}>
            {wine.favorito ? '♥' : '♡'}
          </Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.creamCard,
    borderRadius: 18,
    padding: 13,
  },
  thumb: {
    width: 40,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImg: { width: '100%', height: '100%' },
  thumbPlaceholder: { fontSize: 18 },
  info: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.maroon },
  subtitle: { fontFamily: fonts.body, fontSize: 12, color: colors.rose },
  heart: { paddingLeft: 4 },
});
