import Papa from 'papaparse'
import { type Centen, parseEuro } from './geld'
import { exclusiefBtw } from './btw'
import type { Gang } from './kaart'

/**
 * Kassa-import: van een export (Untill, Lightspeed, MplusKASSA, …) naar verkochte
 * aantallen per artikel. Elke kassa exporteert anders, dus: kopregel zoeken tussen
 * metaregels, kolommen raden maar laten bevestigen, en per artikel optellen.
 */

export class KassaImportFout extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'KassaImportFout'
  }
}

// Bestand → tabel

/** Leest CSV (scheidingsteken automatisch) of een JSON-array naar rijen met getrimde cellen. */
export function leesTabel(tekst: string): string[][] {
  const begin = tekst.trimStart()
  if (begin.startsWith('[')) return leesJson(begin)

  const resultaat = Papa.parse<string[]>(tekst.replace(/^﻿/, ''), { skipEmptyLines: 'greedy' })
  const fataal = resultaat.errors.find(f => f.type === 'Quotes' || f.type === 'Delimiter')
  if (fataal && resultaat.data.length === 0) throw new KassaImportFout(`Kan het bestand niet lezen: ${fataal.message}`)
  if (resultaat.data.length === 0) throw new KassaImportFout('Het bestand is leeg')
  return resultaat.data.map(rij => rij.map(cel => String(cel ?? '').trim()))
}

function leesJson(tekst: string): string[][] {
  let data: unknown
  try {
    data = JSON.parse(tekst)
  }
  catch {
    throw new KassaImportFout('Het bestand is geen geldige JSON')
  }
  if (!Array.isArray(data) || data.length === 0) throw new KassaImportFout('Verwacht een lijst met rijen')
  const cel = (waarde: unknown) => (waarde === null || waarde === undefined ? '' : String(waarde).trim())
  if (data.every(Array.isArray)) return (data as unknown[][]).map(rij => rij.map(cel))

  // Lijst van objecten (zoals een csv→json-converter maakt): sleutels worden de eerste rij.
  const sleutels = [...new Set(data.flatMap(rij => (rij && typeof rij === 'object' ? Object.keys(rij) : [])))]
  return [sleutels, ...data.map(rij => sleutels.map(s => cel((rij as Record<string, unknown>)[s])))]
}

// Kolommen

export const KASSA_VELDEN = ['artikelnaam', 'artikelnummer', 'aantal', 'omzetExcl', 'omzetIncl', 'btwTarief', 'omzetgroep'] as const
export type KassaVeld = (typeof KASSA_VELDEN)[number]
export type KolomMapping = Partial<Record<KassaVeld, number>>

export const KASSA_VELD_LABELS: Record<KassaVeld, string> = {
  artikelnaam: 'Artikelnaam',
  artikelnummer: 'Artikelnummer',
  aantal: 'Aantal verkocht',
  omzetExcl: 'Omzet excl. btw',
  omzetIncl: 'Omzet incl. btw',
  btwTarief: 'Btw-tarief',
  omzetgroep: 'Omzetgroep',
}

/** Genormaliseerde kolomnamen per veld; eerst exact, daarna als deel van de naam. */
const SYNONIEMEN: Record<KassaVeld, string[]> = {
  artikelnaam: ['aomschrijving', 'omschrijving', 'artikelnaam', 'artikel', 'productnaam', 'product', 'naam', 'item', 'description'],
  artikelnummer: ['anummer', 'artikelnummer', 'artnr', 'plu', 'productid', 'sku', 'nummer'],
  aantal: ['aantal', 'aantalverkocht', 'verkocht', 'stuks', 'qty', 'quantity'],
  omzetExcl: ['bedragexcl', 'omzetexcl', 'omzetexclbtw', 'exclbtw', 'netto', 'netamount', 'excl'],
  omzetIncl: ['bedragincl', 'omzetincl', 'omzetinclbtw', 'inclbtw', 'bruto', 'omzet', 'grossamount', 'incl'],
  btwTarief: ['btwtarief', 'btw%', 'btwpercentage', 'vatrate', 'tarief'],
  omzetgroep: ['omzetgroep', 'productgroep', 'artikelgroep', 'groep', 'categorie', 'category'],
}

