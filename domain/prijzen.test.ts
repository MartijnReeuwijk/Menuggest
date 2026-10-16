import { describe, expect, it } from 'vitest'
import { type IngredientPrijs, geldendePrijs, prijsPerBasiseenheid } from './prijzen'

const prijs = (p: Partial<IngredientPrijs>): IngredientPrijs => ({
  id: crypto.randomUUID(),
  ingredientId: 'zalm',
  leverancier: null,
  verpakkingsgrootte: 1,
  eenheid: 'kg',
  prijsCenten: 2500,
  geldigVanaf: '2026-01-01',
  ...p,
})

describe('geldendePrijs', () => {
  const prijzen = [
    prijs({ prijsCenten: 2200, geldigVanaf: '2025-06-01' }),
    prijs({ prijsCenten: 2500, geldigVanaf: '2026-01-01' }),
    prijs({ prijsCenten: 2900, geldigVanaf: '2026-12-01' }),
    prijs({ ingredientId: 'eend', prijsCenten: 1800 }),
  ]

  it('neemt de laatste prijs vóór of op de peildatum', () => {
    expect(geldendePrijs(prijzen, 'zalm', '2026-10-16')?.prijsCenten).toBe(2500)
    expect(geldendePrijs(prijzen, 'zalm', '2026-12-01')?.prijsCenten).toBe(2900)
    expect(geldendePrijs(prijzen, 'zalm', '2025-12-31')?.prijsCenten).toBe(2200)
  })

  it('geeft niets vóór de eerste prijs', () => {
    expect(geldendePrijs(prijzen, 'zalm', '2025-01-01')).toBeUndefined()
    expect(geldendePrijs(prijzen, 'tarbot', '2026-10-16')).toBeUndefined()
  })

  it('kiest bij gelijke datum de goedkoopste per eenheid, ongeacht verpakking', () => {
    const groothandel = prijs({ leverancier: 'Groothandel', verpakkingsgrootte: 5, prijsCenten: 11000 }) // 22,00/kg
    const visboer = prijs({ leverancier: 'Visboer', verpakkingsgrootte: 500, eenheid: 'g', prijsCenten: 1200 }) // 24,00/kg
    expect(geldendePrijs([visboer, groothandel], 'zalm', '2026-10-16')?.leverancier).toBe('Groothandel')
  })
})

describe('prijsPerBasiseenheid', () => {
  it('rekent per gram', () => {
    expect(prijsPerBasiseenheid(prijs({ verpakkingsgrootte: 5, eenheid: 'kg', prijsCenten: 6250 }))).toBe(1.25)
  })
})
