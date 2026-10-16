<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { ALLERGENEN, EENHEDEN, type Eenheid, dimensieVan } from '#domain'
import type { Ingredient } from '#shared/schemas'

useHead({ title: 'Ingrediënten · Menuggest' })

const keuken = useKeukenStore()
const route = useRoute()
const router = useRouter()

const zoekterm = ref('')
const categorie = ref<string | undefined>()
const alleenMetPrijs = ref(false)

interface Rij {
  id: string
  naam: string
  categorie: string
  eenheid: Eenheid
  prijs: string | null
  perEenheid: string | null
  allergenen: number
}

const rijen = computed<Rij[]>(() => {
  const term = zoekterm.value.trim().toLowerCase()
  return keuken.ingredienten
    .filter(i => !categorie.value || i.categorie === categorie.value)
    .filter(i => !term || i.naam.toLowerCase().includes(term))
    .map((i) => {
      const prijs = keuken.huidigePrijs(i.id)
      return {
        id: i.id,
        naam: i.naam,
        categorie: i.categorie,
        eenheid: i.eenheid,
        prijs: prijs ? `${formatEuro(prijs.prijsCenten)} / ${formatGetal(prijs.verpakkingsgrootte)} ${prijs.eenheid}` : null,
        perEenheid: prijs ? formatPrijsPerEenheid(prijs) : null,
        allergenen: i.allergenen.length,
      }
    })
    .filter(r => !alleenMetPrijs.value || r.prijs)
    .sort((a, b) => a.naam.localeCompare(b.naam, 'nl'))
})

const columns: TableColumn<Rij>[] = [
  { accessorKey: 'naam', header: 'Ingrediënt' },
  { accessorKey: 'categorie', header: 'Categorie' },
  { accessorKey: 'eenheid', header: 'Eenheid' },
  { accessorKey: 'prijs', header: 'Inkoopprijs', meta: { class: { th: 'text-right', td: 'bedrag' } } },
  { accessorKey: 'perEenheid', header: 'Per eenheid', meta: { class: { th: 'text-right', td: 'bedrag' } } },
]

// Het geopende ingrediënt staat in de URL, zodat het recept ernaar kan linken.
const geopendId = computed({
  get: () => (typeof route.query.id === 'string' ? route.query.id : undefined),
  set: (id?: string) => router.replace({ query: { ...route.query, id } }),
})
const geopend = computed(() => (geopendId.value ? keuken.ingredientOpId.get(geopendId.value) : undefined))
const paneelOpen = computed({
  get: () => !!geopend.value,
  set: (open: boolean) => {
    if (!open) geopendId.value = undefined
  },
})

function openRij(_: Event, rij: { original: Rij }) {
  geopendId.value = rij.original.id
}

// Bewerken van het geopende ingrediënt
// Alleen opnieuw kopiëren bij een ander ingrediënt; anders reset elke opslag het formulier.
const bewerk = ref<Ingredient | null>(null)
watch(geopendId, () => {
  bewerk.value = geopend.value ? structuredClone(toRaw(geopend.value)) : null
}, { immediate: true })

const naamFout = computed(() => {
  if (!bewerk.value) return undefined
  if (!bewerk.value.naam.trim()) return 'Geef een naam'
  if (!keuken.naamIsVrij(bewerk.value.naam, bewerk.value.id)) return 'Bestaat al'
  return undefined
})

watch(bewerk, (waarde) => {
  if (waarde && !naamFout.value && waarde.categorie.trim()) keuken.werkIngredientBij({ ...waarde, naam: waarde.naam.trim() })
}, { deep: true })

function zetCategorie(waarde: string) {
  if (bewerk.value) bewerk.value.categorie = waarde
}

const allergeenItems = ALLERGENEN.map(a => ({ label: a, value: a }))

// Nieuwe prijs
const nieuwePrijs = reactive({
  leverancier: '',
  verpakkingsgrootte: 1,
  eenheid: 'kg' as Eenheid,
  prijsCenten: 0,
  geldigVanaf: vandaag(),
})

watch(geopendId, () => {
  const ingredient = geopend.value
  if (!ingredient) return
  const laatste = keuken.prijshistorie(ingredient.id)[0]
  const dimensie = dimensieVan(ingredient.eenheid)
  Object.assign(nieuwePrijs, {
    leverancier: laatste?.leverancier ?? '',
    verpakkingsgrootte: laatste?.verpakkingsgrootte ?? 1,
    eenheid: laatste?.eenheid ?? (dimensie === 'massa' ? 'kg' : dimensie === 'volume' ? 'l' : 'stuk'),
    prijsCenten: 0,
    geldigVanaf: vandaag(),
  })
}, { immediate: true })

