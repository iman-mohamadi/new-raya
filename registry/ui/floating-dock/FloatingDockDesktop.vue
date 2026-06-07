<script setup lang="ts">
import { ref } from 'vue'
import { cn } from '@/lib/utils'
import FloatingDockIcon from './FloatingDockIcon.vue'
import type { DockItem } from './FloatingDock.vue'

const props = defineProps<{
  items: DockItem[]
  class?: string
}>()

const mouseX = ref<number>(Infinity)
</script>

<template>
  <div
    :class="cn(
      'mx-auto hidden h-16 items-end gap-4 rounded-2xl border border-border bg-background px-4 pb-3 shadow-sm md:flex',
      props.class
    )"
    @mousemove="(e) => mouseX = e.pageX"
    @mouseleave="() => mouseX = Infinity"
  >
    <FloatingDockIcon
      v-for="item in items"
      :key="item.title"
      :mouse-x="mouseX"
      :title="item.title"
      :icon="item.icon"
      :href="item.href"
    />
  </div>
</template>