import { type Centen, rondAf } from './geld'
import { type BtwCategorie, btwBasispunten, exclusiefBtw } from './btw'

export interface Marge {
  menuprijsCenten: Centen
  nettoOmzetCenten: Centen
  kostprijsCenten: Centen
  /** netto omzet − kostprijs */
  contributieCenten: Centen
  /** kostprijs ÷ netto omzet, als fractie (0,28 = 28%); null bij omzet 0 */
  foodCostPct: number | null
}

/**
 * netto_omzet   = menuprijs ÷ (1 + btw)
 * contributie   = netto_omzet − kostprijs
 * food_cost_pct = kostprijs ÷ netto_omzet
 */
export function berekenMarge(invoer: {
  menuprijsCenten: Centen
  btw: BtwCategorie
  kostprijsCenten: Centen
  peildatum: string
}): Marge {
  const nettoOmzetCenten = exclusiefBtw(invoer.menuprijsCenten, btwBasispunten(invoer.btw, invoer.peildatum))
  return {
    menuprijsCenten: invoer.menuprijsCenten,
    nettoOmzetCenten,
    kostprijsCenten: invoer.kostprijsCenten,
    contributieCenten: nettoOmzetCenten - invoer.kostprijsCenten,
    foodCostPct: nettoOmzetCenten > 0 ? invoer.kostprijsCenten / nettoOmzetCenten : null,
  }
}

/**
 * Gewogen gemiddelde contributiemarge van een kaart of gang:
 * kaart_marge = Σ (contributie × aantal) ÷ Σ aantal
 */
export function gewogenContributie(items: ReadonlyArray<{ contributieCenten: Centen, aantal: number }>): Centen | null {
  let som = 0
  let aantal = 0
  for (const item of items) {
    som += item.contributieCenten * item.aantal
    aantal += item.aantal
  }
  return aantal > 0 ? rondAf(som / aantal) : null
}
