/**
 * Bedragen zijn altijd hele centen in integers. Tussenresultaten (zoals de kosten
 * van 180 g uit een zak van 500 g) mogen fracties zijn; afronden gebeurt één keer,
 * aan het eind van een berekening, met `rondAf`.
 */
export type Centen = number

export function isCenten(waarde: number): waarde is Centen {
  return Number.isSafeInteger(waarde)
}

/** Rondt een (fractioneel) centbedrag af naar hele centen, half naar boven. */
export function rondAf(waarde: number): Centen {
  // Math.round rondt -0,5 naar 0; voor negatieve bedragen spiegelen we.
  return waarde < 0 ? -Math.round(-waarde) : Math.round(waarde)
}

/**
 * Leest een eurobedrag zoals kassa's en mensen het schrijven: "2,50", "1.234,50",
 * "€ 9,5", 9.5. Geeft hele centen terug, of `null` als het geen bedrag is.
 */
export function parseEuro(invoer: string | number): Centen | null {
  if (typeof invoer === 'number') {
    return Number.isFinite(invoer) ? rondAf(invoer * 100) : null
  }
  let tekst = invoer.replace(/[€\s]/g, '')
  if (tekst === '') return null
  const negatief = tekst.startsWith('-')
  if (negatief) tekst = tekst.slice(1)

  const komma = tekst.lastIndexOf(',')
  const punt = tekst.lastIndexOf('.')
  let heel: string
  let fractie = ''
  if (komma > punt) {
    // Nederlands: punt is duizendtal, komma is decimaal.
    heel = tekst.slice(0, komma).replace(/\./g, '')
    fractie = tekst.slice(komma + 1)
  } else if (punt > komma && komma === -1 && /^\d{1,3}(\.\d{3})+$/.test(tekst)) {
    // "1.234" zonder komma: duizendtal.
    heel = tekst.replace(/\./g, '')
  } else if (punt > komma) {
    heel = tekst.slice(0, punt).replace(/,/g, '')
    fractie = tekst.slice(punt + 1)
  } else {
    heel = tekst
  }

  if (!/^\d+$/.test(heel || '0') || !/^\d*$/.test(fractie)) return null
  const centen = Number(heel || '0') * 100 + Math.round(Number(`0.${fractie || '0'}`) * 100)
  return negatief ? -centen : centen
}

const euroFormat = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })

export function formatEuro(centen: Centen): string {
  return euroFormat.format(centen / 100)
}
