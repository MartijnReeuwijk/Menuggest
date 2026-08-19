# Menuggest — herbouwplan

Analyse van het prototype (82 commits, juni–oktober 2020) en een plan om het opnieuw te
bouwen. Kern van de bevinding: ~3.250 regels componentcode, en geen enkele regel die een
marge uitrekent — `profit: "good"` stond met de hand in de JSON.

## 1. Feature-inventaris

| Feature | Bron | Oordeel | Toelichting |
|---|---|---|---|
| Menukaart samenstellen op A4 | `menu.vue`, `menukaartA4.vue` | behouden | Het sterkste idee: winstfeedback tijdens het samenstellen |
| Winstcodering groen/oranje/rood | `menuDataHolder.vue`, `legenda.vue` | herbouwen | Signaal klopt, bron niet — wordt berekend, en 4 klassen i.p.v. 3 |
| Suggestiemodus (toggle) | `actionBar.vue` | behouden | Analyse aan/uit terwijl je werkt |
| Sorteren op winstgevendheid | `filterHolder.filterMenuData` | behouden | Wordt één sortering op contributiemarge |
| Verkoopdashboard | `insights.vue` | herbouwen | Grafieken op echte data, maar KPI-tegels waren `Math.random()` |
| Kassa-export als bron | `csvjson.json` (347 regels) | behouden | Testset. Wordt een echte importflow |
| Ingrediëntentaxonomie | `apiFilterMenu.json` | behouden | Seed voor de ingrediëntentabel |
| Gerecht toevoegen (formulier) | `editMenu.vue` | herbouwen | Gebruiker typte zelf de marge; wordt recept → marge |
| Allergenen & dieetlabels | `editMenu.vue` | behouden | Beter: afleiden uit ingrediënten |
| Seizoenen & primeur-badge | `season.json` | behouden | Echt horecadenken, goede filteras |
| Filteren op ingrediënt | `leftbar.match()` | herbouwen | Geneste loop gaf duplicaten; wordt een query |
| Archief van kaarten | `archive.vue` | herbouwen | Wordt versiebeheer per periode |
| Printen naar A4 | print-CSS | behouden | Werkte |
| Menunaam met maand/jaar | `menuNameComponent.vue` | behouden | Klein en goed |
| Opslaan / downloaden | `actionBar.checkData` | schrappen | Gaf `[object Object]`; wordt een database |
| Leveranciersdeals | `dealComponent.vue` | schrappen | Hardcoded nabootsing van een API die je niet kunt krijgen |
| Login | `login.vue` | schrappen | Knop linkte naar `/menu` |
| "Opslaan naar de cloud"-alert | `alert.vue` | schrappen | Voortgangsbalk zonder iets erachter |
| Autosave-timer (60s) | `actionBar.vue` | schrappen | Stond uit |
| PWA-manifest & iconen | `nuxt.config.js` | behouden | Installeerbaar op een keukentablet |
| Lege/kapotte componenten | 7 bestanden | schrappen | Restanten |
| **Kostprijs uit recept** | — | **nieuw** | Bestond niet; maakt de rest pas waar |

## 2. De ene fout die alles bepaalt

De app toonde terug wat je haar had verteld. `profit` stond in de JSON, `userAssignedProfit`
typte de gebruiker in, "gemiddelde marge 240%" was een string. Omdraaien: **de kostprijs
wordt berekend uit het recept.** Daar horen drie dingen bij die ontbraken:

- **Eenheden** — inkoop per 500 g, recept gebruikt 180 g. Plus een yield-% voor snij- en gaarverlies.
- **BTW** — menuprijzen zijn incl., marges rekenen excl. Eten laag tarief, alcohol hoog (tarieven verifiëren).
- **Prijshistorie** — inkoopprijzen versioneren met `geldig_vanaf`, anders herberekent de wildkaart van vorig jaar zichzelf.

## 3. De rekenketen

```
inkoopprijs/verpakking → recept (hoeveelheid × eenheid, ÷ yield) → kostprijs per portie ┐
                                                                                        ├→ contributiemarge × populariteit
kassa-export CSV → koppeling artikel↔gerecht → aantal verkocht per periode ─────────────┘
```

```
kostprijs     = Σ (hoeveelheid × prijs_per_eenheid) ÷ yield
netto_omzet   = menuprijs ÷ (1 + btw_tarief)
contributie   = netto_omzet − kostprijs
food_cost_pct = kostprijs ÷ netto_omzet
kaart_marge   = Σ (contributie × aantal) ÷ Σ aantal
```

## 4. De matrix (Kasavana & Smith), per gang berekend

|  | lage populariteit | hoge populariteit |
|---|---|---|
| **hoge marge** | **Puzzel** → betere plek en omschrijving | **Ster** → houden, prominent zetten |
| **lage marge** | **Hond** → van de kaart | **Werkpaard** → kostprijs omlaag, prijs licht op |

- populariteitsdrempel = `(1 ÷ aantal gerechten in de gang) × 70%`
- margedrempel = gewogen gemiddelde contributiemarge van de gang

## 5. Domeinmodel

