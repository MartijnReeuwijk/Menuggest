-- Fase 2: kassa-import. Zie HERBOUWPLAN.md §8.
--
-- De verkoopregel uit het basisschema had zelf een gerecht_id en periode. Dat
-- vervangen we door:
--   kassa_import      één upload, met de periode en locatie die de export beslaat
--   verkoopregel      één kassa-artikel binnen een import (opgeteld over de exportregels)
--   kassa_koppeling   het geheugen: kassa-artikel → gerecht, of bewust genegeerd
-- Het gerecht wordt bij het lezen via de koppeling bepaald, zodat een gecorrigeerde
-- koppeling meteen voor alle oude imports geldt. De tabel was nog leeg.

drop table verkoopregel;

create table kassa_import (
  id uuid primary key default gen_random_uuid(),
  bestandsnaam text not null,
  periode_van date not null,
  periode_tot date not null,
  locatie text,
  geimporteerd_op timestamptz not null default now(),
  check (periode_tot >= periode_van)
);

create table verkoopregel (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null references kassa_import (id) on delete cascade,
  kassa_artikelnaam text not null,
  -- Genormaliseerde artikelnaam (kleine letters, zonder accenten); sleutel naar kassa_koppeling.
  sleutel text not null,
  kassa_artikelnummers text[] not null default '{}',
  omzetgroep text,
  -- Kan negatief zijn door retouren.
  aantal integer not null,
  -- Exclusief btw, zoals de kassa het exporteert. Niet zelf herberekenen:
  -- de kassa rondt per bon af, dus incl ÷ (1 + btw) wijkt af.
  omzet_excl_centen integer not null,
  omzet_incl_centen integer,
  gangbare_prijs_incl_centen integer
);
create index verkoopregel_import on verkoopregel (import_id);
create index verkoopregel_sleutel on verkoopregel (sleutel);

create table kassa_koppeling (
  sleutel text primary key,
  kassa_artikelnaam text not null,
  -- null = bewust genegeerd (drank, borrel, …). Verdwijnt het gerecht, dan
  -- verdwijnt de koppeling en is het artikel weer open.
  gerecht_id uuid references gerecht (id) on delete cascade,
  bijgewerkt_op timestamptz not null default now()
);
create index kassa_koppeling_gerecht on kassa_koppeling (gerecht_id);

-- Verkocht per gerecht per import; de invoer voor de matrix in fase 3.
create view verkoop_per_gerecht with (security_invoker = true) as
select
  k.gerecht_id,
  i.id as import_id,
  i.periode_van,
  i.periode_tot,
  i.locatie,
  sum(v.aantal)::integer as aantal,
  sum(v.omzet_excl_centen)::bigint as omzet_excl_centen
from verkoopregel v
join kassa_import i on i.id = v.import_id
join kassa_koppeling k on k.sleutel = v.sleutel
where k.gerecht_id is not null
group by k.gerecht_id, i.id;

do $$
declare
  tabel text;
begin
  foreach tabel in array array['kassa_import', 'verkoopregel', 'kassa_koppeling']
  loop
    execute format('alter table %I enable row level security', tabel);
    execute format('create policy "ingelogd mag alles" on %I for all to authenticated using (true) with check (true)', tabel);
  end loop;
end
$$;
