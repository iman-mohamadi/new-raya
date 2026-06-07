<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, type Component } from 'vue'

const props = defineProps<{
  mouseX: number
  title: string
  icon: Component
  href: string
}>()

const elRef = ref<HTMLElement | null>(null)
const bounds = ref({ x: 0, width: 0 })
const hover = ref(false)

// 1. Efficiently get bounds
const updateBounds = () => {
  if (elRef.value && typeof window !== 'undefined') {
    const rect = elRef.value.getBoundingClientRect()
    bounds.value = {
      x: rect.left + window.scrollX,
      width: rect.width
    }
  }
}

onMounted(() => {
  updateBounds()
  window.addEventListener('resize', updateBounds)
  window.addEventListener('scroll', updateBounds)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateBounds)
    window.removeEventListener('scroll', updateBounds)
  }
})

// 2. Calculate Target Dimensions
const baseWidth = 40
const distanceLimit = 150
const distanceInput = computed(() => {
  if (props.mouseX === Infinity) return Infinity
  return props.mouseX - (bounds.value.x + bounds.value.width / 2)
})

const targetWidth = computed(() => {
  const distance = distanceInput.value
  if (Math.abs(distance) > distanceLimit) return baseWidth

  const percent = (1 - Math.abs(distance) / distanceLimit)
  const eased = percent * percent // Ease in-outish

  return baseWidth + (40 * percent) // 40px base + up to 40px growth
})

// 3. Stable Spring Physics (Mass-Spring-Damper)
const width = ref(baseWidth)
let velocity = 0

const mass = 1
const stiffness = 150
const damping = 15

let rafId: number | null = null
let lastTime = 0

const animate = (time: number) => {
  if (!lastTime) lastTime = time
  const dt = Math.min((time - lastTime) / 1000, 0.1)
  lastTime = time

  const current = width.value
  const target = targetWidth.value

  const springForce = -stiffness * (current - target)
  const dampingForce = -damping * velocity
  const acceleration = (springForce + dampingForce) / mass

  velocity += acceleration * dt
  width.value += velocity * dt

  if (width.value < baseWidth) width.value = baseWidth
  if (width.value > 150) width.value = 150

  if (Math.abs(velocity) < 0.05 && Math.abs(current - target) < 0.05) {
    width.value = target
    velocity = 0
    rafId = null
    lastTime = 0
  } else {
    rafId = requestAnimationFrame(animate)
  }
}

watch(targetWidth, () => {
  if (rafId === null && typeof window !== 'undefined') {
    lastTime = 0
    rafId = requestAnimationFrame(animate)
  }
})

// Styles
const widthPx = computed(() => `${width.value.toFixed(2)}px`)
const iconScale = computed(() => {
  const ratio = (width.value - baseWidth) / 40
  return 1 + (ratio * 0.5) // Scale from 1.0 to 1.5
})
</script>

<template>
  <a :href="href" class="group relative">
    <div
      ref="elRef"
      class="relative flex aspect-square cursor-pointer items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80 will-change-[width,height,transform]"
      :style="{ width: widthPx, height: widthPx }"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="hover"
          class="absolute -top-10 left-1/2 z-50 w-fit -translate-x-1/2 whitespace-pre rounded-md border border-border bg-popover px-2 py-0.5 text-xs text-popover-foreground shadow-sm"
        >
          {{ title }}
        </div>
      </Transition>

      <div
        class="flex items-center justify-center will-change-transform"
        :style="{ transform: `scale(${iconScale})` }"
      >
        <component :is="icon" class="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  </a>
</template>