const prijsEenheden = computed(() => (bewerk.value ? EENHEDEN.filter(e => dimensieVan(e) === dimensieVan(bewerk.value!.eenheid)) : []))

// Wie de basiseenheid van dimensie verandert, maakt bestaande prijzen onbruikbaar; het domein markeert dat.
const eenheidItems = EENHEDEN.map(e => ({ label: e, value: e }))

function slaPrijsOp() {
  if (!bewerk.value || nieuwePrijs.prijsCenten <= 0 || nieuwePrijs.verpakkingsgrootte <= 0) return
  keuken.voegPrijsToe({
    ingredientId: bewerk.value.id,
    leverancier: nieuwePrijs.leverancier.trim() || null,
    verpakkingsgrootte: nieuwePrijs.verpakkingsgrootte,
    eenheid: nieuwePrijs.eenheid,
    prijsCenten: nieuwePrijs.prijsCenten,
    geldigVanaf: nieuwePrijs.geldigVanaf,
  })
  nieuwePrijs.prijsCenten = 0
}

// Nieuw ingrediënt
const nieuwOpen = ref(false)
const nieuw = reactive({ naam: '', categorie: '', eenheid: 'g' as Eenheid })
const nieuwFout = computed(() => {
  if (!nieuw.naam.trim()) return 'Geef een naam'
  if (!keuken.naamIsVrij(nieuw.naam)) return 'Bestaat al'
  return undefined
})

function maakIngredient() {
  if (nieuwFout.value || !nieuw.categorie.trim()) return
  const ingredient = keuken.nieuwIngredient({ naam: nieuw.naam.trim(), categorie: nieuw.categorie.trim(), eenheid: nieuw.eenheid, allergenen: [], seizoenen: [] })
  nieuwOpen.value = false
  Object.assign(nieuw, { naam: '', categorie: '', eenheid: 'g' })
  geopendId.value = ingredient.id
}

function verwijderGeopend() {
  if (!bewerk.value || keuken.isInGebruik(bewerk.value.id)) return
  const id = bewerk.value.id
  geopendId.value = undefined
  keuken.verwijderIngredient(id)
}
</script>

