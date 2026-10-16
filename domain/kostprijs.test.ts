import { describe, expect, it } from 'vitest'
import { berekenKostprijs, type ReceptRegel } from './kostprijs'
import type { IngredientPrijs } from './prijzen'

const prijzen: Record<string, IngredientPrijs> = {
  zalm: { id: 'p1', ingredientId: 'zalm', leverancier: null, verpakkingsgrootte: 5, eenheid: 'kg', prijsCenten: 6250, geldigVanaf: '2026-01-01' },
  mosterd: { id: 'p2', ingredientId: 'mosterd', leverancier: null, verpakkingsgrootte: 1, eenheid: 'l', prijsCenten: 400, geldigVanaf: '2026-01-01' },
  ei: { id: 'p3', ingredientId: 'ei', leverancier: null, verpakkingsgrootte: 30, eenheid: 'stuk', prijsCenten: 750, geldigVanaf: '2026-01-01' },
}
const prijsVoor = (id: string) => prijzen[id]

describe('berekenKostprijs', () => {
  it('rekent hoeveelheid × prijs ÷ yield en rondt één keer af', () => {
    const regels: ReceptRegel[] = [
      { ingredientId: 'zalm', hoeveelheid: 180, eenheid: 'g', yieldPct: 90 }, // 200 g bruto × 1,25 = 250
      { ingredientId: 'mosterd', hoeveelheid: 2, eenheid: 'cl', yieldPct: 100 }, // 20 ml × 0,4 = 8
      { ingredientId: 'ei', hoeveelheid: 0.5, eenheid: 'stuk', yieldPct: 100 }, // 0,5 × 25 = 12,5
    ]
    const resultaat = berekenKostprijs(regels, prijsVoor)
    expect(resultaat.regels.map(r => r.kostenCenten)).toEqual([250, 8, 12.5])
    expect(resultaat.regels[0]!.brutoBasis).toBe(200)
    expect(resultaat.kostprijsCenten).toBe(271) // 270,5 → 271
    expect(resultaat.volledig).toBe(true)
  })

  it('markeert een ontbrekende prijs in plaats van 0 te rekenen', () => {
    const resultaat = berekenKostprijs([
      { ingredientId: 'zalm', hoeveelheid: 180, eenheid: 'g', yieldPct: 90 },
      { ingredientId: 'dille', hoeveelheid: 2, eenheid: 'g', yieldPct: 100 },
    ], prijsVoor)
    expect(resultaat.volledig).toBe(false)
    expect(resultaat.regels[1]!.probleem).toBe('geen_prijs')
    expect(resultaat.kostprijsCenten).toBe(250)
  })

  it('markeert gewicht tegen een prijs per liter', () => {
    const resultaat = berekenKostprijs([{ ingredientId: 'mosterd', hoeveelheid: 20, eenheid: 'g', yieldPct: 100 }], prijsVoor)
    expect(resultaat.regels[0]!.probleem).toBe('eenheid_onverenigbaar')
    expect(resultaat.volledig).toBe(false)
  })

  it('weigert een yield van 0 of boven de 100', () => {
    for (const yieldPct of [0, -10, 120]) {
      const resultaat = berekenKostprijs([{ ingredientId: 'zalm', hoeveelheid: 1, eenheid: 'g', yieldPct }], prijsVoor)
      expect(resultaat.regels[0]!.probleem).toBe('ongeldige_yield')
    }
  })

  it('een leeg recept kost niets en is volledig', () => {
    expect(berekenKostprijs([], prijsVoor)).toEqual({ kostprijsCenten: 0, regels: [], volledig: true })
  })
})
