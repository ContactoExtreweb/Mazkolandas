-- El vino, editable desde el panel (/admin/vino/). Ejecutar en Supabase → SQL Editor
-- DESPUÉS de 2026-10-esquema-inicial.sql (usa es_admin() y el bucket "cuaderno").
-- Estado: PENDIENTE de ejecutar.

create table vino (
  id              int primary key default 1 check (id = 1), -- una sola fila
  listo           boolean not null default false,

  -- La botella (3D)
  forma           text not null default 'bordelesa' check (forma in ('bordelesa', 'borgonona')),
  vidrio          text not null default '#3f6234',   -- tono del vidrio
  liquido         text not null default '#4a0b17',   -- color del vino
  capsula         text not null default '#6b1f3a',
  etiqueta        text,                               -- URL del arte plano de la etiqueta
  etiqueta_vuelta real not null default 0.42 check (etiqueta_vuelta between 0.15 and 0.9),
  contraetiqueta  text,
  modelo          text,                               -- URL de un .glb con su botella exacta

  -- Los textos (castellano y euskera)
  nombre text default '', tipo text default '', uva text default '', anada text default '',
  elaboracion text default '', nota text default '',
  comprar_texto text default '', comprar_url text default '',
  nombre_eu text default '', tipo_eu text default '', uva_eu text default '', anada_eu text default '',
  elaboracion_eu text default '', nota_eu text default '', comprar_texto_eu text default '',

  updated_at timestamptz not null default now()
);

create trigger vino_updated_at before update on vino
  for each row execute function tocar_updated_at();

alter table vino enable row level security;
create policy "Lectura pública del vino" on vino for select using (true);
create policy "Admins editan el vino" on vino for update using (es_admin()) with check (es_admin());

insert into vino (id) values (1);
