<script setup lang="ts">
import type { Component } from 'vue'
import FloatingDockDesktop from './FloatingDockDesktop.vue'
import FloatingDockMobile from './FloatingDockMobile.vue'

export interface DockItem {
  title: string
  icon: Component
  href: string
}

defineProps<{
  items: DockItem[]
  desktopClass?: string
  mobileClass?: string
}>()
</script>

<template>
  <FloatingDockDesktop :items="items" :class="desktopClass" />
  <FloatingDockMobile :items="items" :class="mobileClass" />
</template>