const normaliseerKop = (kop: string) => kop.toLowerCase().replace(/[^a-z0-9%]/g, '')

/** Raadt per veld een kolom. Elke kolom wordt maar één keer gebruikt. */
export function raadMapping(kop: readonly string[]): KolomMapping {
  const genormaliseerd = kop.map(normaliseerKop)
  const gebruikt = new Set<number>()
  const mapping: KolomMapping = {}
  for (const exact of [true, false]) {
    for (const veld of KASSA_VELDEN) {
      if (mapping[veld] !== undefined) continue
      for (const synoniem of SYNONIEMEN[veld]) {
        const index = genormaliseerd.findIndex((naam, i) => !gebruikt.has(i) && naam !== '' && (exact ? naam === synoniem : naam.includes(synoniem)))
        if (index >= 0) {
          mapping[veld] = index
          gebruikt.add(index)
          break
        }
      }
    }
  }
  return mapping
}

/**
 * Exports beginnen vaak met metaregels ("Tijdstip geëxporteerd: …"). De kopregel is
 * de rij in het begin van het bestand waarin de meeste velden te herkennen zijn.
 */
export function vindKopregel(rijen: readonly string[][], zoekBereik = 25): number {
  let beste = -1
  let besteScore = 1
  rijen.slice(0, zoekBereik).forEach((rij, index) => {
    const mapping = raadMapping(rij)
    const score = Object.keys(mapping).length
    if (mapping.artikelnaam !== undefined && mapping.aantal !== undefined && score > besteScore) {
      beste = index
      besteScore = score
    }
  })
  return beste
}

/** Zoekt een exportdatum in de metaregels boven de kop, als jjjj-mm-dd. */
export function vindExportdatum(rijen: readonly string[][], kopIndex: number): string | null {
  for (const rij of rijen.slice(0, Math.max(kopIndex, 0))) {
    for (const cel of rij) {
      const match = cel.match(/(\d{1,2})-(\d{1,2})-(\d{4})/)
      if (match) return `${match[3]}-${match[2]!.padStart(2, '0')}-${match[1]!.padStart(2, '0')}`
    }
  }
  return null
}

export interface KolomControle {
  veld: KassaVeld
  probleem: string
}

/** Wat moet er minimaal gekoppeld zijn om te kunnen importeren? */
export function controleerMapping(mapping: KolomMapping): KolomControle[] {
  const problemen: KolomControle[] = []
  if (mapping.artikelnaam === undefined) problemen.push({ veld: 'artikelnaam', probleem: 'Kies de kolom met de artikelnaam' })
  if (mapping.aantal === undefined) problemen.push({ veld: 'aantal', probleem: 'Kies de kolom met het aantal' })
  if (mapping.omzetExcl === undefined && (mapping.omzetIncl === undefined || mapping.btwTarief === undefined)) {
    problemen.push({ veld: 'omzetExcl', probleem: 'Kies de omzet excl. btw, of omzet incl. btw samen met het btw-tarief' })
  }
  const dubbel = Object.entries(mapping).filter(([, kolom], _, alle) => alle.filter(([, k]) => k === kolom).length > 1)
  for (const [veld] of dubbel) problemen.push({ veld: veld as KassaVeld, probleem: 'Deze kolom is al aan een ander veld gekoppeld' })
  return problemen
}

// Getallen

/**
 * Aantallen in Nederlandse notatie: "1.137" is duizendhonderdzevenendertig, niet 1,137.
 * Geeft null als het geen heel getal is.
 */
export function parseAantal(tekst: string): number | null {
  const schoon = tekst.replace(/\s/g, '')
  if (/^-?\d{1,3}(\.\d{3})+$/.test(schoon)) return Number(schoon.replace(/\./g, ''))
  if (/^-?\d+$/.test(schoon)) return Number(schoon)
  if (/^-?\d+[.,]0+$/.test(schoon)) return Number(schoon.split(/[.,]/)[0])
  return null
}

