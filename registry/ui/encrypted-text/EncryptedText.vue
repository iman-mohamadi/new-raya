<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  /** The final text to reveal */
  text: string
  /** Speed of the reveal in milliseconds per character */
  revealDelayMs?: number
  /** Characters used for the encrypted gibberish */
  charset?: string
  /** Speed of the gibberish character flipping */
  flipDelayMs?: number
  class?: string
  /** Class applied to unrevealed/scrambled characters */
  encryptedClass?: string
  /** Class applied to revealed characters */
  revealedClass?: string
}>(), {
  revealDelayMs: 50,
  charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?",
  flipDelayMs: 50,
  encryptedClass: 'text-muted-foreground opacity-70',
  revealedClass: 'text-foreground font-medium'
})

const containerRef = ref<HTMLElement | null>(null)
const isVisible = useElementVisibility(containerRef)
const hasStarted = ref(false)

const revealCount = ref(0)
const scrambleChars = ref<string[]>([])
let animationFrameId: number | null = null

// Helper to generate a random char
function generateRandomCharacter(charset: string): string {
  const index = Math.floor(Math.random() * charset.length)
  return charset.charAt(index)
}

// Helper to create initial gibberish preserving spaces
function generateGibberish(original: string, charset: string): string[] {
  return original.split('').map(char =>
    char === ' ' ? ' ' : generateRandomCharacter(charset)
  )
}

const startAnimation = () => {
  if (typeof window === 'undefined') return

  revealCount.value = 0
  scrambleChars.value = generateGibberish(props.text, props.charset)

  const startTime = performance.now()
  let lastFlipTime = startTime

  const update = (now: number) => {
    const elapsed = now - startTime
    const totalLength = props.text.length

    // 1. Calculate how many characters should be revealed by now
    const currentReveal = Math.floor(elapsed / Math.max(1, props.revealDelayMs))
    revealCount.value = Math.min(totalLength, currentReveal)

    // 2. Check if animation is complete
    if (revealCount.value >= totalLength) {
      return
    }

    // 3. Flip unrevealed characters
    if (now - lastFlipTime >= props.flipDelayMs) {
      scrambleChars.value = scrambleChars.value.map((char, index) => {
        if (index < revealCount.value) return props.text[index] 
        if (props.text[index] === ' ') return ' ' 
        return generateRandomCharacter(props.charset)
      })
      lastFlipTime = now
    }

    animationFrameId = requestAnimationFrame(update)
  }

  animationFrameId = requestAnimationFrame(update)
}

// Watch for visibility to start (once: true behavior)
watch(isVisible, (visible) => {
  if (visible && !hasStarted.value) {
    hasStarted.value = true
    startAnimation()
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined' && animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})

// Prepare the display characters for the template
const characters = computed(() => {
  return props.text.split('').map((char, index) => {
    const isRevealed = index < revealCount.value
    return {
      char: isRevealed ? char : (scrambleChars.value[index] || char),
      isRevealed
    }
  })
})
</script>

<template>
  <span
    ref="containerRef"
    :class="cn('inline-block whitespace-pre-wrap', props.class)"
    :aria-label="text"
    role="text"
  >
    <span
      v-for="(item, index) in characters"
      :key="index"
      :class="cn(
        'transition-colors duration-100',
        item.isRevealed ? revealedClass : encryptedClass
      )"
    >{{ item.char }}</span>
  </span>
</template>