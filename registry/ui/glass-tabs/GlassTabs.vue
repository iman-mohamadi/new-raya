<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { Motion } from 'motion-v'
import { cn } from '@/lib/utils'

export interface GlassTabItem {
  label: string
  icon: any
  color?: string
  value?: string | number
}

interface Props {
  tabs: GlassTabItem[]
  modelValue?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const hovered = ref<number | null>(null)
const containerRef = ref<any>(null)
const tabsRef = ref<any[]>([])

const activeIndex = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const pill = ref({
  left: 0,
  width: 0,
})

function selectTab(index: number) {
  activeIndex.value = index
}

function getHTMLElement(el: any): HTMLElement | null {
  if (!el) return null

  const element = el.$el || el

  return element instanceof HTMLElement ? element : null
}

function updatePill() {
  const container = getHTMLElement(containerRef.value)
  const button = tabsRef.value[activeIndex.value]

  if (!container || !button) return

  const containerRect = container.getBoundingClientRect()
  const buttonRect = button.getBoundingClientRect()

  const isFirst = activeIndex.value === 0
  const isLast = activeIndex.value === props.tabs.length - 1

  const leftInset = isFirst ? 20 : 12
  const rightInset = isLast ? 20 : 12

  pill.value = {
    left: buttonRect.left - containerRect.left - leftInset,
    width: buttonRect.width + leftInset + rightInset,
  }
}

watch(
    () => props.modelValue,
    async () => {
      await nextTick()
      updatePill()
    }
)

watch(
    () => props.tabs,
    async () => {
      await nextTick()
      updatePill()
    },
    { deep: true }
)

onMounted(async () => {
  await nextTick()
  updatePill()

  window.addEventListener('resize', updatePill)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePill)
})
</script>

<template>
  <Motion
      ref="containerRef"
      :initial="{ y: 20, opacity: 0 }"
      :animate="{ y: 0, opacity: 1 }"
      :transition="{
      type: 'spring',
      stiffness: 200,
      damping: 24,
    }"
      :class="
      cn(
        'relative isolate flex items-center justify-around rounded-full px-5 py-2.5',
        props.class
      )
    "
      :style="{
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.11)',
      boxShadow:
        '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)',
    }"
  >
    <!-- Glass blur -->
    <div
        class="pointer-events-none absolute inset-0 -z-10 rounded-full"
        :style="{
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
      }"
    />

    <!-- Moving active background -->
    <Motion
        class="absolute rounded-full"
        :animate="{
        left: pill.left,
        width: pill.width,
      }"
        :transition="{
        type: 'spring',
        stiffness: 350,
        damping: 30,
      }"
        :style="{
        top: '4px',
        bottom: '4px',
        background: 'rgba(255,255,255,0.10)',
        border: '1px solid rgba(255,255,255,0.08)',
      }"
    />

    <button
        v-for="(tab, index) in tabs"
        :key="tab.label"
        :ref="
        el => {
          if (el) tabsRef[index] = el
        }
      "
        type="button"
        class="relative z-10 flex cursor-pointer flex-col items-center gap-[3px] px-3 py-1"
        @click="selectTab(index)"
        @mouseenter="hovered = index"
        @mouseleave="hovered = null"
    >
      <div
          class="relative z-10 flex flex-col items-center gap-px"
          :style="{
          transform:
            index === 0
              ? 'translateX(-4px)'
              : index === tabs.length - 1
                ? 'translateX(4px)'
                : undefined,
        }"
      >
        <Motion
            :animate="{
            scale: activeIndex === index ? 1.15 : 1,
            y: activeIndex === index ? -1 : 0,
          }"
            :transition="{
            type: 'spring',
            stiffness: 400,
            damping: 20,
          }"
        >
          <component
              :is="tab.icon"
              class="size-5 transition-colors duration-200"
              :style="{
              color:
                activeIndex === index
                  ? tab.color
                  : hovered === index
                    ? 'rgba(255,255,255,0.7)'
                    : 'rgba(255,255,255,0.32)',
            }"
          />
        </Motion>

        <span
            class="text-[10px] font-medium transition-colors duration-200"
            :style="{
            color:
              activeIndex === index
                ? tab.color
                : hovered === index
                  ? 'rgba(255,255,255,0.7)'
                  : 'rgba(255,255,255,0.32)',
          }"
        >
          {{ tab.label }}
        </span>
      </div>
    </button>
  </Motion>
</template>