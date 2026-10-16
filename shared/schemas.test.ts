import { describe, expect, it } from 'vitest'
import seed from '../data/seed.json'
import { keukenSchema, migreerKeuken } from './schemas'

describe('keukenSchema', () => {
  it('accepteert de seed', () => {
    expect(keukenSchema.safeParse(seed).success).toBe(true)
  })

  it('migreert opgeslagen data van versie 1', () => {
    const v1 = { ...seed, versie: 1, imports: undefined, verkoopregels: undefined, koppelingen: undefined }
    const resultaat = keukenSchema.safeParse(migreerKeuken(v1))
    expect(resultaat.success).toBe(true)
    expect(resultaat.data?.koppelingen).toEqual([])
  })

  it('weigert een import met einddatum voor begindatum', () => {
    const ongeldig = { ...seed, imports: [{ id: crypto.randomUUID(), bestandsnaam: 'x.csv', periodeVan: '2018-09-01', periodeTot: '2018-08-01', locatie: null, geimporteerdOp: new Date().toISOString() }] }
    expect(keukenSchema.safeParse(ongeldig).success).toBe(false)
  })
})