<template>
  <UContainer class="py-8 space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">
          Ingrediënten
        </h1>
        <p class="text-muted text-sm mt-1">
          {{ keuken.ingredienten.length }} ingrediënten, waarvan {{ keuken.ingredienten.filter(i => keuken.huidigePrijs(i.id)).length }} met een inkoopprijs.
        </p>
      </div>
      <UButton icon="i-lucide-plus" label="Nieuw ingrediënt" @click="nieuwOpen = true" />
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <UInput v-model="zoekterm" icon="i-lucide-search" placeholder="Zoek…" class="w-64" />
      <USelect v-model="categorie" :items="keuken.categorieen" placeholder="Alle categorieën" class="w-56" />
      <UButton v-if="categorie" label="Wis filter" color="neutral" variant="link" @click="categorie = undefined" />
      <UCheckbox v-model="alleenMetPrijs" label="Alleen met prijs" />
    </div>

    <UTable
      :data="rijen"
      :columns="columns"
      class="border border-default rounded-lg max-h-[70vh]"
      sticky
      :ui="{ tr: 'cursor-pointer' }"
      @select="openRij"
    >
      <template #naam-cell="{ row }">
        <span class="font-medium">{{ row.original.naam }}</span>
        <UBadge v-if="row.original.allergenen" class="ml-2" color="neutral" variant="outline" size="sm" :label="`${row.original.allergenen} allergenen`" />
      </template>
      <template #prijs-cell="{ row }">
        <span v-if="row.original.prijs">{{ row.original.prijs }}</span>
        <span v-else class="text-dimmed">geen prijs</span>
      </template>
      <template #perEenheid-cell="{ row }">
        <span v-if="row.original.perEenheid">{{ row.original.perEenheid }}</span>
        <span v-else class="text-dimmed">—</span>
      </template>
    </UTable>

    <USlideover v-model:open="paneelOpen" :title="bewerk?.naam ?? ''" description="Wijzigingen worden direct bewaard.">
      <template #body>
        <div v-if="bewerk" class="space-y-8">
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField label="Naam" :error="naamFout" class="sm:col-span-2">
              <UInput v-model="bewerk.naam" class="w-full" />
            </UFormField>
            <UFormField label="Categorie">
              <UInputMenu v-model="bewerk.categorie" :items="keuken.categorieen" create-item class="w-full" @create="zetCategorie" />
            </UFormField>
            <UFormField label="Basiseenheid" help="Gewicht, volume of per stuk.">
              <USelect v-model="bewerk.eenheid" :items="eenheidItems" class="w-full" />
            </UFormField>
            <UFormField label="Allergenen" class="sm:col-span-2">
              <USelectMenu v-model="bewerk.allergenen" :items="allergeenItems" value-key="value" multiple placeholder="Geen" class="w-full" />
            </UFormField>
          </div>

          <section class="space-y-3">
            <h3 class="font-semibold">
              Nieuwe inkoopprijs
            </h3>
            <div class="grid gap-3 sm:grid-cols-2">
              <UFormField label="Prijs (excl. btw)">
                <EuroInput v-model="nieuwePrijs.prijsCenten" class="w-full" />
              </UFormField>
              <UFormField label="Per verpakking van">
                <UFieldGroup class="w-full">
                  <UInputNumber v-model="nieuwePrijs.verpakkingsgrootte" locale="nl-NL" :min="0.001" :step-snapping="false" :format-options="{ maximumFractionDigits: 3 }" class="flex-1" />
                  <USelect v-model="nieuwePrijs.eenheid" :items="prijsEenheden" class="w-20" />
                </UFieldGroup>
              </UFormField>
              <UFormField label="Leverancier">
                <UInput v-model="nieuwePrijs.leverancier" placeholder="Optioneel" class="w-full" />
              </UFormField>
              <UFormField label="Geldig vanaf">
                <UInput v-model="nieuwePrijs.geldigVanaf" type="date" class="w-full" />
              </UFormField>
            </div>
            <UButton label="Prijs toevoegen" icon="i-lucide-plus" :disabled="nieuwePrijs.prijsCenten <= 0" @click="slaPrijsOp" />
          </section>

          <section class="space-y-2">
            <h3 class="font-semibold">
              Prijshistorie
            </h3>
            <p v-if="keuken.prijshistorie(bewerk.id).length === 0" class="text-sm text-muted">
              Nog geen prijzen. Zonder prijs telt dit ingrediënt niet mee in de kostprijs.
            </p>
            <ul v-else class="divide-y divide-default text-sm">
              <li v-for="prijs in keuken.prijshistorie(bewerk.id)" :key="prijs.id" class="flex items-center gap-3 py-2">
                <div class="flex-1">
                  <div>
                    <span class="bedrag">{{ formatEuro(prijs.prijsCenten) }}</span> per {{ formatGetal(prijs.verpakkingsgrootte) }} {{ prijs.eenheid }}
                    <span class="text-muted">· {{ formatPrijsPerEenheid(prijs) }}</span>
                  </div>
                  <div class="text-xs text-muted">
                    vanaf {{ formatDatum(prijs.geldigVanaf) }}<template v-if="prijs.leverancier">
                      · {{ prijs.leverancier }}
                    </template>
                  </div>
                </div>
                <UBadge v-if="keuken.huidigePrijs(bewerk.id)?.id === prijs.id" label="Geldend" color="primary" variant="subtle" size="sm" />
                <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" aria-label="Prijs verwijderen" @click="keuken.verwijderPrijs(prijs.id)" />
              </li>
            </ul>
          </section>

          <UButton
            label="Ingrediënt verwijderen"
            icon="i-lucide-trash-2"
            color="neutral"
            variant="outline"
            :disabled="keuken.isInGebruik(bewerk.id)"
            @click="verwijderGeopend"
          />
          <p v-if="keuken.isInGebruik(bewerk.id)" class="text-xs text-muted">
            Wordt gebruikt in een recept en kan daarom niet weg.
          </p>
        </div>
      </template>
    </USlideover>

    <UModal v-model:open="nieuwOpen" title="Nieuw ingrediënt">
      <template #body>
        <form class="space-y-4" @submit.prevent="maakIngredient">
          <UFormField label="Naam" :error="nieuw.naam ? nieuwFout : undefined">
            <UInput v-model="nieuw.naam" class="w-full" autofocus />
          </UFormField>
          <UFormField label="Categorie">
            <UInputMenu v-model="nieuw.categorie" :items="keuken.categorieen" create-item class="w-full" @create="(waarde: string) => nieuw.categorie = waarde" />
          </UFormField>
          <UFormField label="Basiseenheid">
            <USelect v-model="nieuw.eenheid" :items="eenheidItems" class="w-full" />
          </UFormField>
          <div class="flex justify-end gap-2">
            <UButton label="Annuleren" color="neutral" variant="ghost" @click="nieuwOpen = false" />
            <UButton type="submit" label="Toevoegen" :disabled="!!nieuwFout || !nieuw.categorie.trim()" />
          </div>
        </form>
      </template>
    </UModal>
  </UContainer>
</template>
