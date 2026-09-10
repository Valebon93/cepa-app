-- CEPA — esquema inicial
-- Corré esto en el SQL Editor de tu proyecto de Supabase (supabase.com > tu proyecto > SQL Editor).

-- ─────────────────────────────────────────────
-- Perfiles (uno por usuario autenticado)
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  ubicacion text,
  forma_de_tomar text, -- ej: "Tinto, con carnes"
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Los perfiles son visibles para su dueño"
  on public.profiles for select
  using (auth.uid() = id);

create policy "El usuario puede crear su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "El usuario puede editar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- crea automáticamente un perfil vacío cuando alguien se registra
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────
-- Vinos / catas
-- ─────────────────────────────────────────────
create table if not exists public.wines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  nombre text not null,
  bodega text,
  varietal text,
  cosecha int,
  region text,

  foto_url text,

  fecha_cata date not null default current_date,
  puntaje numeric(2,1) check (puntaje >= 0 and puntaje <= 5),

  notas text[] default '{}',       -- chips de "¿Qué sentiste?" (Ciruela, Vainilla, ...)
  que_te_parecio text,             -- texto libre

  maridaje text[] default '{}',    -- chips de "¿Con qué lo acompañaste?"
  maridaje_otro text,
  contanos_mas text,               -- texto libre del maridaje

  donde text,                      -- chip elegido o texto libre si es "Otro"
  con_quien text,

  lo_volveria_a_tomar text check (lo_volveria_a_tomar in ('si', 'tal_vez', 'no')),

  favorito boolean not null default false,
  veces_repetido int not null default 1, -- el "x3" de "Mi cava"

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wines_user_id_idx on public.wines(user_id);
create index if not exists wines_favorito_idx on public.wines(user_id, favorito);

alter table public.wines enable row level security;

create policy "El usuario ve solo sus propios vinos"
  on public.wines for select
  using (auth.uid() = user_id);

create policy "El usuario crea sus propios vinos"
  on public.wines for insert
  with check (auth.uid() = user_id);

create policy "El usuario edita sus propios vinos"
  on public.wines for update
  using (auth.uid() = user_id);

create policy "El usuario borra sus propios vinos"
  on public.wines for delete
  using (auth.uid() = user_id);

-- mantiene updated_at al día
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists wines_set_updated_at on public.wines;
create trigger wines_set_updated_at
  before update on public.wines
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────
-- Storage: fotos de etiquetas
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('wine-photos', 'wine-photos', true)
on conflict (id) do nothing;

create policy "Cualquiera puede ver las fotos (bucket público)"
  on storage.objects for select
  using (bucket_id = 'wine-photos');

create policy "El usuario sube fotos a su propia carpeta"
  on storage.objects for insert
  with check (bucket_id = 'wine-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "El usuario borra sus propias fotos"
  on storage.objects for delete
  using (bucket_id = 'wine-photos' and auth.uid()::text = (storage.foldername(name))[1]);
