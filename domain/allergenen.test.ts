import { describe, expect, it } from 'vitest'
import { type Allergeen, allergenenVan } from './allergenen'

describe('allergenenVan', () => {
  const lijst: Record<string, Allergeen[]> = {
    pesto: ['noten', 'melk'],
    pasta: ['gluten', 'ei'],
    tomaat: [],
  }

  it('verenigt de allergenen van alle ingrediënten in vaste volgorde', () => {
    expect(allergenenVan(['pesto', 'pasta', 'tomaat'], id => lijst[id])).toEqual(['gluten', 'ei', 'melk', 'noten'])
  })

  it('negeert onbekende ingrediënten', () => {
    expect(allergenenVan(['onbekend'], id => lijst[id])).toEqual([])
  })
})
