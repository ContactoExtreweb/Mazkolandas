-- Esquema inicial de Mazkolandas. Ejecutar una vez en Supabase → SQL Editor.
-- Estado: PENDIENTE de ejecutar.
--
-- Después, en el panel de Supabase:
--   1. Authentication → Sign In / Providers → desactivar "Allow new users to sign up".
--   2. Authentication → Users → "Add user" con el email de los socios.
--   3. Añadir cada usuario a la tabla admins (último bloque de este archivo).

-- ── Quién puede usar el panel ────────────────────────────────────────────
-- Las políticas comprueban que el usuario está en esta tabla, no solo que
-- tiene sesión (en Guadicar bastaba con tener cuenta: lección aprendida).
create table admins (
  user_id uuid primary key references auth.users on delete cascade
);
alter table admins enable row level security;
-- Sin políticas: nadie la lee desde fuera. Solo se usa a través de es_admin().

create function es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid())
$$;

-- ── Entradas del cuaderno (blog) ─────────────────────────────────────────
create table posts (
  id           uuid primary key default gen_random_uuid(),
  numero       int generated always as identity,   -- Nº de registro (001, 002…)
  slug         text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  titulo       text not null,
  extracto     text,
  contenido    text not null default '',
  titulo_eu    text,                -- euskera: opcional; sin título no hay versión eu
  extracto_eu  text,
  contenido_eu text,
  fotos        jsonb not null default '[]',  -- [{ "url": "...", "pie": "..." }], la primera es la portada
  autor        text check (autor in ('Nerea', 'Julen', 'Iñaki')),
  fase         text check (fase in ('poda', 'brotacion', 'floracion', 'envero', 'vendimia', 'bodega')),
  fecha        date not null default current_date,
  publicado    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index posts_publicados on posts (fecha desc) where publicado;

create function tocar_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger posts_updated_at before update on posts
  for each row execute function tocar_updated_at();

alter table posts enable row level security;

create policy "Lectura pública de lo publicado" on posts
  for select using (publicado or es_admin());
create policy "Admins crean" on posts for insert with check (es_admin());
create policy "Admins editan" on posts for update using (es_admin()) with check (es_admin());
create policy "Admins borran" on posts for delete using (es_admin());

-- ── Fotos (Storage) ──────────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('cuaderno', 'cuaderno', true);

create policy "Admins suben fotos" on storage.objects
  for insert with check (bucket_id = 'cuaderno' and es_admin());
create policy "Admins cambian fotos" on storage.objects
  for update using (bucket_id = 'cuaderno' and es_admin());
create policy "Admins borran fotos" on storage.objects
  for delete using (bucket_id = 'cuaderno' and es_admin());

-- ── Dar acceso al panel (rellenar tras crear los usuarios) ───────────────
-- insert into admins (user_id)
--   select id from auth.users where email in ('mazkolandas@outlook.com');
