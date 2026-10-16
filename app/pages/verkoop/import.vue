<script setup lang="ts">
import {
  KASSA_VELDEN,
  KASSA_VELD_LABELS,
  KassaImportFout,
  type KassaLezing,
  type KassaVeld,
  type KolomMapping,
  controleerMapping,
  leesTabel,
  leesVerkoop,
  periodesOverlappen,
  raadMapping,
  vindExportdatum,
  vindKopregel,
} from '#domain'
import type { StepperItem } from '@nuxt/ui'
import type { TeKoppelenArtikel } from '~/stores/keuken'

useHead({ title: 'Kassa-import · Menuggest' })

const keuken = useKeukenStore()
const toast = useToast()

const stappen: StepperItem[] = [
  { title: 'Bestand', description: 'Export en periode', icon: 'i-lucide-file-up' },
  { title: 'Kolommen', description: 'Wat staat waar', icon: 'i-lucide-columns-3' },
  { title: 'Koppelen', description: 'Artikel → gerecht', icon: 'i-lucide-link' },
]
const stap = ref(0)

// Stap 1: bestand en periode

const bestand = ref<File | null>(null)
const rijen = ref<string[][]>([])
const leesfout = ref<string | null>(null)
const periodeVan = ref('')
const periodeTot = ref('')
const locatie = ref('')

const kopIndex = ref(-1)
const mapping = ref<KolomMapping>({})
const exportdatum = computed(() => vindExportdatum(rijen.value, kopIndex.value))

watch(bestand, async (nieuw) => {
  rijen.value = []
  leesfout.value = null
  if (!nieuw) return
  try {
    rijen.value = leesTabel(await leesBestandAlsTekst(nieuw))
    kopIndex.value = vindKopregel(rijen.value)
    mapping.value = kopIndex.value >= 0 ? raadMapping(rijen.value[kopIndex.value]!) : {}
  }
  catch (fout) {
    leesfout.value = fout instanceof KassaImportFout ? fout.message : 'Kan dit bestand niet lezen'
  }
})

const periodeFout = computed(() => {
  if (!periodeVan.value || !periodeTot.value) return 'Vul de periode in die de export beslaat'
  if (periodeTot.value < periodeVan.value) return 'De einddatum ligt voor de begindatum'
  return null
})

const overlappend = computed(() => {
  if (periodeFout.value) return []
  const periode = { van: periodeVan.value, tot: periodeTot.value }
  const plek = locatie.value.trim() || null
  return keuken.imports.filter(i => i.locatie === plek && periodesOverlappen(periode, { van: i.periodeVan, tot: i.periodeTot }))
})

const stap1Klaar = computed(() => rijen.value.length > 0 && !leesfout.value && !periodeFout.value)

// Stap 2: kolommen

const kop = computed(() => (kopIndex.value >= 0 ? rijen.value[kopIndex.value] ?? [] : []))

const GEEN = -1
const kolomItems = computed(() => [
  { label: '— niet gebruiken —', value: GEEN },
  ...kop.value.map((naam, index) => ({ label: naam || `Kolom ${index + 1}`, value: index })),
])

function kolomVan(veld: KassaVeld): number {
  return mapping.value[veld] ?? GEEN
}

function zetKolom(veld: KassaVeld, kolom: number) {
  const nieuw = { ...mapping.value }
  if (kolom === GEEN) delete nieuw[veld]
  else nieuw[veld] = kolom
  mapping.value = nieuw
}

/** Kopregel handmatig kiezen, 1-gebaseerd zoals in een spreadsheet. */
const kopregelNummer = computed({
  get: () => kopIndex.value + 1,
  set: (nummer: number | null | undefined) => {
    const index = Math.min(Math.max((nummer ?? 1) - 1, 0), Math.max(rijen.value.length - 1, 0))
    kopIndex.value = index
    mapping.value = raadMapping(rijen.value[index] ?? [])
  },
})

const mappingProblemen = computed(() => controleerMapping(mapping.value))

const lezing = computed<KassaLezing | null>(() => {
  if (kopIndex.value < 0 || mappingProblemen.value.length) return null
  try {
    return leesVerkoop(rijen.value, kopIndex.value, mapping.value)
  }
  catch {
    return null
  }
})

const voorbeeld = computed(() => lezing.value?.artikelen.slice(0, 6) ?? [])

const totaalControle = computed(() => {
  const l = lezing.value
  if (!l?.totaalregel) return null
  const aantalKlopt = l.totaalregel.aantal === null || l.totaalregel.aantal === l.totaal.aantal
  const omzetKlopt = l.totaalregel.omzetExclCenten === null || l.totaalregel.omzetExclCenten === l.totaal.omzetExclCenten
  return { klopt: aantalKlopt && omzetKlopt, ...l.totaalregel }
})

