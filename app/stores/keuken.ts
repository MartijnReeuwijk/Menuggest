import {
  type Eenheid,
  type Gang,
  type Kostprijs,
  type Marge,
  allergenenVan,
  berekenKostprijs,
  berekenMarge,
  geldendePrijs,
} from '#domain'
import {
  type Gerecht,
  type Ingredient,
  type IngredientPrijsRecord,
  type Keuken,
  type ReceptRegelRecord,
  keukenSchema,
} from '#shared/schemas'
import seed from '~~/data/seed.json'

/**
 * Lokale modus: alles staat in localStorage tot de Supabase-koppeling er is.
 * De vorm is gelijk aan de databasetabellen, zodat overzetten een kwestie van
 * mappen is.
 */
const OPSLAGSLEUTEL = 'menuggest:keuken'

function startdata(): Keuken {
  return keukenSchema.parse(seed)
}

function laad(): Keuken {
  try {
    const ruw = localStorage.getItem(OPSLAGSLEUTEL)
    if (ruw) {
      const resultaat = keukenSchema.safeParse(JSON.parse(ruw))
      if (resultaat.success) return resultaat.data
      console.warn('Opgeslagen keukendata is ongeldig; startdata geladen.', resultaat.error)
    }
  }
  catch (fout) {
    console.warn('Kon keukendata niet lezen; startdata geladen.', fout)
  }
  return startdata()
}

export interface GerechtAnalyse {
  kostprijs: Kostprijs
  marge: Marge
}

