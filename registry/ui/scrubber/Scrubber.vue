<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  decimals?: number
  defaultValue?: number
  label?: string
  max?: number
  min?: number
  step?: number
  ticks?: number
  modelValue?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Value',
  defaultValue: 0,
  min: 0,
  max: 1,
  step: 0.01,
  decimals: 2,
  ticks: 9
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
  (e: 'slideBegin', value: number): void
  (e: 'slideEnd', value: number): void
}>()

const trackRef = ref<HTMLDivElement | null>(null)
const internalValue = ref(props.defaultValue)
const isDragging = ref(false)
const isHovering = ref(false)
const isHoverDevice = ref(false)

const value = computed(() => props.modelValue ?? internalValue.value)
const range = computed(() => props.max - props.min)
const percentage = computed(() => range.value > 0 ? ((value.value - props.min) / range.value) * 100 : 0)
const isActive = computed(() => isDragging.value || (isHoverDevice.value && isHovering.value))

let mq: MediaQueryList | null = null
const updateHoverDevice = (e: MediaQueryListEvent | MediaQueryList) => {
  isHoverDevice.value = e.matches
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    updateHoverDevice(mq)
    mq.addEventListener("change", updateHoverDevice)
  }
})

onUnmounted(() => {
  if (mq) mq.removeEventListener("change", updateHoverDevice)
})

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)
const roundToStep = (val: number, step: number, min: number) => Math.round((val - min) / step) * step + min

const setValue = (newValue: number) => {
  const clamped = clamp(roundToStep(newValue, props.step, props.min), props.min, props.max)
  if (props.modelValue === undefined) internalValue.value = clamped
  if (clamped !== value.value) {
    emit('update:modelValue', clamped)
    emit('change', clamped)
  }
}

const getValueFromPointer = (clientX: number) => {
  if (!trackRef.value) return value.value
  const rect = trackRef.value.getBoundingClientRect()
  const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
  return props.min + ratio * range.value
}

const handlePointerDown = (e: PointerEvent) => {
  e.preventDefault()
  if (trackRef.value) {
    trackRef.value.setPointerCapture(e.pointerId)
  }
  isDragging.value = true
  emit('slideBegin', value.value)
  setValue(getValueFromPointer(e.clientX))
}

const handlePointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return
  setValue(getValueFromPointer(e.clientX))
}

const handlePointerUp = (e: PointerEvent) => {
  if (isDragging.value) {
    if (trackRef.value && trackRef.value.hasPointerCapture(e.pointerId)) {
      trackRef.value.releasePointerCapture(e.pointerId)
    }
    isDragging.value = false
    emit('slideEnd', value.value)
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault()
    setValue(value.value + props.step)
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault()
    setValue(value.value - props.step)
  } else if (e.key === 'Home') {
    e.preventDefault()
    setValue(props.min)
  } else if (e.key === 'End') {
    e.preventDefault()
    setValue(props.max)
  }
}
</script>

<template>
  <div :class="cn('relative w-full select-none', props.class)">
    <div
        ref="trackRef"
        role="slider"
        tabindex="0"
        :aria-label="label"
        :aria-valuemax="max"
        :aria-valuemin="min"
        :aria-valuenow="Number(value.toFixed(decimals))"
        :class="cn(
        'relative cursor-pointer overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'h-[52px] touch-none'
      )"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerUp"
        @keydown="handleKeyDown"
    >
      <!-- Fill Track -->
      <div
          class="pointer-events-none absolute inset-y-0 left-0 rounded-xl bg-primary/20"
          :class="!isDragging && 'transition-[width] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]'"
          :style="{ width: `${percentage}%` }"
      />

      <!-- Ticks -->
      <div v-if="ticks > 0" class="pointer-events-none absolute inset-0">
        <div
            v-for="i in ticks"
            :key="i"
            class="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/20"
            :style="{ left: `${(i / (ticks + 1)) * 100}%` }"
        />
      </div>

      <!-- Handle -->
      <div
          class="pointer-events-none absolute top-1/2 z-10 -ml-1.5 -translate-x-1/2 -translate-y-1/2"
          :class="!isDragging && 'transition-[left] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]'"
          :style="{ left: `${percentage}%` }"
      >
        <div
            class="h-[34px] w-[5px] rounded-full bg-foreground transition-all duration-300 ease-out"
            :class="isActive ? 'scale-100 opacity-80' : 'scale-75 opacity-20'"
        />
      </div>

      <!-- Label -->
      <div class="pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2 whitespace-nowrap text-[17px] font-medium text-foreground">
        {{ label }}
      </div>

      <!-- Value -->
      <div class="pointer-events-none absolute right-4 top-1/2 z-20 -translate-y-1/2 font-mono text-[15px] font-medium tabular-nums text-foreground">
        {{ value.toFixed(decimals) }}
      </div>
    </div>
  </div>
</template>