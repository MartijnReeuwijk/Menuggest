<script setup lang="ts">
/** Invoer in euro's, model in hele centen. */
const centen = defineModel<number>({ required: true })

const euro = computed({
  get: () => centen.value / 100,
  set: (waarde: number | null | undefined) => {
    centen.value = Math.round((waarde ?? 0) * 100)
  },
})
</script>

<template>
  <UInputNumber
    v-model="euro"
    locale="nl-NL"
    :format-options="{ style: 'currency', currency: 'EUR' }"
    :min="0"
    :step="0.5"
    :step-snapping="false"
  />
</template>
