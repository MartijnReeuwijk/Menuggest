import { describe, expect, it } from 'vitest'
import { formatEuro, parseEuro, rondAf } from './geld'

describe('parseEuro', () => {
  it.each([
    ['2,50', 250],
    ['707,50', 70750],
    ['1.234,50', 123450],
    ['1.234', 123400],
    ['€ 9,5', 950],
    ['2.5', 250],
    ['0,05', 5],
    ['-3,20', -320],
    ['12', 1200],
  ])('leest %s als %i cent', (invoer, verwacht) => {
    expect(parseEuro(invoer)).toBe(verwacht)
  })

  it('accepteert getallen zonder floatfouten', () => {
    expect(parseEuro(9.5)).toBe(950)
    expect(parseEuro(0.29)).toBe(29)
    expect(parseEuro(17.5)).toBe(1750)
  })

  it('weigert geen-bedragen', () => {
    expect(parseEuro('')).toBeNull()
    expect(parseEuro('abc')).toBeNull()
    expect(parseEuro(Number.NaN)).toBeNull()
  })
})

describe('rondAf', () => {
  it('rondt half naar boven, symmetrisch rond nul', () => {
    expect(rondAf(2.5)).toBe(3)
    expect(rondAf(-2.5)).toBe(-3)
    expect(rondAf(2.4999)).toBe(2)
  })
})

describe('formatEuro', () => {
  it('toont Nederlandse notatie', () => {
    expect(formatEuro(123450).replace(/\s/g, ' ')).toBe('€ 1.234,50')
  })
})
