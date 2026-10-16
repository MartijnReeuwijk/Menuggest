export const EENHEDEN = ['g', 'kg', 'ml', 'cl', 'l', 'stuk'] as const
export type Eenheid = (typeof EENHEDEN)[number]

export type Dimensie = 'massa' | 'volume' | 'aantal'

/** Elke eenheid uitgedrukt in de basiseenheid van haar dimensie (g, ml of stuk). */
const DEFINITIES: Record<Eenheid, { dimensie: Dimensie, factor: number }> = {
  g: { dimensie: 'massa', factor: 1 },
  kg: { dimensie: 'massa', factor: 1000 },
  ml: { dimensie: 'volume', factor: 1 },
  cl: { dimensie: 'volume', factor: 10 },
  l: { dimensie: 'volume', factor: 1000 },
  stuk: { dimensie: 'aantal', factor: 1 },
}

export function dimensieVan(eenheid: Eenheid): Dimensie {
  return DEFINITIES[eenheid].dimensie
}

export function zijnVerenigbaar(a: Eenheid, b: Eenheid): boolean {
  return dimensieVan(a) === dimensieVan(b)
}

/** Eenheden die je mag kiezen bij een ingrediënt met deze basiseenheid. */
export function verenigbareEenheden(eenheid: Eenheid): Eenheid[] {
  return EENHEDEN.filter(e => zijnVerenigbaar(e, eenheid))
}

export class OnverenigbareEenheden extends Error {
  constructor(public readonly van: Eenheid, public readonly naar: Eenheid) {
    super(`Kan ${van} niet omrekenen naar ${naar}`)
    this.name = 'OnverenigbareEenheden'
  }
}

/** Rekent een hoeveelheid om naar de basiseenheid (g, ml of stuk). */
export function naarBasis(hoeveelheid: number, eenheid: Eenheid): number {
  return hoeveelheid * DEFINITIES[eenheid].factor
}

export function rekenOm(hoeveelheid: number, van: Eenheid, naar: Eenheid): number {
  if (!zijnVerenigbaar(van, naar)) throw new OnverenigbareEenheden(van, naar)
  return (hoeveelheid * DEFINITIES[van].factor) / DEFINITIES[naar].factor
}
