<script setup lang="ts">
import { ref, computed } from 'vue'
import { useElementSize } from '@vueuse/core'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  rows?: number
  cols?: number
  cellSize?: number
  interactive?: boolean
  borderColor?: string
  fillColor?: string
  rippleColor?: string
  /**
   * If true, automatically calculates rows and columns to fill the parent container.
   * Ignores 'rows' and 'cols' props.
   */
  fill?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rows: 8,
  cols: 27,
  cellSize: 56,
  interactive: true,
  borderColor: 'var(--border)',
  fillColor: 'transparent',
  rippleColor: 'var(--primary)',
  fill: false,
})

const containerRef = ref<HTMLElement | null>(null)
const { width, height } = useElementSize(containerRef)
const rippleKey = ref(0)
const clickedCell = ref<{ row: number; col: number } | null>(null)

// Calculate grid dimensions safely for SSR
const calculatedCols = computed(() => {
  if (props.fill && width.value > 0) {
    return Math.ceil(width.value / props.cellSize)
  }
  return props.cols
})

const calculatedRows = computed(() => {
  if (props.fill && height.value > 0) {
    return Math.ceil(height.value / props.cellSize)
  }
  return props.rows
})

// Generate the cell array in setup to avoid template re-evaluations
const cells = computed(() => {
  const total = calculatedRows.value * calculatedCols.value
  return Array.from({ length: total }, (_, i) => i)
})

const onCellClick = (row: number, col: number) => {
  if (!props.interactive) return
  clickedCell.value = { row, col }
  rippleKey.value += 1
}

const getCellStyle = (idx: number) => {
  const colCount = calculatedCols.value
  const row = Math.floor(idx / colCount)
  const col = idx % colCount

  if (!clickedCell.value) return {}

  const distance = Math.hypot(
    clickedCell.value.row - row,
    clickedCell.value.col - col
  )

  const delay = distance * 55
  const duration = 200 + distance * 80

  return {
    '--delay': `${delay}ms`,
    '--duration': `${duration}ms`,
  }
}
</script>

<template>
  <div
    ref="containerRef"
    :class="cn('absolute inset-0 h-full w-full', props.class)"
  >
    <div class="relative h-full w-full overflow-hidden">
      <div
        :key="rippleKey"
        :class="cn(
          'relative z-[3] opacity-60',
          'mx-auto grid'
        )"
        style="
          mask-image: radial-gradient(circle at center, black 20%, transparent 100%);
          mask-position: top;
        "
        :style="{
          gridTemplateColumns: `repeat(${calculatedCols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${calculatedRows}, ${cellSize}px)`,
          width: `${calculatedCols * cellSize}px`,
          height: `${calculatedRows * cellSize}px`,
          '--ripple-color': rippleColor
        }"
      >
        <div
          v-for="idx in cells"
          :key="idx"
          :class="cn(
            'relative border-[0.5px] opacity-40 transition-opacity duration-150 will-change-transform',
            'hover:opacity-80 dark:shadow-[0px_0px_40px_1px_rgba(0,0,0,0.2)_inset]',
            clickedCell && 'animate-cell-ripple [animation-fill-mode:none]',
            !interactive && 'pointer-events-none'
          )"
          :style="{
            backgroundColor: fillColor,
            borderColor: borderColor,
            ...getCellStyle(idx)
          }"
          @click="onCellClick(Math.floor(idx / calculatedCols), idx % calculatedCols)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes cell-ripple {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: var(--ripple-color);
    opacity: 0.8;
  }
  100% {
    background-color: transparent;
  }
}

.animate-cell-ripple {
  animation: cell-ripple var(--duration) linear var(--delay) forwards;
}
</style>