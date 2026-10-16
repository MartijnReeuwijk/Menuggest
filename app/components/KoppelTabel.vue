<script setup lang="ts">
import { GANGEN, GANG_LABELS, type Gang, raadGang, stelGerechtVoor } from '#domain'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { TeKoppelenArtikel } from '~/stores/keuken'

const props = defineProps<{ artikelen: TeKoppelenArtikel[] }>()

const keuken = useKeukenStore()

const NEGEREN = '__negeren__'
const zoekterm = ref('')
const alleenOpen = ref(false)

type Status = 'gekoppeld' | 'genegeerd' | 'suggestie' | 'open'

const gerechtNaam = computed(() => new Map(keuken.gerechten.map(g => [g.id, g.naam])))

const suggesties = computed(() => {
  const map = new Map<string, string>()
  for (const artikel of props.artikelen) {
    if (map.has(artikel.sleutel)) continue
    const voorstel = stelGerechtVoor(artikel.artikelnaam, keuken.gerechten)
    if (voorstel) map.set(artikel.sleutel, voorstel.gerechtId)
  }
  return map
})

function status(artikel: TeKoppelenArtikel): Status {
  const koppeling = keuken.koppelingVan(artikel.sleutel)
  if (koppeling) return koppeling.gerechtId ? 'gekoppeld' : 'genegeerd'
  return suggesties.value.has(artikel.sleutel) ? 'suggestie' : 'open'
}

const gerechtItems = computed(() => [
  { label: 'Negeren (geen gerecht)', value: NEGEREN, icon: 'i-lucide-eye-off' },
  ...keuken.gerechten
    .map(g => ({ label: g.naam, value: g.id, suffix: GANG_LABELS[g.gang] }))
    .sort((a, b) => a.label.localeCompare(b.label, 'nl')),
])

function waardeVan(artikel: TeKoppelenArtikel): string | undefined {
  const koppeling = keuken.koppelingVan(artikel.sleutel)
  if (!koppeling) return undefined
  return koppeling.gerechtId ?? NEGEREN
}

function kies(artikel: TeKoppelenArtikel, waarde: string | undefined) {
  if (!waarde) return keuken.verwijderKoppeling(artikel.sleutel)
  keuken.zetKoppeling(artikel.sleutel, artikel.artikelnaam, waarde === NEGEREN ? null : waarde)
}

function accepteer(artikel: TeKoppelenArtikel) {
  const gerechtId = suggesties.value.get(artikel.sleutel)
  if (gerechtId) keuken.zetKoppeling(artikel.sleutel, artikel.artikelnaam, gerechtId)
}

function maakGerecht(artikel: TeKoppelenArtikel, gang: Gang) {
  keuken.maakGerechtVanArtikel(artikel, gang)
}

function nieuwGerechtItems(artikel: TeKoppelenArtikel): DropdownMenuItem[] {
  const geraden = raadGang(artikel.omzetgroep)
  return [...GANGEN]
    .sort((a, b) => Number(b === geraden) - Number(a === geraden))
    .map(gang => ({ label: `Nieuw ${GANG_LABELS[gang].toLowerCase()}`, onSelect: () => maakGerecht(artikel, gang) }))
}

// Groepen

interface Groep {
  naam: string
  gang: Gang | null
  artikelen: TeKoppelenArtikel[]
  open: TeKoppelenArtikel[]
  metSuggestie: TeKoppelenArtikel[]
  omzetExclCenten: number
}

