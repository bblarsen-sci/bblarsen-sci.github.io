<script setup>
import { computed, inject, ref } from 'vue';
import { useData, useRoute } from 'vitepress';
import SunIcon from './icons/VPIconSun.vue';
import MoonIcon from './icons/VPIconMoon.vue';
import GithubIcon from './icons/GithubIcon.vue';
import HamburgerIcon from './icons/Hamburger.vue';
import InformationIcon from './icons/InformationIcon.vue';
import PubsIcon from './icons/PubsIcon.vue';
import VizIcon from './icons/VizIcon.vue';

const route = useRoute();

const { isDark, theme } = useData();
const toggleAppearance = inject('toggle-appearance', () => {
  isDark.value = !isDark.value;
});
const switchTitle = computed(() => {
  return isDark.value
    ? theme.value.lightModeSwitchTitle || 'Switch to light theme'
    : theme.value.darkModeSwitchTitle || 'Switch to dark theme';
});

// Computed property for menu items
const menuItems = computed(() => [
  { text: 'About', href: '/about/', icon: InformationIcon },
  { text: 'Publications', href: '/publications/', icon: PubsIcon },
  { text: 'Visualizations', href: '/visualizations/', icon: VizIcon },
]);

const isDropdownOpen = ref(false);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}
</script>

<template>
  <div class="mx-auto w-full border-b px-4 lg:px-6">
    <div class="relative flex h-16 items-center justify-between">
      <a
        href="/"
        class="inline-block rounded-full border-none text-base font-semibold tracking-tight"
        >Brendan Larsen</a
      >
      <!-- Regular menu items (hidden on small screens) -->
      <div class="hidden flex-row items-center gap-4 md:flex">
        <div v-for="item in menuItems" :key="item.text" :item="item" @click="handleItemClick">
          <a
            :href="item.href"
            :class="{
              'rounded-lg bg-slate-200 bg-opacity-50 p-2 ': route.path === item.href,
              '': route.path !== item.href,
            }"
            class="items-center justify-center border-none fill-current text-sm hover:text-red-500"
          >
            {{ item.text }}
          </a>
        </div>
        <div class="cursor-pointer" @click="toggleAppearance">
          <SunIcon v-if="!isDark" key="sun" class="w-5" :title="switchTitle" />
          <MoonIcon v-else key="moon" class="w-5" :title="switchTitle" />
        </div>
      </div>

      <!-- Dropdown menu toggle button (only visible on small screens) -->
      <button @click="toggleDropdown" class="border-none md:hidden">
        <HamburgerIcon />
      </button>
    </div>

    <!-- Dropdown menu (only visible on small screens) -->
    <div
      v-if="isDropdownOpen"
      class="z-90 absolute right-4 top-12 gap-2 rounded-lg border-none bg-slate-800 text-sm text-slate-200 shadow-md md:hidden"
    >
      <a
        v-for="item in menuItems"
        :key="item.text"
        :href="item.href"
        class="z-50 flex flex-row border-none px-4 py-2 hover:text-red-500"
        @click="toggleDropdown"
      >
        <component :is="item.icon" class="mr-2 w-4 flex-shrink-0" />
        {{ item.text }}
      </a>
      <div
        class="flex cursor-pointer flex-row gap-2 border-none px-4 py-2 align-middle"
        @click="toggleAppearance"
      >
        <SunIcon v-if="!isDark" key="sun" class="w-4" :title="switchTitle" />
        <MoonIcon v-else key="moon" class="w-4" :title="switchTitle" />
        <a class="border-none">Light</a>
      </div>
      <a
        href="https://github.com/bblarsen-sci/bblarsen-sci.github.io"
        class="flex flex-row gap-2 border-none px-4 py-2 align-middle"
      >
        <GithubIcon class="w-4" />
        <a class="border-none hover:text-red-500">GitHub</a>
      </a>
    </div>
  </div>
</template>

<style></style>
