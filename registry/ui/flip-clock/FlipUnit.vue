<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

const flipUnitVariants = cva(
  "relative subpixel-antialiased perspective-[1000px] rounded-md overflow-hidden",
  {
    variants: {
      size: {
        sm: "w-10 min-w-[40px] h-14 text-3xl",
        md: "w-14 min-w-[56px] h-20 text-5xl",
        lg: "w-[68px] min-w-[68px] h-24 text-6xl", // Fixed non-standard Tailwind class
        xl: "w-[88px] min-w-[88px] h-32 text-8xl"  // Fixed non-standard Tailwind class
      },
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background text-foreground",
        muted: "bg-muted text-muted-foreground"
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
)

interface Props {
  digit: string | number
  size?: VariantProps<typeof flipUnitVariants>['size']
  variant?: VariantProps<typeof flipUnitVariants>['variant']
  class?: string
}

const props = defineProps<Props>()

const prevDigit = ref(props.digit)
const flipping = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

watch(() => props.digit, (current, previous) => {
  if (current !== previous) {
    flipping.value = true
    
    // Clear previous timeout to prevent animation overlapping/glitching
    if (timeoutId) clearTimeout(timeoutId)
    
    timeoutId = setTimeout(() => {
      flipping.value = false
      prevDigit.value = current
    }, 550) // Slightly less than 600ms keyframe
  }
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})

const commonCardStyle = "absolute inset-x-0 overflow-hidden h-1/2 bg-inherit text-inherit"
</script>

<template>
  <div :class="cn(flipUnitVariants({ size, variant }), props.class)">
    <div :class="cn(commonCardStyle, 'top-0 rounded-t-md')">
      <span class="absolute left-0 right-0 top-0 flex h-[200%] w-full items-center justify-center">
        {{ digit }}
      </span>
    </div>

    <div :class="cn(commonCardStyle, 'translate-y-full rounded-b-md')">
      <span class="absolute -top-[100%] left-0 right-0 flex h-[200%] w-full items-center justify-center">
        {{ prevDigit }}
      </span>
    </div>

    <div
      :class="cn(
        commonCardStyle,
        'backface-hidden z-20 origin-bottom rounded-t-md',
        flipping && 'animate-flip-top'
      )"
    >
      <span class="absolute left-0 right-0 top-0 flex h-[200%] w-full items-center justify-center">
        {{ prevDigit }}
      </span>
    </div>

    <div
      :class="cn(
        commonCardStyle,
        'backface-hidden z-10 origin-top translate-y-full rounded-b-md',
        flipping && 'animate-flip-bottom'
      )"
      style="transform: rotateX(90deg)"
    >
      <span class="absolute -top-[100%] left-0 right-0 flex h-[200%] w-full items-center justify-center">
        {{ digit }}
      </span>
    </div>

    <div class="absolute left-0 top-1/2 z-30 h-px w-full -translate-y-1/2 bg-background/50"></div>
  </div>
</template>

<style scoped>
.backface-hidden {
  backface-visibility: hidden;
}

.animate-flip-top {
  animation: flip-top-anim 0.6s ease-in forwards;
}

.animate-flip-bottom {
  animation: flip-bottom-anim 0.6s ease-out forwards;
}

@keyframes flip-top-anim {
  0% {
    transform: rotateX(0deg);
    z-index: 30;
  }
  50%, 100% {
    transform: rotateX(-90deg);
    z-index: 10;
  }
}

@keyframes flip-bottom-anim {
  0%, 50% {
    transform: rotateX(90deg);
    z-index: 10;
  }
  100% {
    transform: rotateX(0deg);
    z-index: 30;
  }
}
</style>