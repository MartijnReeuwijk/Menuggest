<script setup lang="ts">
import { nl } from '@nuxt/ui/locale'
import type { NavigationMenuItem } from '@nuxt/ui'

const links: NavigationMenuItem[] = [
  { label: 'Gerechten', to: '/gerechten', icon: 'i-lucide-utensils' },
  { label: 'Ingrediënten', to: '/ingredienten', icon: 'i-lucide-carrot' },
  { label: 'Verkoop', to: '/verkoop', icon: 'i-lucide-receipt' },
]
</script>

<template>
  <UApp :locale="nl">
    <UHeader title="Menuggest" to="/gerechten">
      <UNavigationMenu :items="links" />

      <template #right>
        <UColorModeButton />
      </template>

      <template #body>
        <UNavigationMenu :items="links" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
