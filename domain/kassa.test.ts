import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  KassaImportFout,
  controleerMapping,
  leesTabel,
  leesVerkoop,
  normaliseerArtikelnaam,
  parseAantal,
  parseBtwPct,
  periodesOverlappen,
  raadGang,
  raadMapping,
  stelGerechtVoor,
  vindExportdatum,
  vindKopregel,
} from './kassa'
import { verkoopPerGerecht } from './verkoop'

const fixture = (naam: string) => readFileSync(new URL(`../legacy/assets/${naam}`, import.meta.url), 'utf8')

describe('parseAantal', () => {
  it.each([
    ['283', 283],
    ['1.137', 1137],
    ['14.190', 14190],
    ['-2', -2],
    [' 7 ', 7],
    ['3,00', 3],
  ])('leest %s als %i', (tekst, verwacht) => {
    expect(parseAantal(tekst)).toBe(verwacht)
  })

  it.each(['', 'abc', '2,5', '1.5'])('weigert %s', (tekst) => {
    expect(parseAantal(tekst)).toBeNull()
  })
})

describe('parseBtwPct', () => {
  it('leest percentages naar basispunten', () => {
    expect(parseBtwPct('6%')).toBe(600)
    expect(parseBtwPct('21 %')).toBe(2100)
    expect(parseBtwPct('9,0')).toBe(900)
    expect(parseBtwPct('hoog')).toBeNull()
  })
})

describe('raadMapping', () => {
  it('herkent de kolommen van de Untill-export', () => {
    const kop = ['A.Omschrijving', 'A.Nummer', 'Tekst', 'Aantal', 'Prijs', 'Bedrag incl.', 'Bedrag excl.', 'BTW-code', 'BTW-tarief', 'Kortingspercentage', 'Kortingsbedrag', 'Omzetgroepnr.', 'Omzetgroep']
    expect(raadMapping(kop)).toEqual({ artikelnaam: 0, artikelnummer: 1, aantal: 3, omzetIncl: 5, omzetExcl: 6, btwTarief: 8, omzetgroep: 12 })
  })

  it('herkent Engelse koppen', () => {
    expect(raadMapping(['Product', 'Quantity', 'Net amount', 'Category'])).toEqual({ artikelnaam: 0, aantal: 1, omzetExcl: 2, omzetgroep: 3 })
  })

  it('meldt wat ontbreekt', () => {
    expect(controleerMapping({ artikelnaam: 0 }).map(p => p.veld)).toEqual(['aantal', 'omzetExcl'])
    expect(controleerMapping({ artikelnaam: 0, aantal: 1, omzetIncl: 2, btwTarief: 3 })).toEqual([])
    expect(controleerMapping({ artikelnaam: 0, aantal: 0, omzetExcl: 2 }).map(p => p.veld)).toEqual(['artikelnaam', 'aantal'])
  })
})

describe('kassa-export uit 2018 (CSV)', () => {
  const rijen = leesTabel(fixture('convertcsv.csv'))
  const kop = vindKopregel(rijen)
  const lezing = leesVerkoop(rijen, kop, raadMapping(rijen[kop]!))

  it('vindt de kopregel onder de metaregels', () => {
    expect(rijen).toHaveLength(348)
    expect(kop).toBe(2)
    expect(vindExportdatum(rijen, kop)).toBe('2018-09-11')
  })

  it('leest alle 344 artikelregels', () => {
    expect(lezing.gelezenRegels).toBe(344)
    expect(lezing.overgeslagen.map(o => o.reden)).toEqual(['Totaalregel van de export'])
  })

  it('telt op tot de totaalregel van de kassa', () => {
    expect(lezing.totaal).toEqual({ aantal: 14190, omzetExclCenten: 10550326 })
    expect(lezing.totaalregel).toEqual({ aantal: 14190, omzetExclCenten: 10550326 })
  })

  it('voegt regels van hetzelfde artikel samen, per omzetgroep', () => {
    const vis = lezing.artikelen.filter(a => a.sleutel === 'vis van de markt')
    expect(vis).toHaveLength(1)
    expect(vis[0]!.aantal).toBe(139 + 204)
    expect(vis[0]!.bronregels).toHaveLength(2)

    const carpaccio = lezing.artikelen.filter(a => a.sleutel === 'carpaccio')
    expect(carpaccio.map(a => a.omzetgroep).sort()).toEqual(['Voorgerechten Bokkesteeg', 'Voorgerechten Meierij'])
  })

  it('kiest de gangbare prijs, niet een gemiddelde met gratis menuonderdelen', () => {
    const hoofd = lezing.artikelen.find(a => a.sleutel === 'maandmenu hoofd')!
    expect(hoofd.aantal).toBe(387)
    expect(hoofd.gangbarePrijsInclCenten).toBe(1950)
  })
})

describe('kassa-export uit 2018 (JSON)', () => {
  it('geeft hetzelfde resultaat als de CSV', () => {
    const rijen = leesTabel(fixture('csvjson.json'))
    const kop = vindKopregel(rijen)
    const lezing = leesVerkoop(rijen, kop, raadMapping(rijen[kop]!))
    expect(kop).toBe(2)
    expect(lezing.gelezenRegels).toBe(344)
    expect(lezing.totaal).toEqual({ aantal: 14190, omzetExclCenten: 10550326 })
  })
})

