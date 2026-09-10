import { supabase } from './supabase';
import { File } from 'expo-file-system';

/** Sube una foto local (uri de la cámara) al bucket `wine-photos` y devuelve la URL pública. */
export async function uploadWinePhoto(userId: string, localUri: string): Promise<string> {
  const bytes = await new File(localUri).arrayBuffer();
  const path = `${userId}/${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from('wine-photos')
    .upload(path, bytes, { contentType: 'image/jpeg', upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from('wine-photos').getPublicUrl(path);
  return data.publicUrl;
}
