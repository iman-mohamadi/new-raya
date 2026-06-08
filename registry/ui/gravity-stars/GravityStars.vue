<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { cn } from '@/lib/utils'

type MouseGravity = 'attract' | 'repel'
type GlowAnimation = 'instant' | 'ease' | 'spring'
type StarsInteractionType = 'bounce' | 'merge'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  baseOpacity: number
  mass: number
  glowMultiplier: number
  glowVelocity: number
}

const props = withDefaults(defineProps<{
  starsCount?: number
  starsSize?: number
  starsOpacity?: number
  glowIntensity?: number
  glowAnimation?: GlowAnimation
  movementSpeed?: number
  mouseInfluence?: number
  mouseGravity?: MouseGravity
  gravityStrength?: number
  starsInteraction?: boolean
  starsInteractionType?: StarsInteractionType
  class?: string
}>(), {
  starsCount: 75,
  starsSize: 2,
  starsOpacity: 0.75,
  glowIntensity: 15,
  glowAnimation: 'ease',
  movementSpeed: 0.3,
  mouseInfluence: 100,
  mouseGravity: 'attract',
  gravityStrength: 75,
  starsInteraction: false,
  starsInteractionType: 'bounce'
})

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const dpr = ref(1)

// Caching the resolved color so we don't recalculate it 60 times a second
const resolvedColor = ref('#ffffff')

// Non-reactive state for physics performance
let animId: number | null = null
const stars: Particle[] = []
const mouse = { x: -9999, y: -9999 }
const canvasSize = { width: 800, height: 600 }
let mutationObserver: MutationObserver | null = null

// Extracts the exact computed color from the wrapper (respects dark/light mode)
const updateColor = () => {
  if (!containerRef.value || typeof window === 'undefined') return
  const cs = window.getComputedStyle(containerRef.value)
  resolvedColor.value = cs.color || '#ffffff'
}

const initStars = (w: number, h: number) => {
  stars.length = 0 // Clear existing
  for (let i = 0; i < props.starsCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = props.movementSpeed * (0.5 + Math.random() * 0.5)
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * props.starsSize + 1,
      opacity: props.starsOpacity,
      baseOpacity: props.starsOpacity,
      mass: Math.random() * 0.5 + 0.5,
      glowMultiplier: 1,
      glowVelocity: 0
    })
  }
}

const redistributeStars = (w: number, h: number) => {
  stars.forEach(p => {
    p.x = Math.random() * w
    p.y = Math.random() * h
  })
}

const resizeCanvas = () => {
  if (!containerRef.value || !canvasRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const nextDpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2))
  dpr.value = nextDpr

  canvasSize.width = rect.width
  canvasSize.height = rect.height

  canvasRef.value.width = Math.max(1, Math.floor(rect.width * nextDpr))
  canvasRef.value.height = Math.max(1, Math.floor(rect.height * nextDpr))
  canvasRef.value.style.width = `${rect.width}px`
  canvasRef.value.style.height = `${rect.height}px`

  if (stars.length === 0) {
    initStars(rect.width, rect.height)
  } else {
    redistributeStars(rect.width, rect.height)
  }
}

const handlePointerMove = (e: MouseEvent | TouchEvent) => {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  let clientX = 0
  let clientY = 0

  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else if ('clientX' in e) {
    clientX = (e as MouseEvent).clientX
    clientY = (e as MouseEvent).clientY
  }

  mouse.x = clientX - rect.left
  mouse.y = clientY - rect.top
}

const handlePointerLeave = () => {
  mouse.x = -9999
  mouse.y = -9999
}