export const useKeukenStore = defineStore('keuken', () => {
  const staat = ref<Keuken>(laad())
  const peildatum = ref(vandaag())

  watch(staat, (nieuw) => {
    try {
      localStorage.setItem(OPSLAGSLEUTEL, JSON.stringify(nieuw))
    }
    catch (fout) {
      console.warn('Kon keukendata niet opslaan.', fout)
    }
  }, { deep: true })

  const ingredienten = computed(() => staat.value.ingredienten)
  const gerechten = computed(() => staat.value.gerechten)
  const prijzen = computed(() => staat.value.prijzen)

  const ingredientOpId = computed(() => new Map(staat.value.ingredienten.map(i => [i.id, i])))
  const categorieen = computed(() => [...new Set(staat.value.ingredienten.map(i => i.categorie))].sort((a, b) => a.localeCompare(b, 'nl')))

  const regelsPerGerecht = computed(() => {
    const map = new Map<string, ReceptRegelRecord[]>()
    for (const regel of staat.value.receptRegels) {
      const lijst = map.get(regel.gerechtId) ?? []
      lijst.push(regel)
      map.set(regel.gerechtId, lijst)
    }
    for (const lijst of map.values()) lijst.sort((a, b) => a.volgorde - b.volgorde)
    return map
  })

  function huidigePrijs(ingredientId: string) {
    return geldendePrijs(staat.value.prijzen, ingredientId, peildatum.value)
  }

  function prijshistorie(ingredientId: string) {
    return staat.value.prijzen
      .filter(p => p.ingredientId === ingredientId)
      .sort((a, b) => b.geldigVanaf.localeCompare(a.geldigVanaf))
  }

  function receptVan(gerechtId: string): ReceptRegelRecord[] {
    return regelsPerGerecht.value.get(gerechtId) ?? []
  }

  const analyses = computed(() => {
    const map = new Map<string, GerechtAnalyse>()
    for (const gerecht of staat.value.gerechten) {
      const kostprijs = berekenKostprijs(receptVan(gerecht.id), huidigePrijs)
      const marge = berekenMarge({
        menuprijsCenten: gerecht.menuprijsCenten,
        btw: gerecht.btw,
        kostprijsCenten: kostprijs.kostprijsCenten,
        peildatum: peildatum.value,
      })
      map.set(gerecht.id, { kostprijs, marge })
    }
    return map
  })

  function allergenenVanGerecht(gerechtId: string) {
    return allergenenVan(receptVan(gerechtId).map(r => r.ingredientId), id => ingredientOpId.value.get(id)?.allergenen)
  }

  // Gerechten

  function nieuwGerecht(gang: Gang): Gerecht {
    const gerecht: Gerecht = {
      id: crypto.randomUUID(),
      naam: 'Nieuw gerecht',
      omschrijving: '',
      gang,
      menuprijsCenten: 0,
      btw: 'laag',
      seizoenen: [],
      labels: [],
      actief: true,
    }
    staat.value.gerechten.push(gerecht)
    return gerecht
  }

  function werkGerechtBij(gerecht: Gerecht) {
    const index = staat.value.gerechten.findIndex(g => g.id === gerecht.id)
    if (index >= 0) staat.value.gerechten[index] = { ...gerecht }
  }

  function verwijderGerecht(id: string) {
    staat.value.gerechten = staat.value.gerechten.filter(g => g.id !== id)
    staat.value.receptRegels = staat.value.receptRegels.filter(r => r.gerechtId !== id)
  }

  // Receptregels

  function voegRegelToe(gerechtId: string, ingredientId: string) {
    const ingredient = ingredientOpId.value.get(ingredientId)
    if (!ingredient) return
    const bestaande = receptVan(gerechtId)
    const eenheid: Eenheid = ingredient.eenheid === 'kg' ? 'g' : ingredient.eenheid === 'l' ? 'ml' : ingredient.eenheid
    staat.value.receptRegels.push({
      id: crypto.randomUUID(),
      gerechtId,
      ingredientId,
      hoeveelheid: eenheid === 'stuk' ? 1 : 100,
      eenheid,
      yieldPct: 100,
      volgorde: bestaande.length ? Math.max(...bestaande.map(r => r.volgorde)) + 1 : 0,
    })
  }

  function werkRegelBij(regel: ReceptRegelRecord) {
    const index = staat.value.receptRegels.findIndex(r => r.id === regel.id)
    if (index >= 0) staat.value.receptRegels[index] = { ...regel }
  }

  function verwijderRegel(id: string) {
    staat.value.receptRegels = staat.value.receptRegels.filter(r => r.id !== id)
  }

  // Ingrediënten en prijzen

  function nieuwIngredient(velden: Omit<Ingredient, 'id'>): Ingredient {
    const ingredient: Ingredient = { id: crypto.randomUUID(), ...velden }
    staat.value.ingredienten.push(ingredient)
    return ingredient
  }

  function werkIngredientBij(ingredient: Ingredient) {
    const index = staat.value.ingredienten.findIndex(i => i.id === ingredient.id)
    if (index >= 0) staat.value.ingredienten[index] = { ...ingredient }
  }

  function naamIsVrij(naam: string, behalveId?: string) {
    const sleutel = naam.trim().toLowerCase()
    return !staat.value.ingredienten.some(i => i.id !== behalveId && i.naam.toLowerCase() === sleutel)
  }

  function isInGebruik(ingredientId: string) {
    return staat.value.receptRegels.some(r => r.ingredientId === ingredientId)
  }

  function verwijderIngredient(id: string) {
    if (isInGebruik(id)) throw new Error('Ingrediënt wordt nog in een recept gebruikt')
    staat.value.ingredienten = staat.value.ingredienten.filter(i => i.id !== id)
    staat.value.prijzen = staat.value.prijzen.filter(p => p.ingredientId !== id)
  }

  function voegPrijsToe(prijs: Omit<IngredientPrijsRecord, 'id'>) {
    staat.value.prijzen.push({ id: crypto.randomUUID(), ...prijs })
  }

  function verwijderPrijs(id: string) {
    staat.value.prijzen = staat.value.prijzen.filter(p => p.id !== id)
  }

  function herstelStartdata() {
    staat.value = startdata()
  }

  return {
    peildatum,
    ingredienten,
    gerechten,
    prijzen,
    ingredientOpId,
    categorieen,
    analyses,
    huidigePrijs,
    prijshistorie,
    receptVan,
    allergenenVanGerecht,
    nieuwGerecht,
    werkGerechtBij,
    verwijderGerecht,
    voegRegelToe,
    werkRegelBij,
    verwijderRegel,
    nieuwIngredient,
    werkIngredientBij,
    naamIsVrij,
    isInGebruik,
    verwijderIngredient,
    voegPrijsToe,
    verwijderPrijs,
    herstelStartdata,
  }
})