const stap2Klaar = computed(() => !!lezing.value && lezing.value.artikelen.length > 0)

// Stap 3: koppelen en opslaan

const teKoppelen = computed<TeKoppelenArtikel[]>(() => lezing.value?.artikelen ?? [])

async function importeer() {
  if (!lezing.value || !bestand.value || periodeFout.value) return
  const kassaImport = keuken.slaImportOp({
    bestandsnaam: bestand.value.name,
    periodeVan: periodeVan.value,
    periodeTot: periodeTot.value,
    locatie: locatie.value.trim() || null,
  }, lezing.value.artikelen)
  toast.add({
    title: 'Import opgeslagen',
    description: `${lezing.value.artikelen.length} artikelen, ${formatDatum(kassaImport.periodeVan)} t/m ${formatDatum(kassaImport.periodeTot)}`,
    icon: 'i-lucide-check',
  })
  await navigateTo('/verkoop')
}
</script>

<template>
  <UContainer class="py-8 space-y-6">
    <UBreadcrumb :items="[{ label: 'Verkoop', to: '/verkoop' }, { label: 'Kassa-import' }]" />

    <UStepper v-model="stap" :items="stappen" disabled class="max-w-3xl" />

    <!-- Stap 1 -->
    <UCard v-if="stap === 0">
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-3">
          <UFileUpload
            v-model="bestand"
            accept=".csv,.txt,.json,text/csv,application/json"
            label="Sleep de kassa-export hierheen"
            description="CSV of JSON. Metaregels boven de kolomkoppen zijn geen probleem."
            icon="i-lucide-file-spreadsheet"
            layout="list"
            class="w-full min-h-48"
          />
          <UAlert v-if="leesfout" color="error" variant="subtle" icon="i-lucide-circle-x" :title="leesfout" />
          <p v-else-if="rijen.length" class="text-sm text-muted">
            {{ kopIndex >= 0 ? `${rijen.length} regels gelezen, kolomkoppen op regel ${kopIndex + 1}.` : `${rijen.length} regels gelezen.` }}
          </p>
        </div>

        <div class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField label="Periode van" required>
              <UInput v-model="periodeVan" type="date" class="w-full" />
            </UFormField>
            <UFormField label="Periode tot en met" required>
              <UInput v-model="periodeTot" type="date" class="w-full" :min="periodeVan || undefined" />
            </UFormField>
          </div>
          <p class="text-sm" :class="periodeFout && (periodeVan || periodeTot) ? 'text-warning' : 'text-muted'">
            {{ periodeFout ?? 'De periode staat niet in de export; die bepaal je zelf.' }}
            <template v-if="exportdatum">
              De export is gemaakt op {{ formatDatum(exportdatum) }}.
            </template>
          </p>
          <UFormField label="Locatie" help="Optioneel; handig bij meer vestigingen.">
            <UInput v-model="locatie" placeholder="Bijv. Meierij" class="w-full" />
          </UFormField>
          <UAlert
            v-if="overlappend.length"
            color="warning"
            variant="subtle"
            icon="i-lucide-copy"
            title="Er is al een import voor deze periode"
            :description="overlappend.map(i => `${i.bestandsnaam} (${formatDatum(i.periodeVan)} t/m ${formatDatum(i.periodeTot)})`).join(', ') + '. Dubbel importeren telt de verkoop dubbel.'"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton label="Verder" trailing-icon="i-lucide-arrow-right" :disabled="!stap1Klaar" @click="stap = 1" />
        </div>
      </template>
    </UCard>

    <!-- Stap 2 -->
    <UCard v-else-if="stap === 1">
      <div class="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <div class="space-y-3">
          <UFormField label="Kolomkoppen op regel" help="Automatisch gevonden; pas aan als het niet klopt.">
            <UInputNumber v-model="kopregelNummer" :min="1" :max="rijen.length" class="w-32" />
          </UFormField>
          <USeparator />
          <UFormField
            v-for="veld in KASSA_VELDEN"
            :key="veld"
            :label="KASSA_VELD_LABELS[veld]"
            :error="mappingProblemen.find(p => p.veld === veld)?.probleem"
          >
            <USelect
              :model-value="kolomVan(veld)"
              :items="kolomItems"
              class="w-full"
              @update:model-value="zetKolom(veld, $event as number)"
            />
          </UFormField>
        </div>

        <div class="space-y-4 min-w-0">
          <template v-if="lezing">
            <div class="flex flex-wrap gap-2">
              <UBadge color="neutral" variant="subtle" :label="`${lezing.gelezenRegels} regels gelezen`" />
              <UBadge color="neutral" variant="subtle" :label="`${lezing.artikelen.length} artikelen`" />
              <UBadge color="neutral" variant="subtle" :label="`${formatGetal(lezing.totaal.aantal)} stuks`" />
              <UBadge color="neutral" variant="subtle" :label="`${formatEuro(lezing.totaal.omzetExclCenten)} excl. btw`" />
            </div>

            <UAlert
              v-if="totaalControle?.klopt"
              color="primary"
              variant="subtle"
              icon="i-lucide-check-check"
              title="Klopt met de totaalregel van de kassa"
              description="Aantal en omzet tellen op tot hetzelfde totaal als de export zelf."
            />
            <UAlert
              v-else-if="totaalControle"
              color="warning"
              variant="subtle"
              icon="i-lucide-triangle-alert"
              title="Wijkt af van de totaalregel van de kassa"
              :description="`Kassa: ${totaalControle.aantal ?? '?'} stuks, ${totaalControle.omzetExclCenten === null ? '?' : formatEuro(totaalControle.omzetExclCenten)}. Gelezen: ${lezing.totaal.aantal} stuks, ${formatEuro(lezing.totaal.omzetExclCenten)}. Controleer de kolommen en de overgeslagen regels.`"
            />

            <div class="overflow-x-auto border border-default rounded-lg">
              <table class="w-full text-sm">
                <thead class="text-left text-muted border-b border-default">
                  <tr>
                    <th class="px-3 py-2 font-medium">
                      Artikel
                    </th>
                    <th class="px-3 py-2 font-medium">
                      Omzetgroep
                    </th>
                    <th class="px-3 py-2 font-medium text-right">
                      Aantal
                    </th>
                    <th class="px-3 py-2 font-medium text-right">
                      Omzet excl.
                    </th>
                    <th class="px-3 py-2 font-medium text-right">
                      Prijs incl.
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-default">
                  <tr v-for="artikel in voorbeeld" :key="artikel.id">
                    <td class="px-3 py-1.5">
                      {{ artikel.artikelnaam }}
                    </td>
                    <td class="px-3 py-1.5 text-muted">
                      {{ artikel.omzetgroep ?? '—' }}
                    </td>
                    <td class="px-3 py-1.5 bedrag">
                      {{ formatGetal(artikel.aantal) }}
                    </td>
                    <td class="px-3 py-1.5 bedrag">
                      {{ formatEuro(artikel.omzetExclCenten) }}
                    </td>
                    <td class="px-3 py-1.5 bedrag">
                      {{ artikel.gangbarePrijsInclCenten === null ? '—' : formatEuro(artikel.gangbarePrijsInclCenten) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <UCollapsible v-if="lezing.overgeslagen.length">
              <UButton
                color="neutral"
                variant="ghost"
                size="sm"
                trailing-icon="i-lucide-chevron-down"
                :label="`${lezing.overgeslagen.length} regels overgeslagen`"
              />
              <template #content>
                <ul class="mt-2 text-sm space-y-1">
                  <li v-for="regel in lezing.overgeslagen" :key="regel.regel">
                    <span class="text-muted">Regel {{ regel.regel }}:</span> {{ regel.reden }}
                    <span class="text-dimmed truncate"> — {{ regel.inhoud }}</span>
                  </li>
                </ul>
              </template>
            </UCollapsible>
          </template>

          <UAlert
            v-else-if="kopIndex < 0"
            color="warning"
            variant="subtle"
            icon="i-lucide-search-x"
            title="Geen kolomkoppen gevonden"
            description="Geef links aan op welke regel de kolomnamen staan."
          />
          <p v-else class="text-sm text-muted">
            Koppel links de verplichte kolommen.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <UButton label="Terug" color="neutral" variant="ghost" icon="i-lucide-arrow-left" @click="stap = 0" />
          <UButton label="Verder" trailing-icon="i-lucide-arrow-right" :disabled="!stap2Klaar" @click="stap = 2" />
        </div>
      </template>
    </UCard>

    <!-- Stap 3 -->
    <template v-else>
      <UAlert
        color="neutral"
        variant="subtle"
        icon="i-lucide-brain"
        title="Koppelingen worden onthouden"
        description="Wat je hier kiest, geldt voor elke volgende import en ook voor eerdere imports. Je kunt ook later verder koppelen; open artikelen worden wel opgeslagen."
      />
      <KoppelTabel :artikelen="teKoppelen" />
      <div class="flex justify-between">
        <UButton label="Terug" color="neutral" variant="ghost" icon="i-lucide-arrow-left" @click="stap = 1" />
        <UButton label="Import opslaan" icon="i-lucide-save" @click="importeer" />
      </div>
    </template>
  </UContainer>
</template>
