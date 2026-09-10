import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { useWines } from '../hooks/useWines';
import { uploadWinePhoto } from '../lib/uploadPhoto';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { Chip } from '../components/Chip';
import { StarRating } from '../components/StarRating';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import type { LoVolveria } from '../types/models';
import type { MainStackScreenProps } from '../navigation/types';

const NOTAS = ['Frutado', 'Especiado', 'Floral', 'Amaderado', 'Terroso', 'Cítrico', 'Dulce', 'Seco'];
const MARIDAJES = ['Carnes rojas', 'Pescados', 'Pastas', 'Quesos', 'Postres', 'Picadas'];
const OPCIONES_VOLVERIA: { value: LoVolveria; label: string }[] = [
  { value: 'si', label: 'Sí' },
  { value: 'tal_vez', label: 'Tal vez' },
  { value: 'no', label: 'No' },
];

export function RegistrarVinoScreen({ navigation }: MainStackScreenProps<'RegistrarVino'>) {
  const { user } = useAuth();
  const { addWine } = useWines();

  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [bodega, setBodega] = useState('');
  const [varietal, setVarietal] = useState('');
  const [cosecha, setCosecha] = useState('');
  const [region, setRegion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notas, setNotas] = useState<string[]>([]);
  const [queTeParecio, setQueTeParecio] = useState('');
  const [maridaje, setMaridaje] = useState<string[]>([]);
  const [maridajeOtro, setMaridajeOtro] = useState('');
  const [donde, setDonde] = useState('');
  const [conQuien, setConQuien] = useState('');
  const [loVolveria, setLoVolveria] = useState<LoVolveria | null>(null);
  const [puntaje, setPuntaje] = useState(0);
  const [saving, setSaving] = useState(false);

  async function tomarFoto() {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Necesitamos acceso a la cámara', 'Activá el permiso de cámara para sacarle una foto a tu vino.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true, aspect: [3, 4] });
    if (!result.canceled && result.assets?.[0]) {
      setFotoUri(result.assets[0].uri);
    }
  }

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function guardar() {
    if (!user) return;
    if (!nombre.trim()) {
      Alert.alert('Falta el nombre', 'Contanos qué vino estás registrando.');
      return;
    }
    setSaving(true);
    try {
      let foto_url: string | null = null;
      if (fotoUri) {
        foto_url = await uploadWinePhoto(user.id, fotoUri);
      }
      const { error } = await addWine({
        nombre: nombre.trim(),
        bodega: bodega.trim() || null,
        varietal: varietal.trim() || null,
        cosecha: cosecha.trim() ? Number(cosecha.trim()) : null,
        region: region.trim() || null,
        foto_url,
        fecha_cata: fecha.toISOString(),
        puntaje: puntaje || null,
        notas,
        que_te_parecio: queTeParecio.trim() || null,
        maridaje,
        maridaje_otro: maridajeOtro.trim() || null,
        donde: donde.trim() || null,
        con_quien: conQuien.trim() || null,
        lo_volveria_a_tomar: loVolveria,
      });
      if (error) {
        Alert.alert('No pudimos guardar el vino', error);
        return;
      }
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Text style={styles.headerBack}>Cancelar</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Registrar vino</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.photoBox} onPress={tomarFoto}>
            {fotoUri ? (
              <Image source={{ uri: fotoUri }} style={styles.photo} />
            ) : (
              <>
                <Text style={styles.photoIcon}>📷</Text>
                <Text style={styles.photoText}>Sacale una foto a la etiqueta</Text>
              </>
            )}
          </Pressable>
          {fotoUri ? (
            <Pressable onPress={tomarFoto}>
              <Text style={styles.retake}>Sacar otra foto</Text>
            </Pressable>
          ) : null}

          <TextField label="Nombre del vino" value={nombre} onChangeText={setNombre} placeholder="Ej: Malbec Reserva" />
          <TextField label="Bodega" optional value={bodega} onChangeText={setBodega} placeholder="Ej: Catena Zapata" />
          <TextField label="Varietal" optional value={varietal} onChangeText={setVarietal} placeholder="Ej: Malbec" />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <TextField
                label="Cosecha"
                optional
                value={cosecha}
                onChangeText={setCosecha}
                placeholder="Ej: 2019"
                keyboardType="number-pad"
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextField label="Región" optional value={region} onChangeText={setRegion} placeholder="Ej: Mendoza" />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Fecha de la cata</Text>
            <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{fecha.toLocaleDateString('es-AR')}</Text>
            </Pressable>
            {showDatePicker ? (
              <DateTimePicker
                value={fecha}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                maximumDate={new Date()}
                onChange={(_, selected) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selected) setFecha(selected);
                }}
              />
            ) : null}
          </View>

          <View style={{ gap: 10 }}>
            <Text style={styles.label}>Notas</Text>
            <View style={styles.chipsWrap}>
              {NOTAS.map((n) => (
                <Chip key={n} label={n} selected={notas.includes(n)} onPress={() => toggle(notas, setNotas, n)} />
              ))}
            </View>
          </View>

          <TextField
            label="¿Qué te pareció?"
            optional
            value={queTeParecio}
            onChangeText={setQueTeParecio}
            placeholder="Contanos tu experiencia"
            multiline
            style={{ height: 90, paddingTop: 14 }}
          />

          <View style={{ gap: 10 }}>
            <Text style={styles.label}>Maridaje</Text>
            <View style={styles.chipsWrap}>
              {MARIDAJES.map((m) => (
                <Chip key={m} label={m} selected={maridaje.includes(m)} onPress={() => toggle(maridaje, setMaridaje, m)} />
              ))}
            </View>
            <TextField
              optional
              value={maridajeOtro}
              onChangeText={setMaridajeOtro}
              placeholder="Otro maridaje…"
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <TextField label="Dónde" optional value={donde} onChangeText={setDonde} placeholder="Ej: Casa" />
            </View>
            <View style={{ flex: 1 }}>
              <TextField label="Con quién" optional value={conQuien} onChangeText={setConQuien} placeholder="Ej: Amigos" />
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <Text style={styles.label}>¿Lo volverías a tomar?</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {OPCIONES_VOLVERIA.map((op) => (
                <Chip
                  key={op.value}
                  label={op.label}
                  selected={loVolveria === op.value}
                  onPress={() => setLoVolveria(op.value)}
                />
              ))}
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <Text style={styles.label}>Puntaje</Text>
            <StarRating value={puntaje} onChange={setPuntaje} />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button label={saving ? 'Guardando…' : 'Guardar en mi cava'} onPress={guardar} disabled={saving} />
        </View>
      </KeyboardAvoidingView>
      {saving ? (
        <View style={styles.savingOverlay}>
          <ActivityIndicator color={colors.maroon} />
        </View>
      ) : null}
    </SafeAreaView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerBack: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.rose, width: 60 },
  headerTitle: { fontFamily: fonts.display, fontSize: 16, color: colors.maroon },
  content: { padding: 24, gap: 20, paddingBottom: 40 },
  photoBox: {
    height: 200,
    borderRadius: 20,
    backgroundColor: colors.creamDark,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  photoIcon: { fontSize: 32, marginBottom: 8 },
  photoText: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.rose },
  retake: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.maroon, textAlign: 'center' },
  label: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.maroon },
  dateInput: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.creamCard,
    justifyContent: 'center',
    paddingHorizontal: 19,
  },
  dateText: { fontFamily: fonts.body, fontSize: 15, color: colors.maroon },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
  },
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,253,246,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
