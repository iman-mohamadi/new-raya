<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive, watch } from "vue"
import { cn } from "@/lib/utils"

type Snowflake = {
  x: number
  y: number
  size: number
  alpha: number
  dx: number // Horizontal drift
  dy: number // Vertical fall speed
}

type Props = {
  /** Accepts any valid CSS color (Hex, RGB, HSL, or var(--css-var)) */
  color?: string
  quantity?: number
  speed?: number
  maxRadius?: number
  minRadius?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: "#ffffff",
  quantity: 100,
  speed: 1,
  maxRadius: 3,
  minRadius: 1,
  class: "",
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasContainerRef = ref<HTMLDivElement | null>(null)
const snowflakes = ref<Snowflake[]>([])
const canvasSize = reactive({ w: 0, h: 0 })
const resolvedColor = ref(props.color)

let rafId: number | null = null
let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null

// Extracts the exact computed color from the wrapper (respects dark/light mode CSS vars)
const updateColor = () => {
  if (!canvasContainerRef.value || typeof window === 'undefined') return

  if (props.color.includes('var(')) {
    const match = props.color.match(/var\((--[^)]+)\)/)
    if (match) {
      resolvedColor.value = getComputedStyle(canvasContainerRef.value).getPropertyValue(match[1]).trim()
      return
    }
  }
  resolvedColor.value = props.color
}

function createSnowflake(): Snowflake {
  const x = Math.random() * canvasSize.w
  const y = Math.random() * canvasSize.h
  const size = Math.random() * (props.maxRadius - props.minRadius) + props.minRadius
  const alpha = Math.random() * 0.5 + 0.5
  const dx = (Math.random() - 0.5) * 0.5
  const dy = Math.random() * 0.25 + props.speed

  return { x, y, size, alpha, dx, dy }
}

function initCanvas() {
  resizeCanvas()
  snowflakes.value = Array.from({ length: props.quantity }, createSnowflake)
}

function resizeCanvas() {
  if (canvasContainerRef.value && canvasRef.value && typeof window !== 'undefined') {
    const rect = canvasContainerRef.value.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvasSize.w = rect.width
    canvasSize.h = rect.height

    canvasRef.value.width = rect.width * dpr
    canvasRef.value.height = rect.height * dpr
    canvasRef.value.style.width = `${rect.width}px`
    canvasRef.value.style.height = `${rect.height}px`

    const ctx = canvasRef.value.getContext("2d")
    if (ctx) ctx.scale(dpr, dpr)
  }
}

function animate() {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext("2d")
  if (!ctx) return

  ctx.clearRect(0, 0, canvasSize.w, canvasSize.h)
  ctx.fillStyle = resolvedColor.value

  snowflakes.value.forEach((snowflake) => {
    // Movement
    snowflake.x += snowflake.dx
    snowflake.y += snowflake.dy

    // Y-Axis Boundary Reset
    if (snowflake.y > canvasSize.h) {
      snowflake.y = -snowflake.size
      snowflake.x = Math.random() * canvasSize.w
    }

    // X-Axis Boundary Wrap (Prevents snowflakes from disappearing off the sides)
    if (snowflake.x > canvasSize.w + snowflake.size) {
      snowflake.x = -snowflake.size
    } else if (snowflake.x < -snowflake.size) {
      snowflake.x = canvasSize.w + snowflake.size
    }

    // Draw
    ctx.globalAlpha = snowflake.alpha
    ctx.beginPath()
    ctx.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2)
    ctx.fill()
  })

  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (typeof window === 'undefined') return

  updateColor()
  initCanvas()
  rafId = requestAnimationFrame(animate)

  // Handle Container Resizing
  if (canvasContainerRef.value) {
    resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(canvasContainerRef.value)
  }

  // Handle dynamic CSS variable theme toggling
  mutationObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        updateColor()
      }
    }
  })
  mutationObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (resizeObserver) resizeObserver.disconnect()
  if (mutationObserver) mutationObserver.disconnect()
})

watch(() => [props.quantity, props.speed, props.maxRadius, props.minRadius], () => {
  initCanvas()
})

watch(() => props.color, updateColor)
</script>

<template>
  <div
      ref="canvasContainerRef"
      :class="cn('pointer-events-none absolute inset-0 overflow-hidden', props.class)"
      aria-hidden="true"
  >
    <canvas ref="canvasRef" class="block h-full w-full"></canvas>
  </div>
</template>