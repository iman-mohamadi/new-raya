<script setup lang="ts">
import { computed } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { useClipboard } from '@vueuse/core'
import { cn } from '@/lib/utils'

// Syntax Highlighting
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.css' // You can swap this for any hljs theme

interface Props {
  code?: string
  lang?: string
  fileName?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  lang: 'typescript',
  code: ''
})

const { copy, copied } = useClipboard({ source: () => props.code })

const highlightedCode = computed(() => {
  const language = props.lang && hljs.getLanguage(props.lang) ? props.lang : 'plaintext'
  return hljs.highlight(props.code, { language }).value
})
</script>

<template>
  <div
    :class="cn(
      'relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm',
      props.class
    )"
  >
    <div
      v-if="fileName || $slots.header"
      class="flex min-h-10 items-center border-b border-border bg-muted/50 px-4 py-2"
    >
      <div class=" flex-1 min-w-0 flex items-center font-mono text-xs font-medium text-muted-foreground">
        <slot name="header">
          {{ fileName }}
        </slot>
      </div>
    </div>

    <div class="absolute right-2 top-2 z-10">
      <button
        @click="copy()"
        class="flex h-8 w-8 items-center justify-center rounded-md bg-background/50 backdrop-blur-md text-muted-foreground transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Copy code"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-50"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-50"
          mode="out-in"
        >
          <Check v-if="copied" class="h-4 w-4 text-emerald-500" />
          <Copy v-else class="h-4 w-4" />
        </Transition>
      </button>
    </div>

    <div class="overflow-x-auto">
      <pre class="p-4"><code
        :class="`language-${lang} !bg-transparent p-0 block min-w-full text-sm font-mono leading-relaxed`"
        v-html="highlightedCode"
      ></code></pre>
    </div>
  </div>
</template>