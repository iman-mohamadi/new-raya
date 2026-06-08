<script setup lang="ts">
import { inject, computed, onUnmounted, watch, type HTMLAttributes, useId } from 'vue'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const partitionBarLineVariants = cva("rounded-full w-full shrink-0", {
  variants: {
    variant: {
      default: "bg-primary",
      secondary: "bg-secondary",
      destructive: "bg-destructive",
      outline: "border border-border bg-background",
      muted: "bg-muted"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

const partitionBarTitleVariants = cva("w-full whitespace-normal flex flex-col", {
  variants: {
    variant: {
      default: "text-primary",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
      outline: "text-foreground",
      muted: "text-muted-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

interface Props {
  /** The numeric value this segment represents relative to the others */
  num?: number
  variant?: VariantProps<typeof partitionBarLineVariants>['variant']
  alignment?: "left" | "center" | "right"
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  num: 0,
  variant: "default",
  alignment: "center"
})

// Context Injection
const context = inject<{
  total: { value: number }
  size: { value: 'sm' | 'md' | 'lg' | null | undefined }
  register: (id: string, val: number) => void
  unregister: (id: string) => void
}>('partition-bar-context')

if (!context) {
  throw new Error("PartitionBarSegment must be used within a <PartitionBar>")
}

const { total, size, register, unregister } = context

// Native Vue 3.5+ ID generation for SSR safety without Nuxt dependencies
const id = useId()

// Register value on mount and updates
watch(() => props.num, (newVal) => {
  register(id, newVal)
}, { immediate: true })

onUnmounted(() => {
  unregister(id)
})

const widthPercent = computed(() => {
  return total.value > 0 ? (props.num / total.value) * 100 : 0
})

const heightClass = computed(() => {
  if (size.value === 'sm') return 'h-2'
  if (size.value === 'lg') return 'h-4'
  return 'h-3' // md
})

const marginClass = computed(() => {
  if (size.value === 'sm') return 'mt-2'
  if (size.value === 'lg') return 'mt-4'
  return 'mt-3' // md
})
</script>

<template>
  <li
    class="flex min-w-0 flex-col transition-all duration-500 ease-in-out"
    :style="{
      flexBasis: `${widthPercent}%`,
      flexGrow: 0,
      flexShrink: 0
    }"
  >
    <div
      :class="cn(
        partitionBarLineVariants({ variant }),
        heightClass,
        props.class
      )"
    />

    <div
      :class="cn(
        partitionBarTitleVariants({ variant }),
        marginClass,
        alignment === 'left' && 'items-start',
        alignment === 'center' && 'items-center text-center',
        alignment === 'right' && 'items-end text-right'
      )"
    >
      <slot />
    </div>
  </li>
</template>