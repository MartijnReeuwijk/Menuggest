/**
 * Zet de assets van het prototype om naar seeddata:
 *   - data/seed.json      → startdata voor de app (lokale modus)
 *   - supabase/seed.sql   → dezelfde rijen voor Postgres
 *
 * Id's zijn deterministisch (uuid v5-stijl uit de naam), zodat lokale data
 * later zonder hernummeren naar de database kan.
 *
 * Gebruik: npm run seed
 */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const lees = <T>(pad: string): T => JSON.parse(readFileSync(new URL(pad, root), 'utf8')) as T

interface OudGerecht {
  name: string
  prime?: boolean
  desc: string
  course: string | null | false
  ingredient: boolean
  price: number | null
}
interface OudeCategorie {
  mainMenu: string
  subMenu: string[]
}

function uuid(soort: string, sleutel: string): string {
  const hex = createHash('sha1').update(`menuggest:${soort}:${sleutel.toLowerCase()}`).digest('hex')
  const versie = `5${hex.slice(13, 16)}`
  const variant = ((Number.parseInt(hex.slice(16, 18), 16) & 0x3F) | 0x80).toString(16) + hex.slice(18, 20)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${versie}-${variant}-${hex.slice(20, 32)}`
}

const CATEGORIEEN: Record<string, { naam: string, eenheid: 'g' | 'ml' }> = {
  'Vlees': { naam: 'Vlees', eenheid: 'g' },
  'gevogelte': { naam: 'Gevogelte', eenheid: 'g' },
  'Vis': { naam: 'Vis', eenheid: 'g' },
  'Pasta': { naam: 'Pasta', eenheid: 'g' },
  'groente': { naam: 'Groente', eenheid: 'g' },
  'Ijs & desserts': { naam: 'IJs en desserts', eenheid: 'g' },
  'Schaal en schelpdieren': { naam: 'Schaal- en schelpdieren', eenheid: 'g' },
  'Sause en Dressing': { naam: 'Sauzen en dressings', eenheid: 'ml' },
  'Kruiden en specerijen': { naam: 'Kruiden en specerijen', eenheid: 'g' },
}

const GANG: Record<string, 'voorgerecht' | 'hoofdgerecht' | 'nagerecht'> = {
  appetizer: 'voorgerecht',
  main: 'hoofdgerecht',
  after: 'nagerecht',
}

const netjes = (naam: string) => {
  const schoon = naam.trim().replace(/[,\s]+$/, '').replace(/\s+/g, ' ')
  return schoon.charAt(0).toUpperCase() + schoon.slice(1)
}

// Ingrediënten: de taxonomie uit apiFilterMenu.json, ontdubbeld op naam.
const gezien = new Set<string>()
const ingredienten = lees<OudeCategorie[]>('legacy/assets/apiFilterMenu.json').flatMap((categorie) => {
  const doel = CATEGORIEEN[categorie.mainMenu]
  if (!doel) throw new Error(`Onbekende categorie: ${categorie.mainMenu}`)
  return categorie.subMenu.flatMap((oud) => {
    const naam = netjes(oud)
    if (!naam || gezien.has(naam.toLowerCase())) return []
    gezien.add(naam.toLowerCase())
    return [{
      id: uuid('ingredient', naam),
      naam,
      categorie: doel.naam,
      eenheid: doel.eenheid,
      allergenen: [] as string[],
      seizoenen: [] as string[],
    }]
  })
})

// Gerechten: menukaart.json. Regels met `ingredient: true` waren halffabricaten
// (pesto, pepersaus, seizoensgroenten); die komen terug als sub-recept, niet als gerecht.
// De oude `profit`-waarde en ingrediëntenlijsten (zonder hoeveelheden) nemen we niet over:
// marges worden nu berekend.
const gerechten = lees<OudGerecht[]>('legacy/assets/menukaart.json')
  .filter(oud => !oud.ingredient)
  .map((oud) => {
    const gang = GANG[String(oud.course)]
    if (!gang) throw new Error(`Onbekende gang voor ${oud.name}: ${oud.course}`)
    const naam = netjes(oud.name).replace(/\.$/, '')
    return {
      id: uuid('gerecht', naam),
      naam,
      omschrijving: oud.desc.trim().replace(/\s+/g, ' '),
      gang,
      menuprijsCenten: Math.round((oud.price ?? 0) * 100),
      btw: 'laag' as const,
      seizoenen: [] as string[],
      labels: oud.prime ? ['primeur'] : [],
      actief: true,
    }
  })

const seed = { versie: 1, ingredienten, prijzen: [], gerechten, receptRegels: [] }
writeFileSync(new URL('data/seed.json', root), `${JSON.stringify(seed, null, 2)}\n`)

// SQL
const tekst = (waarde: string) => `'${waarde.replace(/'/g, '\'\'')}'`
const lijst = (waarden: string[]) => (waarden.length ? `array[${waarden.map(tekst).join(', ')}]` : `'{}'`) + '::text[]'

const sql = [
  '-- Gegenereerd door scripts/build-seed.ts uit legacy/assets. Niet met de hand bewerken.',
  '',
  'insert into ingredient (id, naam, categorie, eenheid, allergenen, seizoenen) values',
  ingredienten.map(i => `  (${tekst(i.id)}, ${tekst(i.naam)}, ${tekst(i.categorie)}, ${tekst(i.eenheid)}, ${lijst(i.allergenen)}, ${lijst(i.seizoenen)})`).join(',\n'),
  'on conflict (id) do nothing;',
  '',
  'insert into gerecht (id, naam, omschrijving, gang, menuprijs_centen, btw_tarief, seizoenen, labels, actief) values',
  gerechten.map(g => `  (${tekst(g.id)}, ${tekst(g.naam)}, ${tekst(g.omschrijving)}, ${tekst(g.gang)}, ${g.menuprijsCenten}, ${tekst(g.btw)}, ${lijst(g.seizoenen)}, ${lijst(g.labels)}, ${g.actief})`).join(',\n'),
  'on conflict (id) do nothing;',
  '',
].join('\n')
writeFileSync(new URL('supabase/seed.sql', root), sql)

console.log(`${ingredienten.length} ingrediënten en ${gerechten.length} gerechten geschreven.`)
