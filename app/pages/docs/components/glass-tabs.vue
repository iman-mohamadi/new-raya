<script setup lang="ts">
import { ref, computed } from 'vue'
import { GlassTabs } from '~ui/glass-tabs'
import { CodeBlock } from '~ui/code-block'
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-vue-next'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Glass Tabs Component for Vue & Nuxt',
  description: 'An iOS-style floating tab bar with spring physics, animated active states, and heavy glassmorphism.',
  ogTitle: 'Glass Tabs Component for Vue & Nuxt',
  ogDescription: 'An iOS-style floating tab bar with spring physics, animated active states, and heavy glassmorphism.',
})

// --- Interactive Settings State ---
const activeTab = ref(0)

const resetSettings = () => {
  activeTab.value = 0
}

// --- Demo Data ---
const tabs = [
  { icon: Home, label: 'Home', color: '#3A86FF' },
  { icon: Compass, label: 'Explore', color: '#FF7B54' },
  { icon: PlusCircle, label: 'Create', color: '#06D6A0' },
  { icon: MessageCircle, label: 'Messages', color: '#FF5C8A' },
  { icon: User, label: 'Profile', color: '#B388FF' },
]

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add glass-tabs'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add glass-tabs'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add glass-tabs'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add glass-tabs'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install motion-v lucide-vue-next`,
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  return `<script setup lang="ts">
import { ref } from 'vue'
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-vue-next'
import { GlassTabs } from '@/components/ui/glass-tabs'

const activeTab = ref(0)

const tabs = [
  { icon: Home, label: 'Home', color: '#3A86FF' },
  { icon: Compass, label: 'Explore', color: '#FF7B54' },
  { icon: PlusCircle, label: 'Create', color: '#06D6A0' },
  { icon: MessageCircle, label: 'Messages', color: '#FF5C8A' },
  { icon: User, label: 'Profile', color: '#B388FF' },
]
<\/script>

<template>
  <div class="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#1A1A19]">
    <img
      src="https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png"
      class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
    />
    <GlassTabs v-model="activeTab" :tabs="tabs" />
  </div>
</template>`
})
</script>

<template>
  <DocContent>
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Glass Tabs</span>
    </template>

    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Glass Tabs</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        An iOS-style floating tab bar with spring physics, animated active states, and heavy glassmorphism.
      </p>
    </div>

    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>

      <div class="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <button
            v-for="tab in ['cli', 'manual']"
            :key="tab"
            @click="activeInstallTab = tab"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
            :class="activeInstallTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
        >
          {{ tab }}
        </button>
      </div>

      <div v-if="activeInstallTab === 'cli'" class="w-full gap-0 rounded-xl overflow-hidden border border-border bg-background">
        <div class="flex items-center px-3 h-10 border-b border-border">
          <div class="flex items-center gap-0.5 relative">
            <button
                v-for="tab in cliTabs"
                :key="tab"
                @click="activeCliTab = tab"
                class="relative z-10 px-3 h-7 rounded-md text-sm transition-colors"
                :class="activeCliTab === tab ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground'"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <div class="p-1.5">
          <CodeBlock language="bash" :code="installCommands.cli" class="border-0 m-0 bg-transparent" />
        </div>
      </div>

      <div v-if="activeInstallTab === 'manual'" class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">1. Install dependencies:</p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="bash" :code="installCommands.manual" class="border-0 m-0 bg-transparent" />
        </div>
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/glass-tabs</code>.</p>
      </div>
    </div>

    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">File Structure</h2>
      <div class="my-4 rounded-xl border border-border overflow-hidden bg-background">
        <div class="p-4 w-full relative font-mono text-sm text-muted-foreground">
          <div class="flex items-center gap-2 text-foreground">
            <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            your-project
          </div>
          <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
            <div class="flex items-center gap-2 py-2">
              <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              components
            </div>
            <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
              <div class="flex items-center gap-2 py-2">
                <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                ui
              </div>
              <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                <div class="flex items-center gap-2 py-2 text-pink-500">
                  <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  glass-tabs
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>GlassTabs.vue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">GlassTabs Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">modelValue</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The index of the currently selected tab. Bind using <code>v-model</code>.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">tabs</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">Array&lt;GlassTab&gt;</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Array of tab objects detailing the <code>icon</code>, <code>label</code>, and active <code>color</code> hex code.</p>
          </div>
        </div>

      </div>
    </div>

    <template #preview>
      <div class="w-full h-full flex flex-col items-center justify-center relative min-h-[500px] overflow-hidden rounded-[2.5rem] bg-[#1A1A19]">
        <ClientOnly>
          <img
              src="https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866"
              class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
              alt="Glass background"
          />
          <GlassTabs v-model="activeTab" :tabs="tabs" />
        </ClientOnly>

        <div class="absolute bottom-6 w-full max-w-[200px] p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg flex flex-col gap-1 font-mono text-sm shadow-xl z-10">
          <span class="text-[10px] text-white/50 uppercase tracking-wider font-semibold block">Active Tab</span>
          <code class="text-white">
            {{ tabs[activeTab]?.label }} (Index: {{ activeTab }})
          </code>
        </div>
      </div>
    </template>

    <template #code>
      <CodeBlock language="vue" :code="codeString" class="border-0 bg-transparent m-0 p-0" />
    </template>

    <template #settings>
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button @click="resetSettings" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reset</button>
      </div>

      <div class="flex flex-col gap-3">
        <label class="text-sm font-medium text-foreground">Available Tabs</label>
        <div class="flex flex-col gap-2">
          <div v-for="(tab) in tabs" :key="tab.label" class="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/30">
            <div class="flex items-center gap-3">
              <component :is="tab.icon" class="w-4 h-4 text-muted-foreground" />
              <span class="text-sm text-foreground">{{ tab.label }}</span>
            </div>
            <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: tab.color }"></div>
          </div>
        </div>
      </div>
    </template>
  </DocContent>
</template>