const groepen = computed<Groep[]>(() => {
  const term = zoekterm.value.trim().toLowerCase()
  const map = new Map<string, TeKoppelenArtikel[]>()
  for (const artikel of props.artikelen) {
    const naam = artikel.omzetgroep ?? 'Zonder omzetgroep'
    map.set(naam, [...(map.get(naam) ?? []), artikel])
  }
  return [...map.entries()]
    .map(([naam, artikelen]): Groep => {
      const zichtbaar = artikelen
        .filter(a => !term || a.artikelnaam.toLowerCase().includes(term))
        .filter(a => !alleenOpen.value || ['open', 'suggestie'].includes(status(a)))
        .sort((a, b) => b.omzetExclCenten - a.omzetExclCenten)
      return {
        naam,
        gang: raadGang(naam),
        artikelen: zichtbaar,
        open: artikelen.filter(a => status(a) === 'open'),
        metSuggestie: artikelen.filter(a => status(a) === 'suggestie'),
        omzetExclCenten: artikelen.reduce((som, a) => som + a.omzetExclCenten, 0),
      }
    })
    .filter(g => g.artikelen.length > 0)
    // Keukengroepen eerst, daarna op omzet.
    .sort((a, b) => Number(!!b.gang) - Number(!!a.gang) || b.omzetExclCenten - a.omzetExclCenten)
})

function negeerOpen(groep: Groep) {
  for (const artikel of groep.open) keuken.zetKoppeling(artikel.sleutel, artikel.artikelnaam, null)
}

function maakGerechtenVanOpen(groep: Groep, gang: Gang) {
  // Per naam één gerecht, ook als de naam twee keer in de groep staat.
  const gedaan = new Set<string>()
  for (const artikel of groep.open) {
    if (gedaan.has(artikel.sleutel) || keuken.koppelingVan(artikel.sleutel)) continue
    gedaan.add(artikel.sleutel)
    maakGerecht(artikel, gang)
  }
}

function groepActies(groep: Groep): DropdownMenuItem[][] {
  return [
    [{ label: `Negeer ${groep.open.length} open`, icon: 'i-lucide-eye-off', disabled: !groep.open.length, onSelect: () => negeerOpen(groep) }],
    [...GANGEN]
      .sort((a, b) => Number(b === groep.gang) - Number(a === groep.gang))
      .map(gang => ({
        label: `Maak ${groep.open.length} × ${GANG_LABELS[gang].toLowerCase()}`,
        icon: 'i-lucide-plus',
        disabled: !groep.open.length,
        onSelect: () => maakGerechtenVanOpen(groep, gang),
      })),
  ]
}

function accepteerSuggesties(artikelen: TeKoppelenArtikel[]) {
  for (const artikel of artikelen) accepteer(artikel)
}

// Voortgang

const voortgang = computed(() => {
  const totaal = props.artikelen.length
  const beslist = props.artikelen.filter(a => ['gekoppeld', 'genegeerd'].includes(status(a))).length
  const omzet = props.artikelen.reduce((som, a) => som + a.omzetExclCenten, 0)
  const gekoppeldeOmzet = props.artikelen.filter(a => status(a) === 'gekoppeld').reduce((som, a) => som + a.omzetExclCenten, 0)
  return { totaal, beslist, omzet, gekoppeldeOmzet }
})

const alleSuggesties = computed(() => props.artikelen.filter(a => status(a) === 'suggestie'))

