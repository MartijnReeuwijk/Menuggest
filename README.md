# Menuggest

Menukaarten samenstellen op basis van **berekende** marges. De kostprijs van een gerecht
komt uit het recept, niet uit een veld dat je zelf invult.

Dit is de herbouw van mijn afstudeerproject uit 2020. Waarom en hoe staat in
[HERBOUWPLAN.md](HERBOUWPLAN.md). Het oude prototype staat ongewijzigd in [`legacy/`](legacy).

## Status

| Fase | Wat | Stand |
|---|---|---|
| 0 | Fundament: stack, schema, seed uit oude assets | ✅ |
| 1 | Kostprijs-engine: ingrediënten, recepten, yield, btw | ✅ lokaal (localStorage) |
| 2 | Kassa-import: upload, kolommapping, koppelen met geheugen | ✅ lokaal |
| 3 | Menu-engineeringmatrix | — |
| 4 | Kaart samenstellen met live marge | — |
| 5 | Uitgeven en vergelijken | — |

Supabase is nog niet gekoppeld. Het schema staat klaar in `supabase/`, en de app bewaart
alles voorlopig in de browser, in dezelfde vorm als de tabellen.

## Starten

```bash
npm install
npm run dev        # http://localhost:3333
npm test           # rekenkern (Vitest)
npm run typecheck
npm run build
```

Node 22 of nieuwer. Let op: met npm 10 faalt het *toevoegen* van nieuwe packages op een
bug in npm (`Cannot read properties of null (reading 'edgesOut')`). Gebruik dan
`npx npm@12 install <pakket>`. Een gewone `npm install` vanaf de lockfile werkt wel.

## Structuur

```
domain/            Rekenkern in pure TypeScript, zonder Vue. Alles wat geld raakt, met tests.
  geld.ts          Centen (integers), euro parsen/formatteren, één keer afronden
  eenheden.ts      g/kg/ml/cl/l/stuk, omrekenen binnen een dimensie
  btw.ts           Tarieven per datum, menuprijs → netto omzet
  prijzen.ts       Inkoopprijs met geldig_vanaf, geldende prijs op peildatum
  kostprijs.ts     Recept → kostprijs, met markering van regels die niet te berekenen zijn
  marge.ts         Contributiemarge, food cost %, gewogen kaartmarge
  allergenen.ts    De 14 EU-allergenen, afgeleid uit ingrediënten
  kassa.ts         Export lezen (CSV/JSON), kopregel en kolommen raden, artikelen optellen,
                   gerecht voorstellen, gang raden uit omzetgroep
  verkoop.ts       Verkoop per gerecht via het koppelgeheugen
shared/schemas.ts  Zod-schema's per entiteit (formulieren, opslag, straks API en import)
app/               Nuxt 4-app (Nuxt UI, Pinia)
  stores/keuken.ts Alle data plus afgeleide analyses per gerecht
  pages/           /gerechten, /gerechten/:id, /ingredienten, /verkoop, /verkoop/import
supabase/
  migrations/      Postgres-schema met RLS (basis + kassa-import)
  seed.sql         Gegenereerd uit legacy/assets
data/seed.json     Dezelfde seed als startdata voor de app
scripts/           build-seed.ts (npm run seed)
legacy/            Het prototype uit 2020 (Nuxt 2), alleen ter referentie
```

## Rekenregels

```
kostprijs     = Σ (hoeveelheid × prijs per eenheid) ÷ yield
netto_omzet   = menuprijs ÷ (1 + btw)
contributie   = netto_omzet − kostprijs
food_cost_pct = kostprijs ÷ netto_omzet
```

- Bedragen zijn hele centen. Tussenresultaten mogen fracties zijn; er wordt één keer afgerond.
- Een ingrediënt zonder prijs telt niet als € 0. Het gerecht krijgt dan de status
  *onvolledig*, en de bedragen worden als grens getoond (kostprijs ≥, marge ≤).
