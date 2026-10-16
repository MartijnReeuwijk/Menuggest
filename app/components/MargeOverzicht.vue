<script setup lang="ts">
import type { GerechtAnalyse } from '~/stores/keuken'

const props = defineProps<{ analyse: GerechtAnalyse }>()

const ontbrekend = computed(() => props.analyse.kostprijs.regels.filter(r => r.probleem !== null).length)
// Bij een onvolledige kostprijs kennen we alleen grenzen: kosten minstens, marge hoogstens.
const onvolledig = computed(() => !props.analyse.kostprijs.volledig)
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-semibold">
        Marge per portie
      </h2>
    </template>

    <dl class="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
      <dt class="text-muted">
        Menuprijs (incl. btw)
      </dt>
      <dd class="bedrag">
        {{ formatEuro(analyse.marge.menuprijsCenten) }}
      </dd>
      <dt class="text-muted">
        Netto omzet (excl. btw)
      </dt>
      <dd class="bedrag">
        {{ formatEuro(analyse.marge.nettoOmzetCenten) }}
      </dd>
      <dt class="text-muted">
        Kostprijs
      </dt>
      <dd class="bedrag">
        <span v-if="onvolledig" title="minstens">≥ </span><span v-else>− </span>{{ formatEuro(analyse.marge.kostprijsCenten) }}
      </dd>
      <dt class="border-t border-default pt-2 font-semibold">
        Contributiemarge
      </dt>
      <dd class="bedrag border-t border-default pt-2 font-semibold" :class="{ 'text-warning': analyse.marge.contributieCenten < 0 }">
        <span v-if="onvolledig" title="hoogstens">≤ </span>{{ formatEuro(analyse.marge.contributieCenten) }}
      </dd>
      <dt class="text-muted">
        Food cost
      </dt>
      <dd class="bedrag">
        <span v-if="onvolledig" title="minstens">≥ </span>{{ formatPct(analyse.marge.foodCostPct) }}
      </dd>
    </dl>

    <UAlert
      v-if="!analyse.kostprijs.volledig"
      class="mt-4"
      color="warning"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="Kostprijs onvolledig"
      :description="`${ontbrekend} ${ontbrekend === 1 ? 'regel telt' : 'regels tellen'} niet mee. De echte marge is lager dan hier staat.`"
    />
    <UAlert
      v-else-if="analyse.kostprijs.regels.length === 0"
      class="mt-4"
      color="neutral"
      variant="subtle"
      icon="i-lucide-info"
      title="Nog geen recept"
      description="Voeg ingrediënten toe; de kostprijs rekent zich dan uit."
    />
    <UAlert
      v-else-if="analyse.marge.contributieCenten < 0"
      class="mt-4"
      color="warning"
      variant="subtle"
      icon="i-lucide-trending-down"
      title="Verlies per portie"
    />
  </UCard>
</template>