| Entiteit | Velden die ertoe doen |
|---|---|
| `ingredient` | naam, categorie, eenheid, allergenen, seizoen |
| `ingredient_prijs` | ingredient_id, leverancier, verpakkingsgrootte, prijs_centen, geldig_vanaf |
| `gerecht` | naam, omschrijving, gang, menuprijs_centen, btw_tarief, seizoen, labels, actief |
| `recept_regel` | gerecht_id, ingredient_id, hoeveelheid, eenheid, yield_pct |
| `menukaart` | naam, periode_van, periode_tot, status, versie |
| `kaart_regel` | menukaart_id, gerecht_id, gang, volgorde |
| `verkoopregel` | periode, kassa_artikelnaam, gerecht_id, aantal, omzet_centen, locatie |

Bedragen als **hele centen in integers**, nooit floats.

## 6. Stack

| Laag | Keuze | Waarom |
|---|---|---|
| Framework | Nuxt (huidige major) + Vue 3 | Voortzetting van wat je kent; servermotor = backend in dezelfde repo |
| Taal | TypeScript strict | De `'dessert'` vs `'after'`-bug is letterlijk een union type |
| State | Pinia | Vervangt Vuex; jouw mutations-only store met TODO vervalt |
| DB + auth | Supabase (Postgres, RLS) | Geen serverbeheer; RLS meteen aan |
| Rekenkern | `/domain`, pure TS zonder Vue | Testbaar, verplaatsbaar |
| Validatie | Zod | Eén schema voor formulier, API en import |
| CSV | PapaParse + eigen kolommapping | Export begint met metaregels en `FIELD2..FIELD13` |
| Grafieken | Chart.js; matrix met de hand in SVG | Kernbeeld wil je exact sturen |
| Print | CSS `@page` A4, later PDF headless | Begin met wat al werkte |
| Tests | Vitest op `/domain`, Playwright op import | Rekenfouten kosten stil geld |

Controleer bij de start welke majors actueel zijn.

## 7. Design system

| Optie | Sterk | Zwak |
|---|---|---|
| **Nuxt UI** (aanrader) | Officieel, toegankelijke primitives, Tailwind, formulieren met Zod, donkere modus | Vast aan Tailwind en hun releaseritme |
| PrimeVue | Rijkste datatabel (filteren, groeperen, bevriezen, export) | Zwaar, generieke enterprise-look |
| shadcn-vue | Je bezit de componenten; maximale grip op identiteit | Jij onderhoudt ze |
| Vuetify | Compleet en volwassen | Material Design past slecht bij horecagereedschap |

Vijf regels voor deze app:

1. Twee oppervlakken, streng gescheiden: app-omgeving (dicht, mag donker) vs menukaart (papier, altijd licht, printvast).
2. Kleur nooit als enige drager — elk kwadrant krijgt label én vorm.
3. Vermijd de groen/rood-as in de matrix (kleurenblindheid); gebruik blauw/oranje.
4. Geld rechts uitlijnen met tabellarische cijfers.
5. De uitklapbare legenda uit v1 blijft — met vier kwadranten nog nodiger.

## 8. Route

| Fase | Wat | Klaar als | Ruw |
|---|---|---|---|
| 0 | Fundament: repo, stack, schema, seed uit oude assets | 22 gerechten + ingrediëntenboom staan in Postgres | 1 weekend |
| 1 | **Kostprijs-engine**: ingrediënten, recepten, yield, BTW | Je voert een gerecht in en de marge rolt eruit zonder ingetypt percentage | 2–3 weekenden |
| 2 | Kassa-import: upload, kolommapping, artikel↔gerecht koppelen met geheugen | `csvjson.json` erin, 345 regels gekoppeld | 2 weekenden |
| 3 | De matrix: kwadranten + tabel per gang per periode | Elk gerecht valt in een kwadrant, met reden | 2 weekenden |
| 4 | Kaart samenstellen met live marge | Kaart toont voorspelde marge die meebeweegt | 2–3 weekenden |
| 5 | Uitgeven en vergelijken: print, versie, voorspelling vs werkelijkheid | Je ziet welke gerechten deden wat je dacht | 1–2 weekenden |

## 9. Bewust niet bouwen

- **Leveranciers-API** — zou het onmisbaar maken, en daarom komt niemand erbij. Later.
- **Multi-tenant SaaS, facturatie** — RLS wel aan, machinerie niet.
- **Voorraad en bestellingen** — ander product, andere gebruiker.
- **Mobiel-first** — moet werken op tablet, niet ervoor ontworpen.

## 10. Risico's

- De koppeling kassa-artikel ↔ gerecht is het echte werk; reserveer er meer tijd voor dan voor de grafieken.
- Elke kassa exporteert anders (Untill, Lightspeed, MplusKASSA) — dus generieke mapping.
- Voor wie bouw je dit? Eén bekend restaurant geeft scherpe scope; de markt betekent concurreren met kassaleveranciers die de data al bezitten.
- Recepten invoeren is de grootste drempel voor de gebruiker — maak het snel of het komt er nooit van.
