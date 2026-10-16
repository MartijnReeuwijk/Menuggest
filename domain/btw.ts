import { type Centen, rondAf } from './geld'

export const BTW_CATEGORIEEN = ['laag', 'hoog', 'nul'] as const
export type BtwCategorie = (typeof BTW_CATEGORIEEN)[number]

/**
 * Tarieven in basispunten (900 = 9%), met de datum waarop ze ingaan.
 * Eten en alcoholvrije dranken vallen onder het lage tarief, alcohol onder het hoge.
 * Controleer dit bij elke tariefwijziging op belastingdienst.nl en voeg een regel toe;
 * oude regels blijven staan zodat historische kaarten correct blijven rekenen.
 */
export const BTW_TARIEVEN: ReadonlyArray<{ categorie: BtwCategorie, basispunten: number, geldigVanaf: string }> = [
  { categorie: 'nul', basispunten: 0, geldigVanaf: '1969-01-01' },
  { categorie: 'laag', basispunten: 600, geldigVanaf: '1986-10-01' },
  { categorie: 'laag', basispunten: 900, geldigVanaf: '2019-01-01' },
  { categorie: 'hoog', basispunten: 1900, geldigVanaf: '2001-01-01' },
  { categorie: 'hoog', basispunten: 2100, geldigVanaf: '2012-10-01' },
]

/** Het tarief dat op `peildatum` (ISO, jjjj-mm-dd) gold voor deze categorie. */
export function btwBasispunten(categorie: BtwCategorie, peildatum: string): number {
  let gevonden: { basispunten: number, geldigVanaf: string } | undefined
  for (const tarief of BTW_TARIEVEN) {
    if (tarief.categorie !== categorie || tarief.geldigVanaf > peildatum) continue
    if (!gevonden || tarief.geldigVanaf > gevonden.geldigVanaf) gevonden = tarief
  }
  if (!gevonden) throw new Error(`Geen btw-tarief '${categorie}' bekend op ${peildatum}`)
  return gevonden.basispunten
}

/** Menuprijzen zijn inclusief btw; marges rekenen we exclusief. */
export function exclusiefBtw(inclusiefCenten: Centen, basispunten: number): Centen {
  return rondAf((inclusiefCenten * 10_000) / (10_000 + basispunten))
}