describe('leesVerkoop', () => {
  it('rekent omzet excl. uit incl. en btw als de export geen excl. heeft', () => {
    const rijen = [['Artikel', 'Aantal', 'Omzet', 'BTW %'], ['Biefstuk', '2', '43,60', '9%'], ['Wijn', '1', '6,05', '21%']]
    const lezing = leesVerkoop(rijen, 0, raadMapping(rijen[0]!))
    expect(lezing.artikelen.map(a => a.omzetExclCenten)).toEqual([4000, 500])
  })

  it('slaat onleesbare regels over met een reden', () => {
    const rijen = [['Artikel', 'Aantal', 'Netto'], ['Biefstuk', 'veel', '10,00'], ['Saté', '1', 'gratis'], ['', '', '']]
    const lezing = leesVerkoop(rijen, 0, raadMapping(rijen[0]!))
    expect(lezing.artikelen).toEqual([])
    expect(lezing.overgeslagen.map(o => o.regel)).toEqual([2, 3])
  })

  it('weigert een onvolledige mapping', () => {
    expect(() => leesVerkoop([['a']], 0, { artikelnaam: 0 })).toThrow(KassaImportFout)
  })
})

describe('leesTabel', () => {
  it('herkent puntkomma als scheidingsteken', () => {
    expect(leesTabel('Artikel;Aantal\nSaté;3\n')).toEqual([['Artikel', 'Aantal'], ['Saté', '3']])
  })

  it('weigert lege bestanden en kapotte JSON', () => {
    expect(() => leesTabel('')).toThrow(KassaImportFout)
    expect(() => leesTabel('[{"a":')).toThrow(KassaImportFout)
  })
})

describe('stelGerechtVoor', () => {
  const gerechten = [
    { id: 'sate', naam: 'Saté van varkenshaas' },
    { id: 'ribeye', naam: 'Runder-ribeye 350 gram' },
    { id: 'italiaans', naam: 'Italiaans dessert' },
    { id: 'zalm', naam: 'Zalmfilet' },
    { id: 'salade', naam: 'Salade gerookte zalm' },
    { id: 'champ', naam: 'Champignons' },
    { id: 'vis', naam: 'Vis van de markt' },
  ]
  const voorstel = (naam: string) => stelGerechtVoor(naam, gerechten)?.gerechtId ?? null

  it.each([
    ['Saté', 'sate'],
    ['Sate', 'sate'],
    ['Ribeye', 'ribeye'],
    ['Italiaans', 'italiaans'],
    ['Zalmfilet', 'zalm'],
    ['Vis van de markt', 'vis'],
    ['Salade gerookte zalm', 'salade'],
  ])('%s → %s', (naam, verwacht) => {
    expect(voorstel(naam)).toBe(verwacht)
  })

  it.each(['Zalm kids', 'Champignonsoep', 'Asperges & Zalm', 'Coca cola', ''])('geen voorstel voor %s', (naam) => {
    expect(voorstel(naam)).toBeNull()
  })

  it('geen voorstel bij twee even goede kandidaten', () => {
    expect(stelGerechtVoor('Biefstuk', [{ id: 'a', naam: 'Biefstuk' }, { id: 'b', naam: 'biefstuk' }])).toBeNull()
  })
})

describe('raadGang', () => {
  it('leest de gang uit de omzetgroep', () => {
    expect(raadGang('Voorgerechten Meierij')).toBe('voorgerecht')
    expect(raadGang('Hoofgerechten Meierij')).toBe('hoofdgerecht')
    expect(raadGang('Nagerechten Meierij')).toBe('nagerecht')
    expect(raadGang('Wijnen Meierij')).toBeNull()
    expect(raadGang(null)).toBeNull()
  })
})

describe('normaliseerArtikelnaam', () => {
  it('maakt namen vergelijkbaar', () => {
    expect(normaliseerArtikelnaam('  Saté   van  Varkenshaas ')).toBe('sate van varkenshaas')
  })
})

describe('periodesOverlappen', () => {
  it('ziet overlap inclusief randen', () => {
    expect(periodesOverlappen({ van: '2018-08-01', tot: '2018-08-31' }, { van: '2018-08-31', tot: '2018-09-30' })).toBe(true)
    expect(periodesOverlappen({ van: '2018-08-01', tot: '2018-08-30' }, { van: '2018-08-31', tot: '2018-09-30' })).toBe(false)
  })
})

describe('verkoopPerGerecht', () => {
  it('telt per gerecht via het koppelgeheugen en negeert de rest', () => {
    const koppelingen: Record<string, string | null> = { 'carpaccio': 'c', 'cola': null }
    const resultaat = verkoopPerGerecht([
      { sleutel: 'carpaccio', aantal: 322, omzetExclCenten: 100 },
      { sleutel: 'carpaccio', aantal: 5, omzetExclCenten: 10 },
      { sleutel: 'cola', aantal: 283, omzetExclCenten: 999 },
      { sleutel: 'onbekend', aantal: 1, omzetExclCenten: 1 },
    ], s => koppelingen[s])
    expect([...resultaat]).toEqual([['c', { aantal: 327, omzetExclCenten: 110 }]])
  })
})
