<script setup lang="ts">
import { GANGEN, GANG_LABELS, type Gang } from '#domain'
import type { TableColumn } from '@nuxt/ui'

useHead({ title: 'Gerechten · Menuggest' })

const keuken = useKeukenStore()

interface Rij {
  id: string
  naam: string
  menuprijs: number
  kostprijs: number
  contributie: number
  foodCost: number | null
  aantalRegels: number
  volledig: boolean
}

const columns: TableColumn<Rij>[] = [
  { accessorKey: 'naam', header: 'Gerecht' },
  { accessorKey: 'menuprijs', header: 'Menuprijs', meta: { class: { th: 'text-right w-32', td: 'bedrag' } } },
  { accessorKey: 'kostprijs', header: 'Kostprijs', meta: { class: { th: 'text-right w-32', td: 'bedrag' } } },
  { accessorKey: 'contributie', header: 'Contributie', meta: { class: { th: 'text-right w-32', td: 'bedrag' } } },
  { accessorKey: 'foodCost', header: 'Food cost', meta: { class: { th: 'text-right w-28', td: 'bedrag' } } },
  { id: 'status', header: 'Status', meta: { class: { th: 'w-40' } } },
]

const perGang = computed(() => GANGEN.map(gang => ({
  gang,
  rijen: keuken.gerechten
    .filter(g => g.gang === gang)
    .map((g): Rij => {
      const analyse = keuken.analyses.get(g.id)!
      return {
        id: g.id,
        naam: g.naam,
        menuprijs: g.menuprijsCenten,
        kostprijs: analyse.kostprijs.kostprijsCenten,
        contributie: analyse.marge.contributieCenten,
        foodCost: analyse.marge.foodCostPct,
        aantalRegels: analyse.kostprijs.regels.length,
        volledig: analyse.kostprijs.volledig,
      }
    })
    .sort((a, b) => a.naam.localeCompare(b.naam, 'nl')),
})).filter(groep => groep.rijen.length > 0))

const metRecept = computed(() => keuken.gerechten.filter((g) => {
  const analyse = keuken.analyses.get(g.id)!
  return analyse.kostprijs.regels.length > 0 && analyse.kostprijs.volledig
}).length)

async function maakGerecht(gang: Gang) {
  const gerecht = keuken.nieuwGerecht(gang)
  await navigateTo(`/gerechten/${gerecht.id}`)
}

const nieuwItems = GANGEN.map(gang => ({ label: GANG_LABELS[gang], onSelect: () => maakGerecht(gang) }))

function openRij(_: Event, rij: { original: Rij }) {
  navigateTo(`/gerechten/${rij.original.id}`)
}
</script>

<template>
  <UContainer class="py-8 space-y-8">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">
          Gerechten
        </h1>
        <p class="text-muted text-sm mt-1">
          {{ metRecept }} van {{ keuken.gerechten.length }} gerechten hebben een volledig berekende kostprijs.
        </p>
      </div>
      <UDropdownMenu :items="nieuwItems">
        <UButton icon="i-lucide-plus" label="Nieuw gerecht" />
      </UDropdownMenu>
    </div>

    <section v-for="groep in perGang" :key="groep.gang" class="space-y-2">
      <h2 class="text-lg font-semibold">
        {{ GANG_LABELS[groep.gang] }}
      </h2>
      <UTable
        :data="groep.rijen"
        :columns="columns"
        class="border border-default rounded-lg"
        :ui="{ base: 'w-full min-w-2xl table-fixed', tr: 'cursor-pointer' }"
        @select="openRij"
      >
        <template #naam-cell="{ row }">
          <NuxtLink :to="`/gerechten/${row.original.id}`" class="font-medium hover:underline">
            {{ row.original.naam }}
          </NuxtLink>
        </template>
        <template #menuprijs-cell="{ row }">
          {{ formatEuro(row.original.menuprijs) }}
        </template>
        <template #kostprijs-cell="{ row }">
          <span v-if="row.original.aantalRegels === 0" class="text-dimmed">—</span>
          <span v-else><span v-if="!row.original.volledig">≥ </span>{{ formatEuro(row.original.kostprijs) }}</span>
        </template>
        <template #contributie-cell="{ row }">
          <span v-if="row.original.aantalRegels === 0" class="text-dimmed">—</span>
          <span v-else><span v-if="!row.original.volledig">≤ </span>{{ formatEuro(row.original.contributie) }}</span>
        </template>
        <template #foodCost-cell="{ row }">
          <span v-if="row.original.aantalRegels === 0" class="text-dimmed">—</span>
          <span v-else><span v-if="!row.original.volledig">≥ </span>{{ formatPct(row.original.foodCost) }}</span>
        </template>
        <template #status-cell="{ row }">
          <UBadge v-if="row.original.aantalRegels === 0" color="neutral" variant="subtle" icon="i-lucide-circle-dashed" label="Geen recept" />
          <UBadge v-else-if="!row.original.volledig" color="warning" variant="subtle" icon="i-lucide-triangle-alert" label="Onvolledig" />
          <UBadge v-else-if="row.original.contributie < 0" color="warning" variant="solid" icon="i-lucide-trending-down" label="Verlies" />
          <UBadge v-else color="primary" variant="subtle" icon="i-lucide-check" label="Berekend" />
        </template>
      </UTable>
    </section>
  </UContainer>
</template>
