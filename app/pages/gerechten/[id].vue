<script setup lang="ts">
import {
  BTW_CATEGORIEEN,
  GANGEN,
  GANG_LABELS,
  type RegelProbleem,
  btwBasispunten,
  verenigbareEenheden,
} from '#domain'
import { type Gerecht, type ReceptRegelRecord, gerechtSchema } from '#shared/schemas'

const route = useRoute()
const keuken = useKeukenStore()
const toast = useToast()

const id = computed(() => String(route.params.id))
const opgeslagen = computed(() => keuken.gerechten.find(g => g.id === id.value))

// Bewerk een kopie; sla op zodra die geldig is.
const formulier = ref<Gerecht | null>(opgeslagen.value ? structuredClone(toRaw(opgeslagen.value)) : null)
watch(formulier, (waarde) => {
  if (waarde && gerechtSchema.safeParse(waarde).success) keuken.werkGerechtBij(waarde)
}, { deep: true })

useHead({ title: () => `${formulier.value?.naam ?? 'Gerecht'} · Menuggest` })

const analyse = computed(() => keuken.analyses.get(id.value))
const regels = computed(() => keuken.receptVan(id.value))
const allergenen = computed(() => keuken.allergenenVanGerecht(id.value))

const gangItems = GANGEN.map(gang => ({ label: GANG_LABELS[gang], value: gang }))
const btwItems = computed(() => BTW_CATEGORIEEN.map(categorie => ({
  label: `${categorie === 'laag' ? 'Laag' : categorie === 'hoog' ? 'Hoog' : 'Nul'} (${btwBasispunten(categorie, keuken.peildatum) / 100}%)`,
  value: categorie,
})))

const ingredientItems = computed(() => keuken.ingredienten
  .map(i => ({ label: i.naam, value: i.id, suffix: i.categorie }))
  .sort((a, b) => a.label.localeCompare(b.label, 'nl')))

const teToevoegen = ref<string | undefined>()
watch(teToevoegen, (ingredientId) => {
  if (!ingredientId) return
  keuken.voegRegelToe(id.value, ingredientId)
  nextTick(() => {
    teToevoegen.value = undefined
  })
})

function eenheidItems(regel: ReceptRegelRecord) {
  const ingredient = keuken.ingredientOpId.get(regel.ingredientId)
  return ingredient ? verenigbareEenheden(ingredient.eenheid) : [regel.eenheid]
}

function werkBij<K extends keyof ReceptRegelRecord>(regel: ReceptRegelRecord, veld: K, waarde: ReceptRegelRecord[K] | null | undefined) {
  if (waarde === null || waarde === undefined) return
  keuken.werkRegelBij({ ...regel, [veld]: waarde })
}

const PROBLEMEN: Record<RegelProbleem, string> = {
  geen_prijs: 'Geen inkoopprijs',
  eenheid_onverenigbaar: 'Eenheid past niet bij de prijs',
  ongeldige_yield: 'Yield moet tussen 0 en 100% liggen',
}

function regelKosten(regelIndex: number) {
  return analyse.value?.kostprijs.regels[regelIndex]
}

const bevestigVerwijderen = ref(false)
async function verwijder() {
  const naam = formulier.value?.naam
  keuken.verwijderGerecht(id.value)
  toast.add({ title: `${naam} verwijderd`, icon: 'i-lucide-trash-2' })
  await navigateTo('/gerechten')
}
</script>

