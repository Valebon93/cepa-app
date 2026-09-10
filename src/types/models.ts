export type LoVolveria = 'si' | 'tal_vez' | 'no';

export interface Wine {
  id: string;
  user_id: string;
  nombre: string;
  bodega: string | null;
  varietal: string | null;
  cosecha: number | null;
  region: string | null;
  foto_url: string | null;
  fecha_cata: string; // ISO date
  puntaje: number | null;
  notas: string[];
  que_te_parecio: string | null;
  maridaje: string[];
  maridaje_otro: string | null;
  contanos_mas: string | null;
  donde: string | null;
  con_quien: string | null;
  lo_volveria_a_tomar: LoVolveria | null;
  favorito: boolean;
  veces_repetido: number;
  created_at: string;
  updated_at: string;
}

export type NewWine = Pick<Wine, 'nombre'> &
  Partial<
    Omit<Wine, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'nombre'>
  >;

export interface Profile {
  id: string;
  nombre: string | null;
  ubicacion: string | null;
  forma_de_tomar: string | null;
  avatar_url: string | null;
  created_at: string;
}
