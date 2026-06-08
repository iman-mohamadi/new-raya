<script lang="ts" setup>
import {Motion} from 'motion-v'
</script>

<template>
  <div class="max-w-screen overflow-x-hidden bg-background">

    <DefaulAppNav/>

    <main
        class="grid min-h-dvh grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] justify-center [--gutter-width:2.5rem] md:-mx-4 md:grid-cols-[var(--gutter-width)_minmax(0,var(--breakpoint-2xl))_var(--gutter-width)] lg:mx-0">
      <div
          class="col-start-1 row-span-full row-start-1 hidden border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:block dark:[--pattern-fg:var(--color-white)]/10">
      </div>
      <div class="grid gap-24 pb-24 text-gray-950 sm:gap-40 md:pb-40 dark:text-white pt-20 px-4">
        <!-- Smooth Entrance Animation for Every Page -->
        <ClientOnly>
          <Motion :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
                  :initial="{ opacity: 0, y: 20, filter: 'blur(10px)' }"
                  :transition="{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }">
            <slot/>
          </Motion>
        </ClientOnly>
      </div>
      <div
          class="row-span-full row-start-1 hidden border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:col-start-3 md:block dark:[--pattern-fg:var(--color-white)]/10">
      </div>
      <div
          class="col-start-1 row-start-3 md:col-start-2 relative before:absolute before:top-0 before:h-px before:w-[200vw] before:bg-gray-950/5 dark:before:bg-white/10 before:-left-[100vw] after:absolute after:bottom-0 after:h-px after:w-[200vw] after:bg-gray-950/5 dark:after:bg-white/10 after:-left-[100vw]">
        <footer class="text-sm/loose text-gray-950  dark:text-white">
          <div
              class="mx-auto hidden w-full grid-cols-4 justify-between gap-y-0 md:grid md:grid-cols-4 md:gap-6 md:gap-x-4 lg:gap-8 *:first:border-l-0 *:last:border-r-0">
            <div
                class="border-x border-b border-gray-950/5 py-10 pl-2 not-md:border-0 md:border-b-0 dark:border-white/10">
              <h3 class="font-semibold">Raya UI</h3>
              <ul class="mt-4 grid gap-4">
                <li>
                  <NuxtLink class="hover:underline" to="/components">Components</NuxtLink>
                </li>
                <li>
                  <NuxtLink class="hover:underline" to="#">Blog</NuxtLink>
                </li>
                <li>
                  <NuxtLink class="hover:underline" to="#">Showcase</NuxtLink>
                </li>
                <li>
                  <NuxtLink class="hover:underline" to="#">Sponsor</NuxtLink>
                </li>
              </ul>
            </div>
            <div
                class="border-x border-b border-gray-950/5 py-10 pl-2 not-md:border-0 md:border-b-0 dark:border-white/10">
              <h3 class="mb-2 font-semibold">
                <NuxtLink to="#" class="hover:underline">Raya Plus</NuxtLink>
              </h3>
              <ul class="mt-4 grid gap-4">
                <li>
                  <NuxtLink to="#" class="hover:underline">Templates</NuxtLink>
                </li>
              </ul>
            </div>
            <div
                class="border-x border-b border-gray-950/5 py-10 pl-2 not-md:border-0 sm:border-b-0 dark:border-white/10">
              <h3 class="font-semibold">Resources</h3>
              <ul class="mt-4 grid gap-4">
                <li><a class="hover:underline" target="_blank" href="https://reka-ui.com/">Reka UI</a></li>
                <li><a class="hover:underline" target="_blank" href="https://www.shadcn-vue.com/">Shadcn Vue</a></li>
              </ul>
            </div>

            <div class="border-x border-gray-950/5 py-10 pl-2 not-md:border-0 dark:border-white/10"><h3
                class="font-semibold">Community</h3>
              <ul class="mt-4 grid gap-4">
                <li><a class="hover:underline" target="_blank" href="https://github.com/iman-mohamadi/raya-ui">GitHub</a></li>
                <li><a class="hover:underline" target="_blank" href="/#">Discord</a></li>
                <li><a class="hover:underline" target="_blank" href="https://x.com/raya-ui">X</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
      <div class="col-start-1 row-start-5 grid md:col-start-2">
        <div class="px-2 pt-10 pb-24">
          <div
              class="mx-auto flex w-full flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 px-4 md:px-6 lg:px-8">
            <span class="font-bold tracking-tighter uppercase">Raya UI</span>
            <p class="text-xs text-muted-foreground">© 2026 Architected by Iman Mohammadi.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
