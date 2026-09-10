import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWines } from '../hooks/useWines';
import { StarRating } from '../components/StarRating';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import type { MainStackScreenProps } from '../navigation/types';

const VOLVERIA_LABEL: Record<string, string> = { si: 'Sí', tal_vez: 'Tal vez', no: 'No' };

export function FichaVinoScreen({ route, navigation }: MainStackScreenProps<'FichaVino'>) {
  const { wineId } = route.params;
  const { wines, toggleFavorite, removeWine } = useWines();
  const wine = useMemo(() => wines.find((w) => w.id === wineId), [wines, wineId]);
  const [deleting, setDeleting] = useState(false);

  if (!wine) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Text style={styles.headerBack}>Volver</Text>
          </Pressable>
        </View>
        <Text style={styles.empty}>Este vino ya no está en tu cava.</Text>
      </SafeAreaView>
    );
  }

  function confirmarEliminar() {
    Alert.alert('Eliminar vino', `¿Seguro que querés eliminar "${wine!.nombre}" de tu cava?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          const { error } = await removeWine(wine!.id);
          setDeleting(false);
          if (error) Alert.alert('No pudimos eliminar el vino', error);
          else navigation.goBack();
        },
      },
    ]);
  }

  const subtitle = [wine.varietal, wine.cosecha, wine.bodega].filter(Boolean).join(' · ');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Text style={styles.headerBack}>Volver</Text>
        </Pressable>
        <Pressable onPress={() => toggleFavorite(wine.id, !wine.favorito)} hitSlop={10}>
          <Text style={{ fontSize: 22, color: wine.favorito ? colors.maroon : colors.roseLight }}>
            {wine.favorito ? '♥' : '♡'}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.photoBox}>
          {wine.foto_url ? (
            <Image source={{ uri: wine.foto_url }} style={styles.photo} />
          ) : (
            <Text style={{ fontSize: 40 }}>🍷</Text>
          )}
        </View>

        <View>
          <Text style={styles.title}>{wine.nombre}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {wine.region ? <Info label="Región" value={wine.region} /> : null}
        <Info label="Fecha de la cata" value={new Date(wine.fecha_cata).toLocaleDateString('es-AR')} />

        {wine.puntaje ? (
          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Puntaje</Text>
            <StarRating value={wine.puntaje} />
          </View>
        ) : null}

        {wine.notas.length ? (
          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Notas</Text>
            <View style={styles.chipsWrap}>
              {wine.notas.map((n) => (
                <View key={n} style={styles.tag}>
                  <Text style={styles.tagText}>{n}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {wine.que_te_parecio ? <Info label="¿Qué te pareció?" value={wine.que_te_parecio} /> : null}

        {wine.maridaje.length || wine.maridaje_otro ? (
          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Maridaje</Text>
            <View style={styles.chipsWrap}>
              {[...wine.maridaje, ...(wine.maridaje_otro ? [wine.maridaje_otro] : [])].map((m) => (
                <View key={m} style={styles.tag}>
                  <Text style={styles.tagText}>{m}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {wine.donde ? <Info label="Dónde" value={wine.donde} /> : null}
        {wine.con_quien ? <Info label="Con quién" value={wine.con_quien} /> : null}
        {wine.lo_volveria_a_tomar ? (
          <Info label="¿Lo volverías a tomar?" value={VOLVERIA_LABEL[wine.lo_volveria_a_tomar]} />
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={deleting ? 'Eliminando…' : 'Eliminar de mi cava'}
          variant="destructive"
          onPress={confirmarEliminar}
          disabled={deleting}
        />
      </View>
    </SafeAreaView>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerBack: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.rose },
  content: { padding: 24, paddingTop: 4, gap: 18, paddingBottom: 40 },
  photoBox: {
    height: 220,
    borderRadius: 20,
    backgroundColor: colors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.maroon },
  subtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.rose, marginTop: 2 },
  label: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.rose },
  value: { fontFamily: fonts.body, fontSize: 15, color: colors.maroon },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.creamDark,
  },
  tagText: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.maroon },
  empty: { fontFamily: fonts.body, fontSize: 14, color: colors.rose, textAlign: 'center', marginTop: 40 },
  footer: { padding: 20 },
});
