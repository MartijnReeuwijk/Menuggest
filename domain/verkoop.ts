import type { Centen } from './geld'

export interface Verkocht {
  aantal: number
  omzetExclCenten: Centen
}

/**
 * Telt verkoopregels op per gerecht, via het koppelgeheugen (sleutel → gerecht).
 * Regels zonder koppeling of met "negeren" tellen niet mee.
 */
export function verkoopPerGerecht(
  regels: Iterable<{ sleutel: string, aantal: number, omzetExclCenten: Centen }>,
  gerechtVoor: (sleutel: string) => string | null | undefined,
): Map<string, Verkocht> {
  const totaal = new Map<string, Verkocht>()
  for (const regel of regels) {
    const gerechtId = gerechtVoor(regel.sleutel)
    if (!gerechtId) continue
    const huidig = totaal.get(gerechtId) ?? { aantal: 0, omzetExclCenten: 0 }
    huidig.aantal += regel.aantal
    huidig.omzetExclCenten += regel.omzetExclCenten
    totaal.set(gerechtId, huidig)
  }
  return totaal
}
