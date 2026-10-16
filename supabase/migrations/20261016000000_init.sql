-- Menuggest — basisschema (fase 0). Zie HERBOUWPLAN.md §5.
-- Bedragen in hele centen (integer), nooit floats. Hoeveelheden mogen fracties zijn.

create type eenheid as enum ('g', 'kg', 'ml', 'cl', 'l', 'stuk');
create type gang as enum ('voorgerecht', 'hoofdgerecht', 'nagerecht', 'bijgerecht');
create type btw_tarief as enum ('nul', 'laag', 'hoog');
create type kaart_status as enum ('concept', 'actief', 'gearchiveerd');

create table ingredient (
  id uuid primary key default gen_random_uuid(),
  naam text not null check (length(trim(naam)) > 0),
  categorie text not null,
  -- Basiseenheid; prijzen en receptregels moeten dezelfde dimensie hebben.
  eenheid eenheid not null default 'g',
  allergenen text[] not null default '{}',
  seizoenen text[] not null default '{}',
  aangemaakt_op timestamptz not null default now()
);
create unique index ingredient_naam_uniek on ingredient (lower(naam));

create table ingredient_prijs (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid not null references ingredient (id) on delete cascade,
  leverancier text,
  verpakkingsgrootte numeric(12, 3) not null check (verpakkingsgrootte > 0),
  eenheid eenheid not null,
  prijs_centen integer not null check (prijs_centen >= 0),
  -- Prijzen worden aangevuld, nooit overschreven: oude kaarten rekenen met oude prijzen.
  geldig_vanaf date not null default current_date,
  aangemaakt_op timestamptz not null default now()
);
create index ingredient_prijs_geldig on ingredient_prijs (ingredient_id, geldig_vanaf desc);

create table gerecht (
  id uuid primary key default gen_random_uuid(),
  naam text not null check (length(trim(naam)) > 0),
  omschrijving text not null default '',
  gang gang not null,
  -- Inclusief btw, zoals op de kaart.
  menuprijs_centen integer not null check (menuprijs_centen >= 0),
  btw_tarief btw_tarief not null default 'laag',
  seizoenen text[] not null default '{}',
  labels text[] not null default '{}',
  actief boolean not null default true,
  aangemaakt_op timestamptz not null default now()
);

create table recept_regel (
  id uuid primary key default gen_random_uuid(),
  gerecht_id uuid not null references gerecht (id) on delete cascade,
  ingredient_id uuid not null references ingredient (id) on delete restrict,
  -- Netto hoeveelheid per portie.
  hoeveelheid numeric(12, 3) not null check (hoeveelheid > 0),
  eenheid eenheid not null,
  yield_pct numeric(5, 2) not null default 100 check (yield_pct > 0 and yield_pct <= 100),
  volgorde integer not null default 0
);
create index recept_regel_gerecht on recept_regel (gerecht_id, volgorde);

create table menukaart (
  id uuid primary key default gen_random_uuid(),
  naam text not null,
  periode_van date not null,
  periode_tot date,
  status kaart_status not null default 'concept',
  versie integer not null default 1,
  aangemaakt_op timestamptz not null default now(),
  check (periode_tot is null or periode_tot >= periode_van)
);

create table kaart_regel (
  id uuid primary key default gen_random_uuid(),
  menukaart_id uuid not null references menukaart (id) on delete cascade,
  gerecht_id uuid not null references gerecht (id) on delete restrict,
  gang gang not null,
  volgorde integer not null default 0,
  unique (menukaart_id, gerecht_id)
);

create table verkoopregel (
  id uuid primary key default gen_random_uuid(),
  periode_van date not null,
  periode_tot date not null,
  kassa_artikelnaam text not null,
  gerecht_id uuid references gerecht (id) on delete set null,
  aantal integer not null check (aantal >= 0),
  -- Exclusief btw, zoals de kassa het exporteert. Niet zelf herberekenen:
  -- de kassa rondt per bon af, dus incl ÷ (1 + btw) wijkt af.
  omzet_centen integer not null,
  locatie text,
  check (periode_tot >= periode_van)
);
create index verkoopregel_periode on verkoopregel (periode_van, periode_tot);

-- Row Level Security: aan vanaf dag één. Eén restaurant, dus elke ingelogde
-- gebruiker ziet alles; anonieme bezoekers niets. Multi-tenant komt later (of nooit).
do $$
declare
  tabel text;
begin
  foreach tabel in array array['ingredient', 'ingredient_prijs', 'gerecht', 'recept_regel', 'menukaart', 'kaart_regel', 'verkoopregel']
  loop
    execute format('alter table %I enable row level security', tabel);
    execute format('create policy "ingelogd mag alles" on %I for all to authenticated using (true) with check (true)', tabel);
  end loop;
end
$$;
