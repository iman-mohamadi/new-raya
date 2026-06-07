<script setup lang="ts">
import { ref, computed, useId } from 'vue'
import { Motion, AnimatePresence } from 'motion-v'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string | number | null
  defaultValue?: string | number | null
  items: any[]
  enableHover?: boolean
  class?: string
  /**
   * Class applied to the animated background element
   */
  itemClass?: string
  transition?: any
  layoutId?: string
}

const props = withDefaults(defineProps<Props>(), {
  enableHover: false,
  items: () => [],
})

const emit = defineEmits(['update:modelValue'])

// Fix: Use Vue's built-in useId() to prevent SSR hydration mismatches
const fallbackId = useId()
const uniqueId = computed(() => props.layoutId || `animated-bg-${fallbackId}`)

// Internal state for hover mode or uncontrolled mode
const internalValue = ref(props.defaultValue ?? null)

const activeId = computed({
  get: () => props.modelValue !== undefined ? props.modelValue : internalValue.value,
  set: (val) => {
    internalValue.value = val
    emit('update:modelValue', val)
  }
})

const handleInteraction = (id: string | number | null) => {
  if (props.enableHover) {
    activeId.value = id
  } else {
    if (id !== null) activeId.value = id
  }
}

// Default spring transition for that high-end cinematic feel
const defaultTransition = {
  type: 'spring',
  bounce: 0.2,
  duration: 0.3
}
</script>

<template>
  <div :class="cn('flex', props.class)">
    <div
        v-for="(item, index) in items"
        :key="item.id || item.value || index"
        :data-id="item.id || item.value || index"
        class="relative inline-flex"
        @click="!enableHover ? handleInteraction(item.id ?? item.value ?? index) : undefined"
        @mouseenter="enableHover ? handleInteraction(item.id ?? item.value ?? index) : undefined"
        @mouseleave="enableHover ? handleInteraction(null) : undefined"
    >
      <AnimatePresence>
        <Motion
            v-if="activeId === (item.id ?? item.value ?? index)"
            :layout-id="uniqueId"
            :class="cn('absolute inset-0 z-0', props.itemClass)"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="transition || defaultTransition"
        >
          <slot name="background">
            <div class="absolute inset-0 h-full w-full rounded-md bg-accent" />
          </slot>
        </Motion>
      </AnimatePresence>

      <div class="relative z-10">
        <slot
            :item="item"
            :index="index"
            :is-active="activeId === (item.id ?? item.value ?? index)"
        />
      </div>
    </div>
  </div>
</template>