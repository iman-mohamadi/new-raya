<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Motion } from "motion-v";

export interface SpringOptions {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export interface MagneticProps {
  /** The strength of the magnetic pull */
  intensity?: number;
  /** The distance in pixels before the magnetic effect kicks in */
  range?: number;
  /** What element triggers the hover state */
  actionArea?: "self" | "parent" | "global";
  /** Physics configuration for the spring animation */
  springOptions?: SpringOptions;
}

const props = withDefaults(defineProps<MagneticProps>(), {
  intensity: 0.6,
  range: 100,
  actionArea: "self",
  // Tuned for motion-v's native popmotion spring engine
  springOptions: () => ({ stiffness: 150, damping: 15, mass: 0.1 }),
});

const elementRef = ref<InstanceType<typeof Motion> | null>(null);
const isHovered = ref(false);

// We only track the target destinations. Motion-v handles the actual movement frames.
const targetX = ref(0);
const targetY = ref(0);

let triggerEl: HTMLElement | null = null;

const handleMouseMove = (e: MouseEvent) => {
  const el = elementRef.value?.$el as HTMLElement;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const distanceX = e.clientX - centerX;
  const distanceY = e.clientY - centerY;

  const absoluteDistance = Math.hypot(distanceX, distanceY);

  if (isHovered.value && absoluteDistance <= props.range) {
    const scale = 1 - absoluteDistance / props.range;
    targetX.value = distanceX * props.intensity * scale;
    targetY.value = distanceY * props.intensity * scale;
  } else {
    targetX.value = 0;
    targetY.value = 0;
  }
};

const handleMouseEnter = () => { isHovered.value = true; };
const handleMouseLeave = () => {
  isHovered.value = false;
  targetX.value = 0;
  targetY.value = 0;
};

onMounted(() => {
  if (typeof window === 'undefined') return;

  const el = elementRef.value?.$el as HTMLElement;
  if (!el) return;

  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  if (props.actionArea === 'global') {
    isHovered.value = true;
  } else {
    triggerEl = props.actionArea === 'parent' ? el.parentElement : el;
    if (triggerEl) {
      triggerEl.addEventListener('mouseenter', handleMouseEnter);
      triggerEl.addEventListener('mouseleave', handleMouseLeave);
    }
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleMouseMove);
    if (triggerEl) {
      triggerEl.removeEventListener('mouseenter', handleMouseEnter);
      triggerEl.removeEventListener('mouseleave', handleMouseLeave);
    }
  }
});
</script>

<template>
  <Motion
    ref="elementRef"
    as="div"
    :animate="{ x: targetX, y: targetY }"
    :transition="{
      type: 'spring',
      stiffness: props.springOptions.stiffness,
      damping: props.springOptions.damping,
      mass: props.springOptions.mass
    }"
    class="inline-block"
  >
    <slot />
  </Motion>
</template>