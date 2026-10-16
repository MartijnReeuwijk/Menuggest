import { describe, expect, it } from 'vitest'
import { berekenMarge, gewogenContributie } from './marge'

describe('berekenMarge', () => {
  it('rekent contributie en food cost exclusief btw', () => {
    const marge = berekenMarge({ menuprijsCenten: 2000, btw: 'laag', kostprijsCenten: 271, peildatum: '2026-10-16' })
    expect(marge.nettoOmzetCenten).toBe(1835)
    expect(marge.contributieCenten).toBe(1564)
    expect(marge.foodCostPct).toBeCloseTo(0.1477, 4)
  })

  it('een gerecht kan verlies maken', () => {
    const marge = berekenMarge({ menuprijsCenten: 1090, btw: 'laag', kostprijsCenten: 1200, peildatum: '2026-10-16' })
    expect(marge.contributieCenten).toBe(-200)
    expect(marge.foodCostPct).toBeCloseTo(1.2)
  })

  it('food cost is onbepaald zonder omzet', () => {
    expect(berekenMarge({ menuprijsCenten: 0, btw: 'laag', kostprijsCenten: 100, peildatum: '2026-10-16' }).foodCostPct).toBeNull()
  })
})

describe('gewogenContributie', () => {
  it('weegt naar aantal verkocht', () => {
    expect(gewogenContributie([
      { contributieCenten: 1500, aantal: 30 },
      { contributieCenten: 900, aantal: 10 },
    ])).toBe(1350)
  })

  it('geeft null zonder verkopen', () => {
    expect(gewogenContributie([])).toBeNull()
  })
})
