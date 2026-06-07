<script setup lang="ts">
import { ref, computed, type HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
  containerClass?: HTMLAttributes['class']
  /**
   * Glow color following the cursor
   * @default "var(--primary)"
   */
  glowColor?: string
}>(), {
  glowColor: 'var(--primary)' // Natively taps into your oklch theme color
})

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const inputContainerRef = ref<HTMLDivElement | null>(null)
const mouse = ref({ x: 0, y: 0 })
const visible = ref(false)
const radius = 100

// Using backgroundImage allows the gradient to sit on top of the container's background color
const containerBg = computed(() => {
  return `radial-gradient(
    ${visible.value ? radius + 'px' : '0px'} circle at ${mouse.value.x}px ${mouse.value.y}px,
    ${props.glowColor},
    transparent 80%
  )`
})

function handleMouseMove({ clientX, clientY }: MouseEvent) {
  if (!inputContainerRef.value) return
  const { left, top } = inputContainerRef.value.getBoundingClientRect()
  mouse.value = { x: clientX - left, y: clientY - top }
}
</script>

<template>
  <div
      ref="inputContainerRef"
      :class="cn(
      'group/input flex rounded-md p-[1px] transition-colors duration-300',
      'bg-input focus-within:bg-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-0',
      props.containerClass
    )"
      :style="{ backgroundImage: containerBg }"
      @mouseenter="visible = true"
      @mouseleave="visible = false"
      @mousemove="handleMouseMove"
  >
    <input
        v-bind="$attrs"
        v-model="modelValue"
        :class="cn(
        'flex h-10 w-full rounded-[calc(var(--radius)-2px)] bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )"
    />
  </div>
</template>