- Inkoopprijzen zijn exclusief btw en worden aangevuld, niet overschreven. Bij twee prijzen
  op dezelfde datum telt de goedkoopste per eenheid.
- Btw-tarieven staan per ingangsdatum in `domain/btw.ts`. Controleer ze bij elke wijziging.

## Kassa-import

`/verkoop/import` neemt een artikelexport van de kassa in drie stappen:

1. **Bestand en periode.** Een CSV (komma of puntkomma) of JSON. De periode staat
   niet in de export; die vul je zelf in. Als een periode overlapt met een eerdere
   import, krijg je een waarschuwing, want anders telt de verkoop dubbel.
2. **Kolommen.** De kopregel wordt tussen de metaregels gezocht en de kolommen worden
   geraden (Nederlandse en Engelse namen). Regels van hetzelfde artikel worden per
   omzetgroep opgeteld. Staat er een totaalregel in de export, dan wordt daartegen
   gecontroleerd.
3. **Koppelen.** Elk kassa-artikel wordt een gerecht, wordt genegeerd (drank, borrel)
   of blijft open. Dat gaat per artikel, per omzetgroep of als nieuw gerecht met de
   gangbare kassaprijs. Bij namen die in elkaar passen ("Saté" ↔ "Saté van
   varkenshaas") doet de app een voorstel, maar dat moet je bevestigen.

Wat je koppelt, wordt onthouden per genormaliseerde artikelnaam en geldt voor alle
imports, ook de eerdere. Het gerecht wordt pas bij het lezen via de koppeling bepaald.
Een gecorrigeerde koppeling hoeft dus nergens te worden bijgewerkt.

De export uit 2018 (`legacy/assets/convertcsv.csv` en `csvjson.json`) staat als test in
`domain/kassa.test.ts`: 344 regels worden 240 artikelen, en die tellen precies op tot de
totaalregel van de kassa (14.190 stuks, € 105.503,26 excl. btw).

Valkuilen in die export, nu afgevangen:

- Aantallen met een duizendtalpunt: "1.137" is 1137.
- Hetzelfde artikel staat op meerdere regels met verschillende prijzen, inclusief
  € 0,00 voor onderdelen van een menu. Als menuprijs telt de prijs waarvoor de meeste
  stuks verkocht zijn, niet het gemiddelde.
- Omzet excl. btw is van de kassa zelf. Terugrekenen vanaf incl. wijkt af door
  afronding per bon.
- Twee locaties (Meierij, Bokkesteeg) zitten alleen in de naam van de omzetgroep.

Nog niet ondersteund: Excel-bestanden (.xlsx); exporteer die als CSV. Menu's
("Maandmenu Meierij" € 29 met losse gangen van € 0) worden nog niet over hun gangen
verdeeld.

## Seed

`npm run seed` zet `legacy/assets` om naar `data/seed.json` en `supabase/seed.sql`:

- **415 ingrediënten** uit `apiFilterMenu.json`: ontdubbeld, met opgeschoonde categorienamen
  en een basiseenheid per categorie. Allergenen zijn bewust leeg gelaten; vul ze per
  ingrediënt in, want een gok is hier gevaarlijker dan niets.
- **17 gerechten** uit `menukaart.json`, met gang, menuprijs en primeur-label. De oude
  `profit`-waarden en ingrediëntenlijsten (zonder hoeveelheden) zijn niet overgenomen.
  De 5 regels met `ingredient: true` (pesto, pepersaus, seizoensgroenten, …) waren
  halffabricaten en komen later terug als sub-recept.

Id's zijn deterministisch. Lokale data kan daardoor later zonder hernummeren naar Postgres.

## Supabase koppelen (volgende stap)

1. Maak een project aan op supabase.com.
2. Draai `supabase/migrations/*.sql` en daarna `supabase/seed.sql`.
3. Vervang in `app/stores/keuken.ts` de localStorage-laag door Supabase-calls.

Het schema is getest op Postgres 16, met stub-rollen `authenticated` en `anon` voor de policies.
