<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  /** distance between dot centers in pixels */
  gap?: number
  /** base radius of each dot in CSS px */
  radius?: number
  /** dot color (accepts hex, rgb, or CSS variables like var(--muted-foreground)) */
  dotColor?: string
  /** shadow/glow color for bright dots */
  glowColor?: string
  /** global opacity for the whole layer */
  opacity?: number
  /** background radial fade opacity (0 = transparent background) */
  backgroundOpacity?: number
  /** minimum per-dot speed in rad/s */
  speedMin?: number
  /** maximum per-dot speed in rad/s */
  speedMax?: number
  /** global speed multiplier for all dots */
  speedScale?: number
}

const props = withDefaults(defineProps<Props>(), {
  gap: 12,
  radius: 2,
  dotColor: 'var(--muted-foreground)', // Natively taps into shadcn theme
  glowColor: 'var(--primary)',         // Natively taps into shadcn theme
  opacity: 0.6,
  backgroundOpacity: 0,
  speedMin: 0.4,
  speedMax: 1.3,
  speedScale: 1,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const resolvedDotColor = ref<string>('#ffffff')
const resolvedGlowColor = ref<string>('#ffffff')

// --- State ---
let dots: { x: number; y: number; phase: number; speed: number }[] = []
let rafId = 0
let stopAnimation = false
let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null

// --- Helpers ---

// Canvas API cannot natively read "var(--color)". We must compute it.
const extractColor = (colorStr: string, el: HTMLElement): string => {
  if (colorStr.includes('var(')) {
    const match = colorStr.match(/var\((--[^)]+)\)/)
    if (match) {
      return getComputedStyle(el).getPropertyValue(match[1]).trim()
    }
  }
  return colorStr
}

const updateColors = () => {
  if (!containerRef.value) return
  resolvedDotColor.value = extractColor(props.dotColor, containerRef.value)
  resolvedGlowColor.value = extractColor(props.glowColor, containerRef.value)
}

// Regenerate dot positions. Called on resize or when gap/speed changes.
const regenDots = () => {
  if (!containerRef.value) return

  const { width, height } = containerRef.value.getBoundingClientRect()
  dots = []

  const cols = Math.ceil(width / props.gap) + 2
  const rows = Math.ceil(height / props.gap) + 2
  const min = Math.min(props.speedMin, props.speedMax)
  const max = Math.max(props.speedMin, props.speedMax)

  for (let i = -1; i < cols; i++) {
    for (let j = -1; j < rows; j++) {
      // Offset every other row for a hexagonal/staggered look
      const x = i * props.gap + (j % 2 === 0 ? 0 : props.gap * 0.5)
      const y = j * props.gap
      const phase = Math.random() * Math.PI * 2
      const span = Math.max(max - min, 0)
      const speed = min + Math.random() * span
      dots.push({ x, y, phase, speed })
    }
  }
}

const initCanvas = () => {
  const el = canvasRef.value
  const container = containerRef.value
  if (!el || !container) return

  const ctx = el.getContext('2d')
  if (!ctx) return

  const dpr = Math.max(1, window.devicePixelRatio || 1)

  // Resize handler
  const resize = () => {
    const { width, height } = container.getBoundingClientRect()
    el.width = Math.max(1, Math.floor(width * dpr))
    el.height = Math.max(1, Math.floor(height * dpr))
    el.style.width = `${Math.floor(width)}px`
    el.style.height = `${Math.floor(height)}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    regenDots()
  }

  resizeObserver = new ResizeObserver(() => resize())
  resizeObserver.observe(container)
  resize()

  let last = performance.now()

  const draw = (now: number) => {
    if (stopAnimation) return
    const dt = (now - last) / 1000
    last = now

    if (!el || !container) return
    const { width, height } = el

    ctx.clearRect(0, 0, width, height)
    ctx.globalAlpha = props.opacity

    // Optional background fade
    if (props.backgroundOpacity > 0) {
      const cw = width / dpr
      const ch = height / dpr

      const grad = ctx.createRadialGradient(
        cw * 0.5, ch * 0.4, Math.min(cw, ch) * 0.1,
        cw * 0.5, ch * 0.5, Math.max(cw, ch) * 0.7
      )
      grad.addColorStop(0, 'rgba(0,0,0,0)')
      grad.addColorStop(1, `rgba(0,0,0,${Math.min(Math.max(props.backgroundOpacity, 0), 1)})`)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, cw, ch)
    }

    // Animate dots
    ctx.save()
    ctx.fillStyle = resolvedDotColor.value

    const time = (now / 1000) * Math.max(props.speedScale, 0)

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i]
      const mod = (time * d.speed + d.phase) % 2
      const lin = mod < 1 ? mod : 2 - mod
      const a = 0.25 + 0.55 * lin

      // Only glow if the particle is at peak brightness
      if (a > 0.6) {
        const glow = (a - 0.6) / 0.4
        ctx.shadowColor = resolvedGlowColor.value
        ctx.shadowBlur = 6 * glow
      } else {
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      }

      ctx.globalAlpha = a * props.opacity
      ctx.beginPath()
      ctx.arc(d.x, d.y, props.radius, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
    rafId = requestAnimationFrame(draw)
  }

  rafId = requestAnimationFrame(draw)
}

// --- Watchers ---

watch(
  () => [props.dotColor, props.glowColor],
  updateColors
)

// Re-generate grid when structural props change
watch(
  () => [props.gap, props.speedMin, props.speedMax],
  () => regenDots()
)

// --- Lifecycle ---

onMounted(() => {
  updateColors()
  initCanvas()

  // Watch for Shadcn dark mode toggles to update canvas colors in real-time
  if (typeof window !== 'undefined') {
    mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          updateColors()
        }
      }
    })
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  }
})

onBeforeUnmount(() => {
  stopAnimation = true
  if (typeof window !== 'undefined') cancelAnimationFrame(rafId)
  if (resizeObserver) resizeObserver.disconnect()
  if (mutationObserver) mutationObserver.disconnect()
})
</script>

<template>
  <div
    ref="containerRef"
    :class="cn('absolute inset-0 z-0', props.class)"
  >
    <canvas
      ref="canvasRef"
      class="block h-full w-full"
    />
    <div class="relative z-10 h-full w-full">
      <slot />
    </div>
  </div>
</template>