const updateStars = () => {
  const w = canvasSize.width
  const h = canvasSize.height

  for (let i = 0; i < stars.length; i++) {
    const p = stars[i]

    const dx = mouse.x - p.x
    const dy = mouse.y - p.y
    const dist = Math.hypot(dx, dy)

    if (dist < props.mouseInfluence && dist > 0) {
      const force = (props.mouseInfluence - dist) / props.mouseInfluence
      const nx = dx / dist
      const ny = dy / dist
      const g = force * (props.gravityStrength * 0.001)

      if (props.mouseGravity === 'attract') {
        p.vx += nx * g
        p.vy += ny * g
      } else {
        p.vx -= nx * g
        p.vy -= ny * g
      }

      p.opacity = Math.min(1, p.baseOpacity + force * 0.4)
      const targetGlow = 1 + force * 2
      const currentGlow = p.glowMultiplier

      if (props.glowAnimation === 'instant') {
        p.glowMultiplier = targetGlow
      } else if (props.glowAnimation === 'ease') {
        p.glowMultiplier = currentGlow + (targetGlow - currentGlow) * 0.15
      } else {
        const spring = (targetGlow - currentGlow) * 0.2
        p.glowVelocity = p.glowVelocity * 0.85 + spring
        p.glowMultiplier = currentGlow + p.glowVelocity
      }
    } else {
      // Decay / Reset logic
      p.opacity = Math.max(p.baseOpacity * 0.3, p.opacity - 0.02)
      const targetGlow = 1
      const currentGlow = p.glowMultiplier

      if (props.glowAnimation === 'instant') {
        p.glowMultiplier = targetGlow
      } else if (props.glowAnimation === 'ease') {
        p.glowMultiplier = Math.max(1, currentGlow + (targetGlow - currentGlow) * 0.08)
      } else {
        const spring = (targetGlow - currentGlow) * 0.15
        p.glowVelocity = p.glowVelocity * 0.9 + spring
        p.glowMultiplier = Math.max(1, currentGlow + p.glowVelocity)
      }
    }

    if (props.starsInteraction) {
      for (let j = i + 1; j < stars.length; j++) {
        const o = stars[j]
        const dx2 = o.x - p.x
        const dy2 = o.y - p.y
        const d = Math.hypot(dx2, dy2)
        const minD = p.size + o.size + 5

        if (d < minD && d > 0) {
          if (props.starsInteractionType === 'bounce') {
            const nx = dx2 / d
            const ny = dy2 / d
            const rvx = p.vx - o.vx
            const rvy = p.vy - o.vy
            const speed = rvx * nx + rvy * ny

            if (speed >= 0) {
              const impulse = (2 * speed) / (p.mass + o.mass)
              p.vx -= impulse * o.mass * nx
              p.vy -= impulse * o.mass * ny
              o.vx += impulse * p.mass * nx
              o.vy += impulse * p.mass * ny

              const overlap = minD - d
              p.x -= nx * overlap * 0.5
              p.y -= ny * overlap * 0.5
              o.x += nx * overlap * 0.5
              o.y += ny * overlap * 0.5
            }
          } else {
            const mergeForce = (minD - d) / minD
            p.glowMultiplier += mergeForce * 0.5
            o.glowMultiplier += mergeForce * 0.5
            const af = mergeForce * 0.01
            p.vx += dx2 * af
            p.vy += dy2 * af
            o.vx -= dx2 * af
            o.vy -= dy2 * af
          }
        }
      }
    }

    p.x += p.vx
    p.y += p.vy

    // Ambient Brownian motion
    p.vx += (Math.random() - 0.5) * 0.001
    p.vy += (Math.random() - 0.5) * 0.001

    // Friction
    p.vx *= 0.999
    p.vy *= 0.999

    // Wrap around
    if (p.x < 0) p.x = w
    if (p.x > w) p.x = 0
    if (p.y < 0) p.y = h
    if (p.y > h) p.y = 0
  }
}

const drawStars = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  
  // Use the cached color instead of triggering getComputedStyle
  const color = resolvedColor.value

  for (const p of stars) {
    ctx.save()
    ctx.shadowColor = color
    ctx.shadowBlur = props.glowIntensity * p.glowMultiplier * 2
    ctx.globalAlpha = p.opacity
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(p.x * dpr.value, p.y * dpr.value, p.size * dpr.value, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

const animate = () => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  updateStars()
  drawStars(ctx)
  animId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (typeof window === 'undefined') return

  updateColor()
  resizeCanvas()
  
  const ro = new ResizeObserver(resizeCanvas)
  if (containerRef.value) ro.observe(containerRef.value)
  window.addEventListener('resize', resizeCanvas)

  // Watch for theme changes on the root element to instantly update star colors
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

  animId = requestAnimationFrame(animate)

  onUnmounted(() => {
    if (animId) cancelAnimationFrame(animId)
    window.removeEventListener('resize', resizeCanvas)
    ro.disconnect()
    if (mutationObserver) mutationObserver.disconnect()
  })
})

watch([
  () => props.starsCount,
  () => props.movementSpeed,
  () => props.starsSize
], () => {
  initStars(canvasSize.width, canvasSize.height)
})
</script>

<template>
  <div
    ref="containerRef"
    :class="cn('relative size-full overflow-hidden text-foreground', props.class)"
    @mousemove="handlePointerMove"
    @touchmove="handlePointerMove"
    @mouseleave="handlePointerLeave"
  >
    <canvas ref="canvasRef" class="block h-full w-full" />
    <div class="pointer-events-none relative z-10 h-full w-full">
      <slot />
    </div>
  </div>
</template>