</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div class="min-w-64 flex-1 space-y-1">
        <div class="flex justify-between text-sm">
          <span><strong>{{ voortgang.beslist }}</strong> van {{ voortgang.totaal }} artikelen gekoppeld of genegeerd</span>
          <span class="text-muted">{{ formatEuro(voortgang.gekoppeldeOmzet) }} omzet aan gerechten gekoppeld</span>
        </div>
        <UProgress :model-value="voortgang.beslist" :max="Math.max(voortgang.totaal, 1)" size="sm" />
      </div>
      <UButton
        v-if="alleSuggesties.length"
        :label="`Accepteer ${alleSuggesties.length} suggesties`"
        icon="i-lucide-wand-sparkles"
        variant="soft"
        @click="accepteerSuggesties(alleSuggesties)"
      />
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <UInput v-model="zoekterm" icon="i-lucide-search" placeholder="Zoek artikel…" class="w-64" />
      <USwitch v-model="alleenOpen" label="Alleen open en suggesties" />
    </div>

    <p v-if="groepen.length === 0" class="text-sm text-muted py-6 text-center">
      Niets te tonen.
    </p>

    <details
      v-for="groep in groepen"
      :key="groep.naam"
      class="group border border-default rounded-lg"
      :open="groep.open.length + groep.metSuggestie.length > 0 || !!zoekterm"
    >
      <summary class="flex flex-wrap items-center gap-3 px-4 py-3 cursor-pointer select-none list-none">
        <UIcon name="i-lucide-chevron-right" class="size-4 transition-transform group-open:rotate-90" />
        <span class="font-semibold">{{ groep.naam }}</span>
        <UBadge v-if="groep.gang" color="neutral" variant="subtle" size="sm" :label="GANG_LABELS[groep.gang]" />
        <span class="text-sm text-muted">{{ formatEuro(groep.omzetExclCenten) }}</span>
        <span class="flex-1" />
        <UBadge v-if="groep.open.length" color="warning" variant="outline" size="sm" :label="`${groep.open.length} open`" />
        <UBadge v-if="groep.metSuggestie.length" color="primary" variant="outline" size="sm" :label="`${groep.metSuggestie.length} suggesties`" />
        <UButton
          v-if="groep.metSuggestie.length"
          size="xs"
          variant="ghost"
          label="Accepteer"
          @click.prevent="accepteerSuggesties(groep.metSuggestie)"
        />
        <UDropdownMenu :items="groepActies(groep)">
          <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-ellipsis" aria-label="Acties voor deze groep" @click.prevent />
        </UDropdownMenu>
      </summary>

      <div class="overflow-x-auto border-t border-default">
        <table class="w-full min-w-3xl text-sm">
          <thead class="text-left text-muted">
            <tr>
              <th class="px-4 py-2 font-medium">
                Kassa-artikel
              </th>
              <th class="px-2 py-2 font-medium text-right w-20">
                Aantal
              </th>
              <th class="px-2 py-2 font-medium text-right w-28">
                Omzet excl.
              </th>
              <th class="px-2 py-2 font-medium w-72">
                Gerecht
              </th>
              <th class="px-2 py-2 font-medium w-56">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-default">
            <tr v-for="artikel in groep.artikelen" :key="artikel.id">
              <td class="px-4 py-1.5">
                <span class="font-medium">{{ artikel.artikelnaam }}</span>
                <span v-if="artikel.artikelnummers.length" class="ml-2 text-xs text-dimmed">#{{ artikel.artikelnummers.join(', ') }}</span>
              </td>
              <td class="px-2 py-1.5 bedrag">
                {{ formatGetal(artikel.aantal) }}
              </td>
              <td class="px-2 py-1.5 bedrag">
                {{ formatEuro(artikel.omzetExclCenten) }}
              </td>
              <td class="px-2 py-1.5">
                <USelectMenu
                  :model-value="waardeVan(artikel)"
                  :items="gerechtItems"
                  value-key="value"
                  placeholder="Kies gerecht…"
                  :search-input="{ placeholder: 'Zoek gerecht…' }"
                  size="sm"
                  class="w-full"
                  :aria-label="`Gerecht voor ${artikel.artikelnaam}`"
                  @update:model-value="kies(artikel, $event)"
                />
              </td>
              <td class="px-2 py-1.5">
                <div class="flex items-center gap-1.5">
                  <template v-if="status(artikel) === 'gekoppeld'">
                    <UBadge color="primary" variant="subtle" size="sm" icon="i-lucide-link" label="Gekoppeld" />
                  </template>
                  <template v-else-if="status(artikel) === 'genegeerd'">
                    <UBadge color="neutral" variant="subtle" size="sm" icon="i-lucide-eye-off" label="Genegeerd" />
                  </template>
                  <template v-else-if="status(artikel) === 'suggestie'">
                    <UButton
                      size="xs"
                      variant="soft"
                      icon="i-lucide-check"
                      class="max-w-full"
                      :label="gerechtNaam.get(suggesties.get(artikel.sleutel)!)"
                      :aria-label="`Suggestie accepteren: ${gerechtNaam.get(suggesties.get(artikel.sleutel)!)}`"
                      @click="accepteer(artikel)"
                    />
                  </template>
                  <template v-else>
                    <UBadge color="warning" variant="outline" size="sm" label="Open" />
                    <UDropdownMenu :items="nieuwGerechtItems(artikel)">
                      <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-plus" label="Gerecht" />
                    </UDropdownMenu>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>
