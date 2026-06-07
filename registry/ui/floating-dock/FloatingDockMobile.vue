<script setup lang="ts">
import { ref } from 'vue'
import { LayoutGrid } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { DockItem } from './FloatingDock.vue'

const props = defineProps<{
  items: DockItem[]
  class?: string
}>()

const open = ref(false)
</script>

<template>
  <div :class="cn('relative block md:hidden', props.class)">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="open" class="absolute bottom-full inset-x-0 mb-4 flex flex-col items-center gap-2">
        <a
          v-for="item in items"
          :key="item.title"
          :href="item.href"
          class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-accent"
        >
          <component :is="item.icon" class="h-4 w-4 text-muted-foreground" />
        </a>
      </div>
    </Transition>

    <button
      @click="open = !open"
      class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
    >
      <LayoutGrid class="h-5 w-5 text-muted-foreground" />
    </button>
  </div>
</template>