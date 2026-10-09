-- Formularios: mensajes de contacto y lista de espera del primer vino.
-- Ejecutar en Supabase → SQL Editor DESPUÉS de 2026-10-esquema-inicial.sql (usa es_admin()).
-- Estado: PENDIENTE de ejecutar.
--
-- Nadie inserta desde el navegador: lo hacen los endpoints /api/contacto y
-- /api/suscribir con la clave de servicio, después del antispam (como en Guadicar,
-- donde la inserción pública llenaba la tabla de bots). Los socios los leen en el
-- panel (/admin/mensajes/).

create table mensajes (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null check (char_length(nombre) between 1 and 120),
  email      text not null check (char_length(email) between 3 and 200),
  mensaje    text not null check (char_length(mensaje) between 1 and 4000),
  idioma     text not null default 'es' check (idioma in ('es', 'eu')),
  leido      boolean not null default false,
  created_at timestamptz not null default now()
);

create table suscriptores (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique check (char_length(email) between 3 and 200),
  idioma     text not null default 'es' check (idioma in ('es', 'eu')),
  created_at timestamptz not null default now()
);

alter table mensajes enable row level security;
alter table suscriptores enable row level security;

-- Solo los socios (tabla admins) leen, marcan como leído y borran
create policy "Admins leen mensajes" on mensajes for select using (es_admin());
create policy "Admins marcan mensajes" on mensajes for update using (es_admin()) with check (es_admin());
create policy "Admins borran mensajes" on mensajes for delete using (es_admin());
create policy "Admins leen suscriptores" on suscriptores for select using (es_admin());
create policy "Admins borran suscriptores" on suscriptores for delete using (es_admin());
