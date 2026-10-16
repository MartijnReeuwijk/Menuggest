import { type Centen, rondAf } from './geld'
import { type Eenheid, naarBasis, zijnVerenigbaar } from './eenheden'
import { type IngredientPrijs, prijsPerBasiseenheid } from './prijzen'

export interface ReceptRegel {
  ingredientId: string
  /** Netto hoeveelheid op het bord, per portie. */
  hoeveelheid: number
  eenheid: Eenheid
  /** Bruikbaar deel na schoonmaken, snijden en garen, 1–100. */
  yieldPct: number
}

export type RegelProbleem = 'geen_prijs' | 'eenheid_onverenigbaar' | 'ongeldige_yield'

export interface RegelKosten {
  regel: ReceptRegel
  /** Fractionele centen; `null` als de regel niet te berekenen is. */
  kostenCenten: number | null
  /** Bruto in te kopen hoeveelheid in basiseenheden (hoeveelheid ÷ yield). */
  brutoBasis: number | null
  probleem: RegelProbleem | null
}

export interface Kostprijs {
  /** Afgerond op hele centen; alleen over de regels die te berekenen waren. */
  kostprijsCenten: Centen
  regels: RegelKosten[]
  /**
   * `false` als één of meer regels niet te berekenen waren. Een onvolledige
   * kostprijs is te laag en mag nooit stil als echte marge getoond worden.
   */
  volledig: boolean
}

/**
 * kostprijs = Σ (hoeveelheid × prijs per eenheid) ÷ yield
 *
 * `prijsVoor` geeft de geldende inkoopprijs van een ingrediënt, of undefined.
 */
export function berekenKostprijs(
  regels: readonly ReceptRegel[],
  prijsVoor: (ingredientId: string) => IngredientPrijs | undefined,
): Kostprijs {
  const resultaat = regels.map((regel): RegelKosten => {
    if (!(regel.yieldPct > 0 && regel.yieldPct <= 100)) {
      return { regel, kostenCenten: null, brutoBasis: null, probleem: 'ongeldige_yield' }
    }
    const prijs = prijsVoor(regel.ingredientId)
    if (!prijs) {
      return { regel, kostenCenten: null, brutoBasis: null, probleem: 'geen_prijs' }
    }
    if (!zijnVerenigbaar(regel.eenheid, prijs.eenheid)) {
      return { regel, kostenCenten: null, brutoBasis: null, probleem: 'eenheid_onverenigbaar' }
    }
    const brutoBasis = naarBasis(regel.hoeveelheid, regel.eenheid) / (regel.yieldPct / 100)
    return { regel, kostenCenten: brutoBasis * prijsPerBasiseenheid(prijs), brutoBasis, probleem: null }
  })

  const totaal = resultaat.reduce((som, r) => som + (r.kostenCenten ?? 0), 0)
  return {
    kostprijsCenten: rondAf(totaal),
    regels: resultaat,
    volledig: resultaat.every(r => r.probleem === null),
  }
}
