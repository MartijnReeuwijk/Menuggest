import { type IngredientPrijs, dimensieVan, formatEuro, prijsPerBasiseenheid } from '#domain'

export { formatEuro }

const pctFormat = new Intl.NumberFormat('nl-NL', { style: 'percent', maximumFractionDigits: 1 })

/** 0,1477 → "14,8%" */
export function formatPct(fractie: number | null): string {
  return fractie === null ? '—' : pctFormat.format(fractie)
}

const getalFormat = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 3 })

export function formatGetal(waarde: number): string {
  return getalFormat.format(waarde)
}

/** "€ 12,50 per kg" — leesbaarder dan per gram. */
export function formatPrijsPerEenheid(prijs: IngredientPrijs): string {
  const dimensie = dimensieVan(prijs.eenheid)
  const perBasis = prijsPerBasiseenheid(prijs)
  if (dimensie === 'massa') return `${formatEuro(Math.round(perBasis * 1000))} per kg`
  if (dimensie === 'volume') return `${formatEuro(Math.round(perBasis * 1000))} per l`
  return `${formatEuro(Math.round(perBasis))} per stuk`
}

export function vandaag(): string {
  // Lokale datum als jjjj-mm-dd.
  return new Date().toLocaleDateString('sv-SE')
}