/** "6%", "21", "9,0 %" → basispunten. */
export function parseBtwPct(tekst: string): number | null {
  const match = tekst.replace(/\s/g, '').match(/^(\d+(?:[.,]\d+)?)%?$/)
  return match ? Math.round(Number(match[1]!.replace(',', '.')) * 100) : null
}

// Regels → artikelen

export interface KassaArtikel {
  /** omzetgroep + genormaliseerde naam; uniek binnen één import */
  id: string
  artikelnaam: string
  /** Genormaliseerde naam; sleutel voor het koppelgeheugen. */
  sleutel: string
  artikelnummers: string[]
  omzetgroep: string | null
  aantal: number
  omzetExclCenten: Centen
  omzetInclCenten: Centen | null
  /** Verkoopprijs incl. btw waarvoor de meeste stuks over de toonbank gingen (prijs > 0). */
  gangbarePrijsInclCenten: Centen | null
  bronregels: number[]
}

export interface Overgeslagen {
  /** 1-gebaseerd regelnummer in het bestand */
  regel: number
  reden: string
  inhoud: string
}

export interface KassaLezing {
  artikelen: KassaArtikel[]
  gelezenRegels: number
  overgeslagen: Overgeslagen[]
  totaal: { aantal: number, omzetExclCenten: Centen }
  /** De totaalregel uit de export zelf, als die er is, om tegen te controleren. */
  totaalregel: { aantal: number | null, omzetExclCenten: Centen | null } | null
}

