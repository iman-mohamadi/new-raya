<script setup lang="ts">
import { ref } from 'vue'
import {
  PanelLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCw,
  Settings2,
  Code
} from 'lucide-vue-next'
import AppNav from '~/components/AppNav.vue'
import ThemeSwitcher from '~/components/ThemeSwitcher.vue'

const props = withDefaults(defineProps<{
  /** The name of the file shown above the code block */
  filename?: string
  /** The parent group shown in the breadcrumb (e.g. 'Components' or 'Backgrounds') */
  breadcrumbGroup?: string
}>(), {
  filename: 'source-code.vue',
  breadcrumbGroup: 'Components'
})

const isExpanded = ref(false)
const showCode = ref(false)
const isSidebarOpen = ref(false)
const showSettings = ref(false)

const previewKey = ref(0)
const refreshPreview = () => {
  previewKey.value++
}
</script>

<template>
  <div class="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">

    <div
      class="fixed top-0 left-0 w-8 h-full z-[190] hidden lg:block"
      @mouseenter="isSidebarOpen = true"
    ></div>

    <aside
      class="fixed top-0 left-0 h-full w-[260px] lg:w-72 z-[999] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      @mouseleave="isSidebarOpen = false"
    >
      <div class="isolate pointer-events-none absolute inset-0 z-0 w-full h-full">
        <div class="absolute inset-0" style="mask-image: linear-gradient(to left, transparent 0%, black 25%, black 50%, transparent 75%); backdrop-filter: blur(4px);"></div>
        <div class="absolute inset-0" style="mask-image: linear-gradient(to left, transparent 25%, black 50%, black 75%, transparent 100%); backdrop-filter: blur(10px);"></div>
        <div class="absolute inset-0" style="mask-image: linear-gradient(to left, transparent 50%, black 75%, black 100%); backdrop-filter: blur(26px);"></div>
        <div class="absolute inset-0" style="mask-image: linear-gradient(to left, transparent 75%, black 100%); backdrop-filter: blur(40px);"></div>
      </div>
      <AppNav />
    </aside>

    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm lg:hidden"></div>
    </Transition>

    <main class="flex-1 flex flex-col relative min-w-0 w-full z-0">
      <div class="relative flex flex-col lg:flex-row h-[calc(100vh)] overflow-hidden w-full bg-transparent">

        <div :class="isSidebarOpen ? 'z-[1000]' : 'z-[60]'" class="absolute top-0 left-0 right-0 h-12 flex items-center pointer-events-none select-none w-1/2">
          <div aria-hidden="true" class="pointer-events-none absolute inset-0 z-50 bg-transparent" style="height: 106px; width: 100%; top: 0px; left: 0px; mask-image: linear-gradient(black 50%, transparent 100%); backdrop-filter: blur(4px);"></div>

          <div class="relative flex items-center z-[150] gap-3 pt-6 px-6 pointer-events-auto">
            <button @click="isSidebarOpen = true" class="inline-flex shrink-0 items-center justify-center gap-2 text-sm font-medium transition-all text-muted-foreground hover:bg-background hover:text-foreground size-8 rounded-full">
              <PanelLeft class="size-5" />
            </button>

            <nav aria-label="breadcrumb">
              <ol class="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm sm:gap-2.5">
                <li class="inline-flex items-center gap-1.5">
                  <span class="text-sm cursor-default">{{ props.breadcrumbGroup }}</span>
                </li>
                <li role="presentation" aria-hidden="true" class="[&>svg]:size-3.5">
                  <ChevronRight class="size-3.5" />
                </li>
                <li class="inline-flex items-center gap-1.5">
                  <slot name="breadcrumb-title">
                    <span class="text-foreground text-sm font-medium">Component</span>
                  </slot>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div aria-hidden="true" class="pointer-events-none absolute z-50 bottom-0 left-0 w-full bg-gradient-to-t from-background to-transparent" style="height: 92px; mask-image: linear-gradient(to top, black 50%, transparent 100%); backdrop-filter: blur(2px);"></div>

        <div
          class="order-2 lg:order-1 flex-1 lg:flex-none h-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden relative z-10"
          :class="isExpanded ? 'lg:w-0 lg:opacity-0' : 'lg:w-1/2 lg:opacity-100'"
        >
          <div class="w-full lg:w-[50vw] h-full overflow-y-auto min-w-0 overflow-x-hidden pt-6 lg:pt-12 no-scrollbar">
            <div class="w-full flex justify-center">
              <div class="w-full px-4 sm:px-8 md:px-16 max-w-4xl py-8 md:py-14 flex flex-col gap-6 md:gap-10 min-w-0 pb-32">
                <slot />
              </div>
            </div>
          </div>
        </div>

        <div
          class="order-1 lg:order-2 h-[50vh] lg:h-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] p-4 pt-20 lg:pt-6 lg:p-6 z-[100] flex flex-col"
          :class="isExpanded ? 'lg:w-full' : 'lg:w-1/2'"
        >
          <div class="flex flex-col h-full z-20">

            <div class="relative flex-1 min-h-0 flex flex-col rounded-[32px] overflow-hidden bg-muted/20 border border-border transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">

              <div :key="previewKey" class="relative flex-1 min-h-0 flex overflow-hidden items-center justify-center w-full h-full pb-20">
                <slot name="preview" />
              </div>

              <div class="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                <div
                  class="bg-background border-border shadow-xl border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden rounded-[24px]"
                  :class="showSettings ? 'w-[320px]' : 'w-auto'"
                >
                  <div class="grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" :class="showSettings ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'">
                    <div class="overflow-hidden w-full">
                      <div class="p-5 border-b border-border w-[320px]">
                        <slot name="settings" />
                      </div>
                    </div>
                  </div>

                  <div class="flex h-[48px] items-center justify-between px-2 w-full shrink-0">
                    <button @click="isExpanded = !isExpanded" class="hidden lg:flex h-9 w-10 cursor-pointer items-center justify-center rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-300">
                      <Minimize2 v-if="isExpanded" class="size-4" />
                      <Maximize2 v-else class="size-4" />
                    </button>

                    <button @click="refreshPreview" class="flex h-9 w-10 cursor-pointer items-center justify-center rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-300">
                      <RotateCw class="size-4" />
                    </button>

                    <div class="flex items-center justify-center h-9 w-10 text-muted-foreground hover:text-foreground transition-colors">
                      <ThemeSwitcher />
                    </div>

                    <div class="w-px h-5 bg-border mx-0.5"></div>

                    <button
                      v-if="$slots.settings"
                      @click="showSettings = !showSettings"
                      :class="['flex h-9 cursor-pointer items-center justify-center rounded-2xl transition-all duration-300 gap-2', showSettings ? 'px-3 bg-muted text-foreground' : 'w-10 text-muted-foreground hover:bg-muted hover:text-foreground']"
                    >
                      <Settings2 class="size-4.5" />
                      <span v-if="showSettings" class="text-sm font-medium tracking-tight">Settings</span>
                    </button>

                    <button
                      @click="showCode = !showCode"
                      :class="['flex h-9 w-10 cursor-pointer items-center justify-center rounded-2xl transition-colors duration-300', showCode ? 'text-primary bg-primary/10 hover:bg-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground']"
                    >
                      <Code class="size-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              class="overflow-hidden rounded-2xl flex-shrink-0 bg-background relative transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
              :class="showCode ? 'h-[50%] mt-3 opacity-100 border border-border' : 'h-0 mt-0 opacity-0 border-0'"
            >
              <div aria-hidden="true" class="pointer-events-none absolute z-10 w-full bg-gradient-to-b from-background to-transparent" style="height: 76px; top: 0px; left: 0px; mask-image: linear-gradient(black 50%, transparent 100%); backdrop-filter: blur(4px);"></div>
              <div class="flex absolute w-full top-2 z-20 right-0 items-center justify-between gap-2 px-6 h-12 shrink-0">
                <span class="flex-1 truncate text-xs font-mono text-muted-foreground font-medium pl-2">{{ props.filename }}</span>
              </div>
              <div class="flex-1 overflow-auto h-full pt-16 pb-4 px-6 no-scrollbar">
                <slot name="code" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>