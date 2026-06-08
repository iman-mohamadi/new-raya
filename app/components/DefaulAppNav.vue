<script setup lang="ts">
import {ref} from 'vue'
import {Motion} from 'motion-v'
import {Github, Menu, X} from 'lucide-vue-next'

const isOpen = ref(false)
const navLinks = [
  {name: 'Introduction', href: '/docs/introduction'},
  {name: 'Installation', href: '/docs/installation'},
  {name: 'Components', href: '/components'}
]
</script>

<template>
  <nav class="fixed inset-x-0 top-0 z-10 w-full border-b border-black/5 dark:border-white/10 flex justify-center">
    <div class="container mx-auto px-4">
      <ClientOnly>
        <Motion
            :initial="{ y: -20, opacity: 0 }"
            :animate="{ y: 0, opacity: 1 }"
            :transition="{ type: 'spring', stiffness: 260, damping: 20 }"
            class="flex items-center justify-between w-full py-3 bg-background"
        >
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <div
                class="size-7 rounded-lg bg-foreground flex items-center justify-center transition-transform group-hover:rotate-12">
              <span class="text-background font-black text-xs">R</span>
            </div>
            <span class="font-bold tracking-tighter text-foreground uppercase">Raya UI</span>
          </NuxtLink>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center gap-1">
            <NuxtLink
                v-for="link in navLinks"
                :key="link.href"
                :to="link.href"
                class="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
                active-class="text-foreground bg-muted"
            >
              {{ link.name }}
            </NuxtLink>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <a href="https://github.com/iman-mohamadi/raya-ui" target="_blank"
               class="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Github class="size-5"/>
            </a>
            <ThemeSwitcher/>
            <button class="md:hidden p-2 text-foreground" @click="isOpen = !isOpen">
              <Menu v-if="!isOpen" class="size-6"/>
              <X v-else class="size-6"/>
            </button>
            <NuxtLink
                to="/docs/installation"
                class="hidden sm:block px-5 py-2 rounded-full bg-foreground text-background text-xs font-bold hover:scale-105 transition-transform active:scale-95"
            >
              GET STARTED
            </NuxtLink>
          </div>
        </Motion>
      </ClientOnly>

      <!-- Mobile Menu (Overlay) -->
      <Teleport to="body">
        <div v-if="isOpen"
             class="fixed inset-0 z-[49] bg-background/80 backdrop-blur-md md:hidden flex flex-col items-center justify-center gap-8">
          <NuxtLink
              v-for="link in navLinks"
              :key="link.href"
              :to="link.href"
              @click="isOpen = false"
              class="text-3xl font-bold tracking-tighter text-foreground hover:text-primary transition-colors"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </Teleport>
    </div>
  </nav>
</template>