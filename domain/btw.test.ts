import { describe, expect, it } from 'vitest'
import { btwBasispunten, exclusiefBtw } from './btw'

describe('btw', () => {
  it('kiest het tarief dat op de peildatum gold', () => {
    expect(btwBasispunten('laag', '2018-12-31')).toBe(600)
    expect(btwBasispunten('laag', '2019-01-01')).toBe(900)
    expect(btwBasispunten('hoog', '2026-10-16')).toBe(2100)
    expect(btwBasispunten('nul', '2026-10-16')).toBe(0)
  })

  it('haalt btw uit een menuprijs', () => {
    expect(exclusiefBtw(2000, 900)).toBe(1835) // 18,348… → 18,35
    expect(exclusiefBtw(1210, 2100)).toBe(1000)
    expect(exclusiefBtw(500, 0)).toBe(500)
  })
})
