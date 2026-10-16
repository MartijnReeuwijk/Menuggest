<script setup lang="ts">
useHead({ title: 'Verkoop · Menuggest' })

const keuken = useKeukenStore()
const toast = useToast()

const importRijen = computed(() => keuken.imports.map((kassaImport) => {
  const regels = keuken.regelsVanImport(kassaImport.id)
  const open = regels.filter(r => !keuken.koppelingVan(r.sleutel)).length
  return {
    kassaImport,
    artikelen: regels.length,
    open,
    aantal: regels.reduce((som, r) => som + r.aantal, 0),
    omzetExclCenten: regels.reduce((som, r) => som + r.omzetExclCenten, 0),
  }
}))

const teVerwijderen = ref<string | null>(null)
const verwijderOpen = computed({
  get: () => teVerwijderen.value !== null,
  set: (open: boolean) => {
    if (!open) teVerwijderen.value = null
  },
})

function verwijder() {
  if (!teVerwijderen.value) return
  keuken.verwijderImport(teVerwijderen.value)
  teVerwijderen.value = null
  toast.add({ title: 'Import verwijderd', description: 'De koppelingen blijven onthouden.', icon: 'i-lucide-trash-2' })
}
</script>

<template>
  <UContainer class="py-8 space-y-8">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">
          Verkoop
        </h1>
        <p class="text-muted text-sm mt-1">
          Kassa-exports per periode, en welk kassa-artikel bij welk gerecht hoort.
        </p>
      </div>
      <UButton icon="i-lucide-file-up" label="Kassa-export importeren" to="/verkoop/import" />
    </div>

    <UEmpty
      v-if="importRijen.length === 0"
      icon="i-lucide-receipt"
      title="Nog geen verkoopdata"
      description="Importeer een artikelexport van de kassa. Daarna zie je per gerecht hoe vaak het verkocht is."
      :actions="[{ label: 'Kassa-export importeren', to: '/verkoop/import', icon: 'i-lucide-file-up' }]"
    />

    <template v-else>
      <section class="space-y-2">
        <h2 class="text-lg font-semibold">
          Imports
        </h2>
        <div class="overflow-x-auto border border-default rounded-lg">
          <table class="w-full min-w-2xl text-sm">
            <thead class="text-left text-muted border-b border-default">
              <tr>
                <th class="px-4 py-2 font-medium">
                  Periode
                </th>
                <th class="px-4 py-2 font-medium">
                  Locatie
                </th>
                <th class="px-4 py-2 font-medium">
                  Bestand
                </th>
                <th class="px-4 py-2 font-medium text-right">
                  Stuks
                </th>
                <th class="px-4 py-2 font-medium text-right">
                  Omzet excl.
                </th>
                <th class="px-4 py-2 font-medium">
                  Koppeling
                </th>
                <th class="w-10" />
              </tr>
            </thead>
            <tbody class="divide-y divide-default">
              <tr v-for="rij in importRijen" :key="rij.kassaImport.id">
                <td class="px-4 py-2 whitespace-nowrap">
                  {{ formatDatum(rij.kassaImport.periodeVan) }} t/m {{ formatDatum(rij.kassaImport.periodeTot) }}
                </td>
                <td class="px-4 py-2">
                  {{ rij.kassaImport.locatie ?? '—' }}
                </td>
                <td class="px-4 py-2 text-muted">
                  {{ rij.kassaImport.bestandsnaam }}
                </td>
                <td class="px-4 py-2 bedrag">
                  {{ formatGetal(rij.aantal) }}
                </td>
                <td class="px-4 py-2 bedrag">
                  {{ formatEuro(rij.omzetExclCenten) }}
                </td>
                <td class="px-4 py-2">
                  <UBadge v-if="rij.open" color="warning" variant="outline" :label="`${rij.open} van ${rij.artikelen} open`" />
                  <UBadge v-else color="primary" variant="subtle" icon="i-lucide-check" label="Alles gekoppeld" />
                </td>
                <td class="pr-2">
                  <UButton
                    icon="i-lucide-trash-2"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    aria-label="Import verwijderen"
                    @click="teVerwijderen = rij.kassaImport.id"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="space-y-3">
        <div>
          <h2 class="text-lg font-semibold">
            Koppelingen
          </h2>
          <p class="text-sm text-muted">
            Alle kassa-artikelen uit alle imports. Een wijziging geldt meteen voor elke periode.
          </p>
        </div>
        <KoppelTabel :artikelen="keuken.kassaArtikelen" />
      </section>
    </template>

    <UModal v-model:open="verwijderOpen" title="Import verwijderen?" description="De verkoopregels van deze periode verdwijnen. Koppelingen blijven onthouden.">
      <template #footer="{ close }">
        <div class="flex justify-end gap-2 w-full">
          <UButton label="Annuleren" color="neutral" variant="ghost" @click="close" />
          <UButton label="Verwijderen" color="error" @click="verwijder" />
        </div>
      </template>
    </UModal>
  </UContainer>
</template>
