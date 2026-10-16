import type { Centen } from './geld'
import { type Eenheid, naarBasis } from './eenheden'

/**
 * Een inkoopprijs: "€ 12,40 per 5 kg bij leverancier X, vanaf 1 maart".
 * Prijzen worden nooit overschreven maar aangevuld, zodat de kaart van vorig
 * jaar met de prijzen van vorig jaar blijft rekenen.
 */
export interface IngredientPrijs {
  id: string
  ingredientId: string
  leverancier: string | null
  verpakkingsgrootte: number
  eenheid: Eenheid
  prijsCenten: Centen
  /** ISO-datum, jjjj-mm-dd */
  geldigVanaf: string
}

/**
 * De prijs die op `peildatum` gold: de laatste met geldigVanaf ≤ peildatum.
 * Bij meerdere leveranciers op dezelfde datum telt de goedkoopste per basiseenheid.
 */
export function geldendePrijs(
  prijzen: readonly IngredientPrijs[],
  ingredientId: string,
  peildatum: string,
): IngredientPrijs | undefined {
  let beste: IngredientPrijs | undefined
  for (const prijs of prijzen) {
    if (prijs.ingredientId !== ingredientId || prijs.geldigVanaf > peildatum) continue
    if (
      !beste
      || prijs.geldigVanaf > beste.geldigVanaf
      || (prijs.geldigVanaf === beste.geldigVanaf && prijsPerBasiseenheid(prijs) < prijsPerBasiseenheid(beste))
    ) {
      beste = prijs
    }
  }
  return beste
}

/** Centen per gram, milliliter of stuk; fractioneel. */
export function prijsPerBasiseenheid(prijs: IngredientPrijs): number {
  return prijs.prijsCenten / naarBasis(prijs.verpakkingsgrootte, prijs.eenheid)
}
