<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sun } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  duration?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 400,
  class: ''
})

const emit = defineEmits(['toggle'])

// Use VueUse to handle actual DOM class injection and localStorage seamlessly
const isDark = useDark()
const toggleDark = useToggle(isDark)

const mounted = ref(false)
const buttonRef = ref<HTMLButtonElement | null>(null)

onMounted(() => {
  mounted.value = true
})

const toggleTheme = async (event: MouseEvent) => {
  // Graceful fallback for unsupported browsers or users who prefer reduced motion
  const isAppearanceTransition = 
    // @ts-ignore - View Transitions API might not be fully typed in all environments
    document.startViewTransition && 
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition) {
    toggleDark()
    emit('toggle', isDark.value)
    return
  }

  const button = buttonRef.value
  if (!button) return

  // Calculate button center for the expanding circle origin
  const { top, left, width, height } = button.getBoundingClientRect()
  const x = left + width / 2
  const y = top + height / 2
  
  // Calculate the maximum radius needed to cover the entire screen
  const right = window.innerWidth - left
  const bottom = window.innerHeight - top
  const maxRadius = Math.hypot(
    Math.max(left, right),
    Math.max(top, bottom)
  )

  // @ts-ignore
  const transition = document.startViewTransition(async () => {
    toggleDark()
    emit('toggle', isDark.value)
    await nextTick()
  })

  await transition.ready

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${maxRadius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration: props.duration,
      easing: "ease-in-out",
      pseudoElement: "::view-transition-new(root)",
    }
  )
}
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    @click="toggleTheme"
    :class="cn(
      'relative inline-flex items-center justify-center rounded-md p-2 transition-colors',
      'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      props.class
    )"
  >
    <template v-if="mounted">
      <Sun v-if="isDark" class="h-5 w-5" />
      <Moon v-else class="h-5 w-5" />
    </template>

    <div v-else class="h-5 w-5" />

    <span class="sr-only">Toggle theme</span>
  </button>
</template>

<style>
/* Required View Transition pseudo-elements. 
  By removing the default crossfade animation and locking the z-index, 
  we allow the clip-path circle to act as the sole transition mechanic.
*/
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-new(root) {
  z-index: 2147483646;
}
</style>