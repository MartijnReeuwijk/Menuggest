import { describe, expect, it } from 'vitest'
import { OnverenigbareEenheden, naarBasis, rekenOm, verenigbareEenheden } from './eenheden'

describe('eenheden', () => {
  it('rekent naar de basiseenheid', () => {
    expect(naarBasis(1.5, 'kg')).toBe(1500)
    expect(naarBasis(2, 'cl')).toBe(20)
    expect(naarBasis(3, 'stuk')).toBe(3)
  })

  it('rekent om binnen een dimensie', () => {
    expect(rekenOm(500, 'g', 'kg')).toBe(0.5)
    expect(rekenOm(0.75, 'l', 'cl')).toBe(75)
  })

  it('weigert gewicht naar volume', () => {
    expect(() => rekenOm(100, 'g', 'ml')).toThrow(OnverenigbareEenheden)
  })

  it('geeft de kiesbare eenheden per dimensie', () => {
    expect(verenigbareEenheden('kg')).toEqual(['g', 'kg'])
    expect(verenigbareEenheden('stuk')).toEqual(['stuk'])
  })
})