export function normaliseerArtikelnaam(naam: string): string {
  return naam
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function leesVerkoop(rijen: readonly string[][], kopIndex: number, mapping: KolomMapping): KassaLezing {
  if (controleerMapping(mapping).length) throw new KassaImportFout('De kolomkoppeling is niet compleet')
  const kolom = (rij: readonly string[], veld: KassaVeld) => {
    const index = mapping[veld]
    return index === undefined ? '' : (rij[index] ?? '').trim()
  }

  const artikelen = new Map<string, KassaArtikel & { prijzen: Map<Centen, number> }>()
  const overgeslagen: Overgeslagen[] = []
  let totaalregel: KassaLezing['totaalregel'] = null
  let gelezenRegels = 0

  rijen.forEach((rij, index) => {
    if (index <= kopIndex || rij.every(cel => cel.trim() === '')) return
    const regel = index + 1
    const naam = kolom(rij, 'artikelnaam')
    const aantal = parseAantal(kolom(rij, 'aantal'))
    const sla = (reden: string) => overgeslagen.push({ regel, reden, inhoud: rij.filter(Boolean).join(' · ') })

    if (!naam) {
      if (aantal !== null && !totaalregel) {
        totaalregel = { aantal, omzetExclCenten: mapping.omzetExcl === undefined ? null : parseEuro(kolom(rij, 'omzetExcl')) }
        sla('Totaalregel van de export')
      }
      else {
        sla('Geen artikelnaam')
      }
      return
    }
    if (aantal === null) return sla(`Aantal "${kolom(rij, 'aantal')}" is geen heel getal`)

    const omzetIncl = mapping.omzetIncl === undefined ? null : parseEuro(kolom(rij, 'omzetIncl'))
    let omzetExcl: Centen | null
    if (mapping.omzetExcl !== undefined) {
      omzetExcl = parseEuro(kolom(rij, 'omzetExcl'))
    }
    else {
      const btw = parseBtwPct(kolom(rij, 'btwTarief'))
      omzetExcl = omzetIncl === null || btw === null ? null : exclusiefBtw(omzetIncl, btw)
    }
    if (omzetExcl === null) return sla('Omzet is geen bedrag')
    if (mapping.omzetIncl !== undefined && omzetIncl === null) return sla('Omzet incl. btw is geen bedrag')

    const omzetgroep = kolom(rij, 'omzetgroep') || null
    const sleutel = normaliseerArtikelnaam(naam)
    const id = `${omzetgroep ?? ''}\u0000${sleutel}`
    const artikel = artikelen.get(id) ?? {
      id,
      artikelnaam: naam,
      sleutel,
      artikelnummers: [],
      omzetgroep,
      aantal: 0,
      omzetExclCenten: 0,
      omzetInclCenten: mapping.omzetIncl === undefined ? null : 0,
      gangbarePrijsInclCenten: null,
      bronregels: [],
      prijzen: new Map<Centen, number>(),
    }
    const nummer = kolom(rij, 'artikelnummer')
    if (nummer && !artikel.artikelnummers.includes(nummer)) artikel.artikelnummers.push(nummer)
    artikel.aantal += aantal
    artikel.omzetExclCenten += omzetExcl
    if (artikel.omzetInclCenten !== null && omzetIncl !== null) artikel.omzetInclCenten += omzetIncl
    if (omzetIncl !== null && aantal > 0 && omzetIncl > 0) {
      const stukprijs = Math.round(omzetIncl / aantal)
      artikel.prijzen.set(stukprijs, (artikel.prijzen.get(stukprijs) ?? 0) + aantal)
    }
    artikel.bronregels.push(regel)
    artikelen.set(id, artikel)
    gelezenRegels++
  })

  const lijst = [...artikelen.values()].map(({ prijzen, ...artikel }): KassaArtikel => {
    let gangbaar: Centen | null = null
    let meeste = 0
    for (const [prijs, aantal] of prijzen) {
      if (aantal > meeste) {
        gangbaar = prijs
        meeste = aantal
      }
    }
    return { ...artikel, gangbarePrijsInclCenten: gangbaar }
  })

  return {
    artikelen: lijst,
    gelezenRegels,
    overgeslagen,
    totaal: {
      aantal: lijst.reduce((som, a) => som + a.aantal, 0),
      omzetExclCenten: lijst.reduce((som, a) => som + a.omzetExclCenten, 0),
    },
    totaalregel,
  }
}

// Koppelen aan gerechten

const STOPWOORDEN = new Set(['de', 'het', 'een', 'van', 'en', 'met', 'op', 'in'])

function woorden(naam: string): Set<string> {
  return new Set(normaliseerArtikelnaam(naam).split(/[^a-z0-9]+/).filter(w => w && !STOPWOORDEN.has(w)))
}

export interface Suggestie {
  gerechtId: string
  score: number
}

/**
 * Stelt een gerecht voor bij een kassa-artikel als de woorden van het één helemaal in
 * het ander zitten ("Saté" ↔ "Saté van varkenshaas", "Ribeye" ↔ "Runder-ribeye 350 gram").
 * Bij twee even goede kandidaten geen voorstel: dan moet een mens kiezen.
 * Het blijft een voorstel; de gebruiker bevestigt.
 */
export function stelGerechtVoor(artikelnaam: string, gerechten: ReadonlyArray<{ id: string, naam: string }>): Suggestie | null {
  const artikel = woorden(artikelnaam)
  if (artikel.size === 0) return null
  let beste: Suggestie | null = null
  let gelijk = false
  for (const gerecht of gerechten) {
    const kandidaat = woorden(gerecht.naam)
    if (kandidaat.size === 0) continue
    const overlap = [...artikel].filter(w => kandidaat.has(w)).length
    if (overlap === 0 || overlap < Math.min(artikel.size, kandidaat.size)) continue
    const score = (overlap * overlap) / (artikel.size * kandidaat.size)
    if (score < 0.25) continue
    if (!beste || score > beste.score) {
      beste = { gerechtId: gerecht.id, score }
      gelijk = false
    }
    else if (score === beste.score) {
      gelijk = true
    }
  }
  return gelijk ? null : beste
}

/** Omzetgroepen als "Hoofgerechten Meierij" (sic) verraden de gang. */
export function raadGang(omzetgroep: string | null): Gang | null {
  const groep = normaliseerArtikelnaam(omzetgroep ?? '')
  if (/voorgerecht|starter|appetizer/.test(groep)) return 'voorgerecht'
  if (/hoof?d?gerecht|hoofdgang|main/.test(groep)) return 'hoofdgerecht'
  if (/nagerecht|dessert/.test(groep)) return 'nagerecht'
  if (/bijgerecht|side/.test(groep)) return 'bijgerecht'
  return null
}

// Periodes

export interface Periode {
  van: string
  tot: string
}

export function periodesOverlappen(a: Periode, b: Periode): boolean {
  return a.van <= b.tot && b.van <= a.tot
}
