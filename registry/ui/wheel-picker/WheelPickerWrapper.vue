<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <div
      :class="cn(
      'relative flex w-full items-stretch justify-between overflow-hidden select-none',
      '[perspective:2000px]',
      $props.class
    )"
  >
    <slot />
  </div>
</template>