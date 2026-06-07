<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, type Component } from 'vue'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'reka-ui'
import { cn } from '@/lib/utils'

export interface TabItem {
  id?: string | number
  label: string
  icon?: Component
  slot?: string
  content?: string
  disabled?: boolean
  value?: string | number
  [key: string]: any
}

interface Props {
  modelValue?: string | number
  items?: TabItem[]
  defaultTab?: string | number
  variant?: 'underline' | 'pill' | 'segment'
  orientation?: 'horizontal' | 'vertical'
  content?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  variant: 'underline',
  orientation: 'horizontal',
  content: true
})

const emit = defineEmits(['update:modelValue', 'change'])

// States
const internalActiveTab = ref<string | number>(props.defaultTab ?? props.items[0]?.id ?? props.items[0]?.value ?? 0)
const tabRefs = ref<HTMLElement[]>([])
const containerRef = ref<HTMLElement | null>(null)

const markerStyle = ref({
  width: '0px',
  height: '0px',
  transform: 'translate(0px, 0px)',
  opacity: 0
})

const selected = computed({
  get() {
    if (props.modelValue !== undefined) return props.modelValue
    return internalActiveTab.value
  },
  set(val) {
    if (props.modelValue !== undefined) {
      emit('update:modelValue', val)
    } else {
      internalActiveTab.value = val
    }
    emit('change', val)
  }
})

const currentNumericIndex = computed(() => {
  if (props.items && props.items.length > 0) {
    const idx = props.items.findIndex((item, i) => {
      const itemVal = item.id ?? item.value ?? i
      return itemVal === selected.value
    })
    return idx !== -1 ? idx : 0
  }
  return 0
})

// Update indicator position using absolute geometric coordinates
const updateMarker = () => {
  const el = tabRefs.value[currentNumericIndex.value]
  if (!el || !containerRef.value) {
    markerStyle.value.opacity = 0
    return
  }

  const left = el.offsetLeft
  const top = el.offsetTop
  const width = el.offsetWidth
  const height = el.offsetHeight

  if (props.variant === 'underline') {
    if (props.orientation === 'vertical') {
      markerStyle.value = {
        width: 'var(--raya-tabs-underline-height, 2px)',
        height: `${height}px`,
        transform: `translate(${left}px, ${top}px)`,
        opacity: 1
      }
    } else {
      markerStyle.value = {
        width: `${width}px`,
        height: 'var(--raya-tabs-underline-height, 2px)',
        transform: `translate(${left}px, ${top + height - 2}px)`,
        opacity: 1
      }
    }
  } else {
    markerStyle.value = {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${left}px, ${top}px)`,
      opacity: 1
    }
  }
}

const setTabRef = (el: any, index: number) => {
  if (el) tabRefs.value[index] = el.$el || el
}

const setContainerRef = (el: any) => {
  if (el) containerRef.value = el.$el || el
}

watch(
  () => [selected.value, props.variant, props.orientation, props.items],
  async () => {
    await nextTick()
    updateMarker()
  },
  { deep: true }
)

let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  updateMarker()

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => updateMarker())
    resizeObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <TabsRoot
    v-model="selected"
    :orientation="orientation"
    :class="cn(
      'w-full flex',
      orientation === 'vertical' ? 'flex-row gap-8 items-start' : 'flex-col',
      props.class
    )"
    style="
      --raya-tabs-curve: cubic-bezier(0.25, 1, 0.2, 1);
      --raya-tabs-duration: 300ms;
    "
  >
    <TabsList
      :ref="setContainerRef"
      class="relative inline-flex shrink-0 select-none"
      :class="[
        orientation === 'vertical' ? 'flex-col items-stretch' : 'flex-row items-center',
        variant === 'underline' && (orientation === 'vertical' ? 'border-r border-border pr-px bg-transparent' : 'border-b border-border pb-px bg-transparent'),
        variant === 'pill' && 'gap-1 rounded-xl bg-muted border border-border/50 p-1 w-fit',
        variant === 'segment' && (orientation === 'vertical' ? 'gap-0 rounded-xl bg-muted border border-border/50 p-1 w-full max-w-[200px]' : 'gap-0 rounded-xl bg-muted border border-border/50 p-1 w-full')
      ]"
    >
      <div
        class="pointer-events-none absolute left-0 top-0 z-0 opacity-0 transition-all"
        style="transition-property: transform, width, height; transition-duration: var(--raya-tabs-duration); transition-timing-function: var(--raya-tabs-curve);"
        :class="[
          variant === 'underline' && 'bg-primary rounded-full',
          variant === 'pill' && 'bg-background shadow-sm rounded-lg border border-border/50',
          variant === 'segment' && 'bg-background shadow-sm rounded-lg border border-border/50'
        ]"
        :style="markerStyle"
      ></div>

      <TabsTrigger
        v-for="(item, index) in items"
        :key="item.id ?? item.value ?? index"
        :value="item.id ?? item.value ?? index"
        :ref="(el) => setTabRef(el, index)"
        :disabled="item.disabled"
        class="relative z-10 flex items-center gap-2 border-0 bg-transparent px-4 py-2 text-sm font-medium whitespace-nowrap outline-none transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        :class="[
          variant === 'segment' || orientation === 'vertical' ? 'w-full' : '',
          orientation === 'vertical' ? 'justify-start' : 'justify-center',
          selected === (item.id ?? item.value ?? index)
            ? 'text-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        ]"
      >
        <slot name="default" :item="item" :index="index" :selected="selected === (item.id ?? item.value ?? index)">
          <component :is="item.icon" v-if="item.icon" class="h-4 w-4 opacity-70" />
          <span>{{ item.label }}</span>
        </slot>
      </TabsTrigger>
    </TabsList>

    <div v-if="content" :class="orientation === 'vertical' ? 'flex-1 mt-0 pt-1' : 'mt-4'">
      <TabsContent
        v-for="(item, index) in items"
        :key="item.id ?? item.value ?? index"
        :value="item.id ?? item.value ?? index"
        class="rounded-xl duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-1 data-[state=inactive]:hidden"
      >
        <slot :name="item.slot || 'item'" :item="item" :index="index" :selected="selected === (item.id ?? item.value ?? index)">
          <div v-if="item.content" v-html="item.content" class="text-sm leading-relaxed text-muted-foreground"></div>
        </slot>
      </TabsContent>
    </div>
  </TabsRoot>
</template>