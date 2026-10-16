import {
  type Eenheid,
  type Gang,
  type KassaArtikel,
  type Kostprijs,
  type Marge,
  allergenenVan,
  berekenKostprijs,
  berekenMarge,
  geldendePrijs,
  verkoopPerGerecht,
} from '#domain'
import {
  type Gerecht,
  type Ingredient,
  type IngredientPrijsRecord,
  type KassaImport,
  type KassaKoppeling,
  type Keuken,
  type ReceptRegelRecord,
  keukenSchema,
  migreerKeuken,
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
      const resultaat = keukenSchema.safeParse(migreerKeuken(JSON.parse(ruw)))
      if (resultaat.success) return resultaat.data
      console.warn('Opgeslagen keukendata is ongeldig; startdata geladen.', resultaat.error)
    }
  }
  catch (fout) {
    console.warn('Kon keukendata niet lezen; startdata geladen.', fout)
  }
  return startdata()
}

/** Een kassa-artikel zoals het koppelscherm het toont: uit een lopende import of uit de opslag. */
export interface TeKoppelenArtikel {
  id: string
  artikelnaam: string
  sleutel: string
  artikelnummers: string[]
  omzetgroep: string | null
  aantal: number
  omzetExclCenten: number
  gangbarePrijsInclCenten: number | null
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
    // Zoals `on delete cascade`: het kassa-artikel is daarna weer open, niet genegeerd.
    staat.value.koppelingen = staat.value.koppelingen.filter(k => k.gerechtId !== id)
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

  // Kassa-import

  const imports = computed(() => [...staat.value.imports].sort((a, b) => b.periodeVan.localeCompare(a.periodeVan)))
  const koppelingOpSleutel = computed(() => new Map(staat.value.koppelingen.map(k => [k.sleutel, k])))

  function koppelingVan(sleutel: string): KassaKoppeling | undefined {
    return koppelingOpSleutel.value.get(sleutel)
  }

  /** gerechtId = null: bewust negeren. */
  function zetKoppeling(sleutel: string, kassaArtikelnaam: string, gerechtId: string | null) {
    const index = staat.value.koppelingen.findIndex(k => k.sleutel === sleutel)
    const koppeling = { sleutel, kassaArtikelnaam, gerechtId }
    if (index >= 0) staat.value.koppelingen[index] = koppeling
    else staat.value.koppelingen.push(koppeling)
  }

  function verwijderKoppeling(sleutel: string) {
    staat.value.koppelingen = staat.value.koppelingen.filter(k => k.sleutel !== sleutel)
  }

  function maakGerechtVanArtikel(artikel: TeKoppelenArtikel, gang: Gang): Gerecht {
    const gerecht = nieuwGerecht(gang)
    gerecht.naam = artikel.artikelnaam
    gerecht.menuprijsCenten = artikel.gangbarePrijsInclCenten ?? 0
    zetKoppeling(artikel.sleutel, artikel.artikelnaam, gerecht.id)
    return gerecht
  }

  function slaImportOp(invoer: Omit<KassaImport, 'id' | 'geimporteerdOp'>, artikelen: readonly KassaArtikel[]): KassaImport {
    const kassaImport: KassaImport = { ...invoer, id: crypto.randomUUID(), geimporteerdOp: new Date().toISOString() }
    staat.value.imports.push(kassaImport)
    for (const artikel of artikelen) {
      staat.value.verkoopregels.push({
        id: crypto.randomUUID(),
        importId: kassaImport.id,
        kassaArtikelnaam: artikel.artikelnaam,
        sleutel: artikel.sleutel,
        kassaArtikelnummers: artikel.artikelnummers,
        omzetgroep: artikel.omzetgroep,
        aantal: artikel.aantal,
        omzetExclCenten: artikel.omzetExclCenten,
        omzetInclCenten: artikel.omzetInclCenten,
        gangbarePrijsInclCenten: artikel.gangbarePrijsInclCenten,
      })
    }
    return kassaImport
  }

  function verwijderImport(id: string) {
    staat.value.imports = staat.value.imports.filter(i => i.id !== id)
    staat.value.verkoopregels = staat.value.verkoopregels.filter(r => r.importId !== id)
  }

  function regelsVanImport(importId: string) {
    return staat.value.verkoopregels.filter(r => r.importId === importId)
  }

  /** Alle kassa-artikelen over alle imports, per omzetgroep en naam opgeteld. */
  const kassaArtikelen = computed<TeKoppelenArtikel[]>(() => {
    const map = new Map<string, TeKoppelenArtikel>()
    for (const regel of staat.value.verkoopregels) {
      const id = `${regel.omzetgroep ?? ''}\u0000${regel.sleutel}`
      const artikel = map.get(id) ?? {
        id,
        artikelnaam: regel.kassaArtikelnaam,
        sleutel: regel.sleutel,
        artikelnummers: [],
        omzetgroep: regel.omzetgroep,
        aantal: 0,
        omzetExclCenten: 0,
        gangbarePrijsInclCenten: regel.gangbarePrijsInclCenten,
      }
      artikel.aantal += regel.aantal
      artikel.omzetExclCenten += regel.omzetExclCenten
      for (const nummer of regel.kassaArtikelnummers) if (!artikel.artikelnummers.includes(nummer)) artikel.artikelnummers.push(nummer)
      map.set(id, artikel)
    }
    return [...map.values()]
  })

  const gerechtVoorSleutel = (sleutel: string) => koppelingOpSleutel.value.get(sleutel)?.gerechtId

  /** Per import: wat is er per gerecht verkocht. */
  const verkoopPerImport = computed(() => new Map(staat.value.imports.map(i => [
    i.id,
    verkoopPerGerecht(regelsVanImport(i.id), gerechtVoorSleutel),
  ])))

  function verkoopVanGerecht(gerechtId: string) {
    return imports.value.flatMap((kassaImport) => {
      const verkocht = verkoopPerImport.value.get(kassaImport.id)?.get(gerechtId)
      return verkocht ? [{ kassaImport, ...verkocht }] : []
    })
  }

  function kassaNamenVanGerecht(gerechtId: string) {
    return staat.value.koppelingen.filter(k => k.gerechtId === gerechtId).map(k => k.kassaArtikelnaam)
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
    imports,
    kassaArtikelen,
    koppelingVan,
    zetKoppeling,
    verwijderKoppeling,
    maakGerechtVanArtikel,
    slaImportOp,
    verwijderImport,
    regelsVanImport,
    verkoopVanGerecht,
    kassaNamenVanGerecht,
    herstelStartdata,
  }
})
