<script setup lang="ts">
import { computed, type HTMLAttributes, onMounted, onUnmounted, reactive, ref, useId } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  radius?: number
  border?: number
  lightness?: number
  displace?: number
  blend?: string
  xChannel?: "R" | "G" | "B"
  yChannel?: "R" | "G" | "B"
  alpha?: number
  blur?: number
  rOffset?: number
  gOffset?: number
  bOffset?: number
  scale?: number
  frost?: number
  class?: HTMLAttributes["class"]
  containerClass?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
  radius: 16,
  border: 0.07,
  lightness: 50,
  blend: "difference",
  xChannel: "R",
  yChannel: "B",
  alpha: 0.93,
  blur: 11,
  rOffset: 0,
  gOffset: 10,
  bOffset: 20,
  scale: -180,
  frost: 0.05,
})

const liquidGlassRoot = ref<HTMLElement | null>(null)
const dimensions = reactive({ width: 0, height: 0 })
let observer: ResizeObserver | null = null

// Generate a unique ID to prevent SVG filter collisions when multiple components are used
const uid = useId()
const filterId = `liquid-glass-filter-${uid}`

const baseStyle = computed(() => {
  return {
    "--frost": props.frost,
    "borderRadius": `${props.radius}px`,
    "backdropFilter": `url(#${filterId})`,
    "-webkit-backdrop-filter": `url(#${filterId})`,
  }
})

// Computed displacement image (SVG String)
const displacementImage = computed(() => {
  // Prevent division by zero or NaN on initial SSR render
  if (dimensions.width === 0 || dimensions.height === 0) return ''

  const border = Math.min(dimensions.width, dimensions.height) * (props.border * 0.5)
  const yBorder = Math.min(dimensions.width, dimensions.height) * (props.border * 0.5)

  return `
    <svg viewBox="0 0 ${dimensions.width} ${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${dimensions.width}" height="${dimensions.height}" fill="black"></rect>
      <rect x="0" y="0" width="${dimensions.width}" height="${dimensions.height}" rx="${props.radius}" fill="url(#red)" />
      <rect x="0" y="0" width="${dimensions.width}" height="${dimensions.height}" rx="${props.radius}" fill="url(#blue)" style="mix-blend-mode: ${props.blend}" />
      <rect
        x="${border}"
        y="${yBorder}"
        width="${dimensions.width - border * 2}"
        height="${dimensions.height - border * 2}"
        rx="${props.radius}"
        fill="hsl(0 0% ${props.lightness}% / ${props.alpha})"
        style="filter:blur(${props.blur}px)"
      />
    </svg>
  `
})

const displacementDataUri = computed(() => {
  if (!displacementImage.value) return ''
  const encoded = encodeURIComponent(displacementImage.value)
  return `data:image/svg+xml,${encoded}`
})

onMounted(() => {
  if (!liquidGlassRoot.value || typeof window === 'undefined') return

  observer = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (!entry) return

    let width = 0
    let height = 0

    if (entry.borderBoxSize && entry.borderBoxSize?.length) {
      width = entry.borderBoxSize[0]!.inlineSize
      height = entry.borderBoxSize[0]!.blockSize
    } else if (entry.contentRect) {
      width = entry.contentRect.width
      height = entry.contentRect.height
    }

    dimensions.width = width
    dimensions.height = height
  })

  observer.observe(liquidGlassRoot.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="liquidGlassRoot"
    :class="cn(
      'relative block opacity-100 transition-colors',
      'bg-white/10 dark:bg-black/10',
      'shadow-[inset_6px_6px_0px_-6px_rgba(255,255,255,0.7),inset_0_0_8px_1px_rgba(255,255,255,0.7)] dark:shadow-[inset_6px_6px_0px_-6px_rgba(255,255,255,0.1),inset_0_0_8px_1px_rgba(255,255,255,0.1)]',
      props.containerClass
    )"
    :style="baseStyle"
  >
    <div :class="cn('h-full w-full overflow-hidden rounded-[inherit]', props.class)">
      <slot />
    </div>

    <svg
      class="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          :id="filterId"
          color-interpolation-filters="sRGB"
        >
          <feImage
            v-if="displacementDataUri"
            x="0"
            y="0"
            width="100%"
            height="100%"
            :href="displacementDataUri"
            result="map"
          />
          <template v-if="displacementDataUri">
            <feDisplacementMap
              id="redchannel"
              in="SourceGraphic"
              in2="map"
              :xChannelSelector="xChannel"
              :yChannelSelector="yChannel"
              :scale="scale + rOffset"
              result="dispRed"
            />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
              result="red"
            />
            <feDisplacementMap
              id="greenchannel"
              in="SourceGraphic"
              in2="map"
              :xChannelSelector="xChannel"
              :yChannelSelector="yChannel"
              :scale="scale + gOffset"
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"
              result="green"
            />
            <feDisplacementMap
              id="bluechannel"
              in="SourceGraphic"
              in2="map"
              :xChannelSelector="xChannel"
              :yChannelSelector="yChannel"
              :scale="scale + bOffset"
              result="dispBlue"
            />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"
              result="blue"
            />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur :stdDeviation="displace" />
          </template>
        </filter>
      </defs>
    </svg>
  </div>
</template>