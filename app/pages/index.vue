<script setup lang="ts">
</script>
<template>
  <section id="home"
           class="relative flex h-full items-center justify-center overflow-hidden bg-[url(/small-1-DFIW02w1.jpg)] bg-cover bg-fixed bg-center bg-no-repeat md:h-screen">
    <div class="absolute inset-0 bg-black/80"></div>
    <div class="container">
      <div class="relative flex h-full w-full items-center justify-center px-12 py-12 text-center">
        <div><a class="mb-10 flex items-center justify-center">
          <img height="64" width="64"
               src="/logo.svg"
               alt="logo" class="h-16">
        </a>
          <span
              class="rounded-md bg-white/20 px-4 py-1.25 font-medium capitalize text-white">Our Website Is</span>
          <h1 class="my-8 text-4xl font-extrabold capitalize text-white lg:text-6xl">coming soon</h1>
          <div class="flex justify-center">
            <div class="max-w-xl text-center"><p class="font-semibold text-white">Itaque earum rerum tenetur a sapiente
              delectus reiciendis voluptatibus maiores alias perferendis doloribus asperiores.</p></div>
          </div>
          <div class="flex justify-center">
            <div class="relative mt-14">
              <div>
                <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 sm:gap-x-0">
                  <div
                      class="inline-flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed px-3 py-2 font-bold text-white">
                    <span id="days" class="text-3xl">3</span><span class="text-base">Days</span></div>
                  <div class="mx-4 hidden text-2xl font-bold text-white sm:block">:</div>
                  <div
                      class="inline-flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed px-3 py-2 font-bold text-white">
                    <span id="hours" class="text-3xl">23</span><span class="text-base">Hours</span></div>
                  <div class="mx-4 hidden text-2xl font-bold text-white sm:block">:</div>
                  <div
                      class="inline-flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed px-3 py-2 font-bold text-white">
                    <span id="minutes" class="text-3xl">42</span><span class="text-base">Minutes</span></div>
                  <div class="mx-4 hidden text-2xl font-bold text-white sm:block">:</div>
                  <div
                      class="inline-flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed px-3 py-2 font-bold text-white">
                    <span id="seconds" class="text-3xl">58</span><span class="text-base">Seconds</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center">
            <div class="relative mt-10"><h6 class="mb-4 text-center text-lg text-white">Follow Us:</h6>
              <ul class="flex flex-wrap items-center gap-6 font-maven">
                <li><a
                    class="group inline-flex items-center justify-center text-base font-medium text-white transition-all duration-500 hover:text-blue-500"
                    >
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                       role="img" class="iconify iconify--uil me-2 text-xl" width="1em" height="1em"
                       viewBox="0 0 24 24">
                    <path fill="currentColor"
                          d="M15.12 5.32H17V2.14A26 26 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V7.05c0-1.05.28-1.73 1.76-1.73"></path>
                  </svg>
                  Facebook</a></li>
                <li><a
                    class="group inline-flex items-center justify-center text-base font-medium text-white transition-all duration-500 hover:text-pink-500"
                    >
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                       role="img" class="iconify iconify--uil me-2 text-xl" width="1em" height="1em"
                       viewBox="0 0 24 24">
                    <path fill="currentColor"
                          d="M17.34 5.46a1.2 1.2 0 1 0 1.2 1.2a1.2 1.2 0 0 0-1.2-1.2m4.6 2.42a7.6 7.6 0 0 0-.46-2.43a4.9 4.9 0 0 0-1.16-1.77a4.7 4.7 0 0 0-1.77-1.15a7.3 7.3 0 0 0-2.43-.47C15.06 2 14.72 2 12 2s-3.06 0-4.12.06a7.3 7.3 0 0 0-2.43.47a4.8 4.8 0 0 0-1.77 1.15a4.7 4.7 0 0 0-1.15 1.77a7.3 7.3 0 0 0-.47 2.43C2 8.94 2 9.28 2 12s0 3.06.06 4.12a7.3 7.3 0 0 0 .47 2.43a4.7 4.7 0 0 0 1.15 1.77a4.8 4.8 0 0 0 1.77 1.15a7.3 7.3 0 0 0 2.43.47C8.94 22 9.28 22 12 22s3.06 0 4.12-.06a7.3 7.3 0 0 0 2.43-.47a4.7 4.7 0 0 0 1.77-1.15a4.85 4.85 0 0 0 1.16-1.77a7.6 7.6 0 0 0 .46-2.43c0-1.06.06-1.4.06-4.12s0-3.06-.06-4.12M20.14 16a5.6 5.6 0 0 1-.34 1.86a3.06 3.06 0 0 1-.75 1.15a3.2 3.2 0 0 1-1.15.75a5.6 5.6 0 0 1-1.86.34c-1 .05-1.37.06-4 .06s-3 0-4-.06a5.7 5.7 0 0 1-1.94-.3a3.3 3.3 0 0 1-1.1-.75a3 3 0 0 1-.74-1.15a5.5 5.5 0 0 1-.4-1.9c0-1-.06-1.37-.06-4s0-3 .06-4a5.5 5.5 0 0 1 .35-1.9A3 3 0 0 1 5 5a3.1 3.1 0 0 1 1.1-.8A5.7 5.7 0 0 1 8 3.86c1 0 1.37-.06 4-.06s3 0 4 .06a5.6 5.6 0 0 1 1.86.34a3.06 3.06 0 0 1 1.19.8a3.1 3.1 0 0 1 .75 1.1a5.6 5.6 0 0 1 .34 1.9c.05 1 .06 1.37.06 4s-.01 3-.06 4M12 6.87A5.13 5.13 0 1 0 17.14 12A5.12 5.12 0 0 0 12 6.87m0 8.46A3.33 3.33 0 1 1 15.33 12A3.33 3.33 0 0 1 12 15.33"></path>
                  </svg>
                  Instagram</a></li>
                <li><a
                    class="group inline-flex items-center justify-center text-base font-medium text-white transition-all duration-500 hover:text-sky-500"
                    >
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                       role="img" class="iconify iconify--uil me-2 text-xl" width="1em" height="1em"
                       viewBox="0 0 24 24">
                    <path fill="currentColor"
                          d="M15.14 11.813a5 5 0 0 0-1.292-.593c-.28-.085-.59-.168-.91-.247c-.28-.078-.612-.158-1.022-.248a9.3 9.3 0 0 1-1.436-.424a1.5 1.5 0 0 1-.616-.447a.84.84 0 0 1-.16-.566a.97.97 0 0 1 .205-.597a1.6 1.6 0 0 1 .7-.475A4 4 0 0 1 12.031 8a3.8 3.8 0 0 1 1.106.146a2.1 2.1 0 0 1 .663.322a1.2 1.2 0 0 1 .325.343a1 1 0 1 0 1.761-.948a3.15 3.15 0 0 0-.837-.958a4 4 0 0 0-1.319-.669A5.8 5.8 0 0 0 12.032 6a6 6 0 0 0-2.145.35A3.55 3.55 0 0 0 8.31 7.492a2.98 2.98 0 0 0-.604 1.797a2.84 2.84 0 0 0 .58 1.792a3.5 3.5 0 0 0 1.438 1.072a11 11 0 0 0 1.307.408c.008.003.014.01.022.012c.192.058.498.135.94.23c.173.038.335.079.497.12c.016.004.039.009.054.014l.018.002c.248.064.487.129.706.196a3 3 0 0 1 .763.344a1.1 1.1 0 0 1 .363.368a1.2 1.2 0 0 1 .118.585a1.15 1.15 0 0 1-.214.732a1.76 1.76 0 0 1-.802.585a3.8 3.8 0 0 1-1.487.252a3.7 3.7 0 0 1-1.703-.344a1.76 1.76 0 0 1-.616-.547a1 1 0 0 1-.202-.503a1 1 0 0 0-2 0a2.94 2.94 0 0 0 .556 1.64a3.8 3.8 0 0 0 1.342 1.187a5.6 5.6 0 0 0 2.623.567a5.7 5.7 0 0 0 2.254-.405a3.7 3.7 0 0 0 1.665-1.273a3.15 3.15 0 0 0 .584-1.926a3.1 3.1 0 0 0-.375-1.53a3.2 3.2 0 0 0-.997-1.053m7.221 1.878A10.49 10.49 0 0 0 10.31 1.64a6.499 6.499 0 0 0-8.67 8.67a10.49 10.49 0 0 0 12.05 12.05a6.499 6.499 0 0 0 8.67-8.67M16.5 21a4.5 4.5 0 0 1-2.17-.558a1 1 0 0 0-.677-.106A8.492 8.492 0 0 1 3.5 12a8.6 8.6 0 0 1 .164-1.654a1 1 0 0 0-.106-.677A4.5 4.5 0 0 1 9.67 3.558a1 1 0 0 0 .678.106A8.492 8.492 0 0 1 20.5 12a8.6 8.6 0 0 1-.164 1.654a1 1 0 0 0 .106.677A4.5 4.5 0 0 1 16.5 21"></path>
                  </svg>
                  Skype</a></li>
                <li><a
                    class="group inline-flex items-center justify-center text-base font-medium text-white transition-all duration-500 hover:text-blue-800"
                    >
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                       role="img" class="iconify iconify--uil me-2 text-xl" width="1em" height="1em"
                       viewBox="0 0 24 24">
                    <path fill="currentColor"
                          d="M17.5 8.999a5.4 5.4 0 0 0-2.565.645A1 1 0 0 0 14 8.999h-4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-5.5a1 1 0 1 1 2 0v5.5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-7.5a5.507 5.507 0 0 0-5.5-5.5m3.5 12h-2v-4.5a3 3 0 1 0-6 0v4.5h-2v-10h2v.703a1 1 0 0 0 1.781.625A3.483 3.483 0 0 1 21 14.5Zm-14-12H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1m-1 12H4v-10h2ZM5.015 1.542a3.233 3.233 0 1 0-.057 6.457h.028a3.233 3.233 0 1 0 .029-6.457m-.029 4.457h-.028a1.222 1.222 0 0 1-1.37-1.228c0-.747.56-1.229 1.427-1.229A1.234 1.234 0 0 1 6.41 4.771c0 .746-.56 1.228-1.425 1.228"></path>
                  </svg>
                  Linkedin</a></li>
              </ul>
              <button type="button"
                      class="group mt-5 inline-flex items-center justify-center rounded-lg bg-gray-400/60 px-6 py-2 text-white transition-all duration-500 hover:bg-primary/20 hover:text-primary"
                      data-hs-overlay="#hs-vertically-centered-modal">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                     role="img" class="iconify iconify--uil me-2 text-xl" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor"
                        d="M19.44 13c-.22 0-.45-.07-.67-.12a9.4 9.4 0 0 1-1.31-.39a2 2 0 0 0-2.48 1l-.22.45a12.2 12.2 0 0 1-2.66-2a12.2 12.2 0 0 1-2-2.66l.42-.28a2 2 0 0 0 1-2.48a10 10 0 0 1-.39-1.31c-.05-.22-.09-.45-.12-.68a3 3 0 0 0-3-2.49h-3a3 3 0 0 0-3 3.41a19 19 0 0 0 16.52 16.46h.38a3 3 0 0 0 2-.76a3 3 0 0 0 1-2.25v-3a3 3 0 0 0-2.47-2.9m.5 6a1 1 0 0 1-.34.75a1.06 1.06 0 0 1-.82.25A17 17 0 0 1 4.07 5.22a1.1 1.1 0 0 1 .25-.82a1 1 0 0 1 .75-.34h3a1 1 0 0 1 1 .79q.06.41.15.81a11 11 0 0 0 .46 1.55l-1.4.65a1 1 0 0 0-.49 1.33a14.5 14.5 0 0 0 7 7a1 1 0 0 0 .76 0a1 1 0 0 0 .57-.52l.62-1.4a14 14 0 0 0 1.58.46q.4.09.81.15a1 1 0 0 1 .79 1Z"></path>
                </svg>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>