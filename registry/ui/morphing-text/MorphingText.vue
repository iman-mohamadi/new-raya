<script setup lang="ts">
import { ref, onMounted, onUnmounted, useId } from "vue"
import { cn } from "@/lib/utils"

const TEXT_CLASSES = "absolute inset-x-0 top-0 m-auto inline-block w-full"

interface Props {
  class?: string
  texts: string[]
  morphTime?: number
  coolDownTime?: number
}

const props = withDefaults(defineProps<Props>(), {
  morphTime: 1.5,
  coolDownTime: 0.5,
})

// Generate a unique ID to prevent SVG filter collisions when multiple components are used
const uid = useId()
const filterId = `morph-filter-${uid}`

const textIndex = ref(0)
const morph = ref(0)
const coolDown = ref(0)
let lastTime = 0

const text1Ref = ref<HTMLSpanElement>()
const text2Ref = ref<HTMLSpanElement>()

function setStyles(fraction: number) {
  if (!text1Ref.value || !text2Ref.value) return

  text2Ref.value.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
  text2Ref.value.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`

  const invertedFraction = 1 - fraction
  text1Ref.value.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`
  text1Ref.value.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`

  text1Ref.value.textContent = props.texts[textIndex.value % props.texts.length]
  text2Ref.value.textContent = props.texts[(textIndex.value + 1) % props.texts.length]
}

function doMorph() {
  morph.value -= coolDown.value
  coolDown.value = 0

  let fraction = morph.value / props.morphTime

  if (fraction > 1) {
    coolDown.value = props.coolDownTime
    fraction = 1
  }

  setStyles(fraction)

  if (fraction === 1) {
    textIndex.value++
  }
}

function doCoolDown() {
  morph.value = 0

  if (text1Ref.value && text2Ref.value) {
    text2Ref.value.style.filter = "none"
    text2Ref.value.style.opacity = "100%"
    text1Ref.value.style.filter = "none"
    text1Ref.value.style.opacity = "0%"
  }
}

let animationFrameId: number = 0

function animate(time: number) {
  animationFrameId = requestAnimationFrame(animate)

  if (!lastTime) lastTime = time
  const dt = (time - lastTime) / 1000
  lastTime = time

  coolDown.value -= dt

  if (coolDown.value <= 0) {
    doMorph()
  } else {
    doCoolDown()
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  animationFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div
    :class="cn(
      'relative mx-auto h-16 w-full max-w-screen-md text-center font-sans font-bold leading-none text-foreground',
      'text-5xl',
      props.class
    )"
    :style="{ filter: `url(#${filterId}) blur(0.6px)` }"
  >
    <span
      ref="text1Ref"
      :class="cn(TEXT_CLASSES)"
    />
    <span
      ref="text2Ref"
      :class="cn(TEXT_CLASSES)"
    />

    <svg
      class="pointer-events-none fixed size-0"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter :id="filterId">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 255 -140"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>