<template>
  <UContainer class="py-8">
    <UEmpty
      v-if="!formulier || !analyse"
      icon="i-lucide-search-x"
      title="Gerecht niet gevonden"
      :actions="[{ label: 'Naar gerechten', to: '/gerechten' }]"
    />

    <div v-else class="space-y-6">
      <UBreadcrumb :items="[{ label: 'Gerechten', to: '/gerechten' }, { label: formulier.naam }]" />

      <div class="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div class="space-y-6 min-w-0">
          <UCard>
            <UForm :schema="gerechtSchema" :state="formulier" class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Naam" name="naam" class="sm:col-span-2">
                <UInput v-model="formulier.naam" class="w-full" size="xl" />
              </UFormField>
              <UFormField label="Omschrijving op de kaart" name="omschrijving" class="sm:col-span-2">
                <UTextarea v-model="formulier.omschrijving" class="w-full" :rows="2" autoresize />
              </UFormField>
              <UFormField label="Gang" name="gang">
                <USelect v-model="formulier.gang" :items="gangItems" class="w-full" />
              </UFormField>
              <UFormField label="Menuprijs (incl. btw)" name="menuprijsCenten">
                <EuroInput v-model="formulier.menuprijsCenten" class="w-full" />
              </UFormField>
              <UFormField label="Btw-tarief" name="btw" help="Eten en alcoholvrij: laag. Alcohol: hoog.">
                <USelect v-model="formulier.btw" :items="btwItems" class="w-full" />
              </UFormField>
              <UFormField label="Op de kaart" name="actief">
                <USwitch v-model="formulier.actief" :label="formulier.actief ? 'Actief' : 'Niet actief'" />
              </UFormField>
            </UForm>
          </UCard>

          <UCard :ui="{ body: 'p-0 sm:p-0' }">
            <template #header>
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 class="font-semibold">
                    Recept per portie
                  </h2>
                  <p class="text-sm text-muted">
                    Netto hoeveelheid op het bord. Yield = wat er na schoonmaken en garen overblijft.
                  </p>
                </div>
                <USelectMenu
                  v-model="teToevoegen"
                  :items="ingredientItems"
                  value-key="value"
                  placeholder="Ingrediënt toevoegen…"
                  icon="i-lucide-plus"
                  :search-input="{ placeholder: 'Zoek ingrediënt…' }"
                  virtualize
                  class="w-64"
                />
              </div>
            </template>

            <div v-if="regels.length === 0" class="p-6 text-center text-sm text-muted">
              Nog geen ingrediënten. Kies er hierboven één om te beginnen.
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="text-left text-muted border-b border-default">
                  <tr>
                    <th class="px-4 py-2 font-medium">
                      Ingrediënt
                    </th>
                    <th class="px-2 py-2 font-medium">
                      Hoeveelheid
                    </th>
                    <th class="px-2 py-2 font-medium">
                      Yield
                    </th>
                    <th class="px-2 py-2 font-medium text-right">
                      Kosten
                    </th>
                    <th class="w-10" />
                  </tr>
                </thead>
                <tbody class="divide-y divide-default">
                  <tr v-for="(regel, index) in regels" :key="regel.id">
                    <td class="px-4 py-2">
                      <div class="font-medium">
                        {{ keuken.ingredientOpId.get(regel.ingredientId)?.naam ?? 'Onbekend' }}
                      </div>
                      <div v-if="regelKosten(index)?.probleem" class="mt-1">
                        <UBadge
                          color="warning"
                          variant="subtle"
                          size="sm"
                          icon="i-lucide-triangle-alert"
                          :label="PROBLEMEN[regelKosten(index)!.probleem!]"
                        />
                        <ULink
                          v-if="regelKosten(index)?.probleem !== 'ongeldige_yield'"
                          :to="`/ingredienten?id=${regel.ingredientId}`"
                          class="ml-2 text-xs text-primary"
                        >
                          Prijs invoeren
                        </ULink>
                      </div>
                    </td>
                    <td class="px-2 py-2">
                      <UFieldGroup>
                        <UInputNumber
                          :model-value="regel.hoeveelheid"
                          locale="nl-NL"
                          :min="0.001"
                          :step="regel.eenheid === 'stuk' ? 0.5 : 10"
                          :step-snapping="false"
                          :format-options="{ maximumFractionDigits: 3 }"
                          class="w-28"
                          :aria-label="`Hoeveelheid ${keuken.ingredientOpId.get(regel.ingredientId)?.naam}`"
                          @update:model-value="werkBij(regel, 'hoeveelheid', $event)"
                        />
                        <USelect
                          :model-value="regel.eenheid"
                          :items="eenheidItems(regel)"
                          class="w-20"
                          aria-label="Eenheid"
                          @update:model-value="werkBij(regel, 'eenheid', $event)"
                        />
                      </UFieldGroup>
                    </td>
                    <td class="px-2 py-2">
                      <UInputNumber
                        :model-value="regel.yieldPct"
                        locale="nl-NL"
                        :min="1"
                        :max="100"
                        :step="5"
                        :step-snapping="false"
                        :format-options="{ style: 'unit', unit: 'percent', maximumFractionDigits: 1 }"
                        class="w-28"
                        aria-label="Yield in procent"
                        @update:model-value="werkBij(regel, 'yieldPct', $event)"
                      />
                    </td>
                    <td class="px-2 py-2 bedrag">
                      <template v-if="regelKosten(index)?.kostenCenten != null">
                        {{ formatEuro(Math.round(regelKosten(index)!.kostenCenten!)) }}
                      </template>
                      <span v-else class="text-dimmed">—</span>
                    </td>
                    <td class="pr-2">
                      <UButton
                        icon="i-lucide-x"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                        aria-label="Regel verwijderen"
                        @click="keuken.verwijderRegel(regel.id)"
                      />
                    </td>
                  </tr>
                </tbody>
                <tfoot class="border-t border-default font-semibold">
                  <tr>
                    <td class="px-4 py-2" colspan="3">
                      Kostprijs
                    </td>
                    <td class="px-2 py-2 bedrag">
                      {{ formatEuro(analyse.kostprijs.kostprijsCenten) }}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </UCard>
        </div>

        <aside class="space-y-6">
          <MargeOverzicht :analyse="analyse" />

          <UCard>
            <template #header>
              <h2 class="font-semibold">
                Allergenen
              </h2>
            </template>
            <div v-if="allergenen.length" class="flex flex-wrap gap-1.5">
              <UBadge v-for="allergeen in allergenen" :key="allergeen" color="neutral" variant="outline" :label="allergeen" />
            </div>
            <p v-else class="text-sm text-muted">
              Geen bekend uit de ingrediënten. Controleer of de allergenen per ingrediënt zijn ingevuld.
            </p>
          </UCard>

          <UModal v-model:open="bevestigVerwijderen" title="Gerecht verwijderen?" :description="`${formulier.naam} en het recept worden verwijderd.`">
            <UButton label="Gerecht verwijderen" color="neutral" variant="outline" icon="i-lucide-trash-2" block />
            <template #footer="{ close }">
              <div class="flex justify-end gap-2 w-full">
                <UButton label="Annuleren" color="neutral" variant="ghost" @click="close" />
                <UButton label="Verwijderen" color="error" @click="verwijder" />
              </div>
            </template>
          </UModal>
        </aside>
      </div>
    </div>
  </UContainer>
</template>
