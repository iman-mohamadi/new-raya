<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  /** Reverses the animation direction */
  reverse?: boolean
  /** Pauses the animation when the user hovers over the container */
  pauseOnHover?: boolean
  /** Changes the scrolling direction to vertical */
  vertical?: boolean
  /** Number of times to duplicate the slot content to ensure a seamless loop */
  repeat?: number
}

const props = withDefaults(defineProps<Props>(), {
  reverse: false,
  pauseOnHover: false,
  vertical: false,
  repeat: 4,
  class: ''
})
</script>

<template>
  <div
    :class="cn(
      'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] gap-[var(--gap)]',
      {
        'flex-row': !vertical,
        'flex-col': vertical,
      },
      props.class
    )"
  >
    <div
      v-for="i in repeat"
      :key="i"
      :class="cn('flex shrink-0 justify-around gap-[var(--gap)]', {
        'animate-marquee flex-row': !vertical,
        'animate-marquee-vertical flex-col': vertical,
        'group-hover:[animation-play-state:paused]': pauseOnHover,
        '[animation-direction:reverse]': reverse,
      })"
    >
      <slot />
    </div>
  </div>
</template>

<style>
/* Fallback animations just in case they aren't defined in tailwind.config.ts 
  These enable the marquee to work immediately without configuration.
*/
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100% - var(--gap))); }
}

@keyframes marquee-vertical {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-100% - var(--gap))); }
}

.animate-marquee {
  animation: marquee var(--duration) linear infinite;
}

.animate-marquee-vertical {
  animation: marquee-vertical var(--duration) linear infinite;
}
</style>