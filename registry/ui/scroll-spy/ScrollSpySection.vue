<script setup lang="ts">
import { inject, ref, onMounted, onBeforeUnmount, type ComputedRef } from 'vue'
import { Primitive } from 'reka-ui'

const props = defineProps({
  value: { type: String, required: true },
  asChild: { type: Boolean, default: false },
  as: { type: String, default: 'div' },
  class: { type: String, default: '' }
})

const context = inject<{
  registerSection: (id: string, el: HTMLElement) => void,
  unregisterSection: (id: string) => void,
  orientation: ComputedRef<string>
}>('scroll-spy')

if (!context) throw new Error('ScrollSpySection must be used within ScrollSpy')

const elementRef = ref<any>(null)

onMounted(() => {
  if (elementRef.value && typeof window !== 'undefined') {
    const el = elementRef.value.$el || elementRef.value
    if (el instanceof HTMLElement) {
      context.registerSection(props.value, el)
    }
  }
})

onBeforeUnmount(() => {
  context.unregisterSection(props.value)
})
</script>

<template>
  <Primitive
      ref="elementRef"
      :as="as"
      :as-child="asChild"
      :id="value"
      :data-orientation="context.orientation.value"
      :class="props.class"
  >
    <slot />
  </Primitive>
</template>