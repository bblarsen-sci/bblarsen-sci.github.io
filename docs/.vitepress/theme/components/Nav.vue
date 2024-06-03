<script setup>
import { computed, inject, ref } from 'vue';
import { useData, useRoute } from 'vitepress';
import SunIcon from './icons/VPIconSun.vue'
import MoonIcon from './icons/VPIconMoon.vue'
import GithubIcon from './icons/GithubIcon.vue'
import HamburgerIcon from './icons/Hamburger.vue';
import InformationIcon from './icons/InformationIcon.vue';
import PubsIcon from './icons/PubsIcon.vue';
import VizIcon from './icons/VizIcon.vue';

const route = useRoute();

const { isDark, theme } = useData()
const toggleAppearance = inject('toggle-appearance', () => {
  isDark.value = !isDark.value
})
const switchTitle = computed(() => {
  return isDark.value
    ? theme.value.lightModeSwitchTitle || 'Switch to light theme'
    : theme.value.darkModeSwitchTitle || 'Switch to dark theme'
})

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
  <div class="container mx-auto max-w-screen-xl">
    <div class="relative flex items-center justify-between px-6 h-16">
      <a href="/" class="inline-block rounded-full font-semibold text-base tracking-tight">Brendan Larsen</a>

      <!-- Regular menu items (hidden on small screens) -->
      <div class="hidden md:flex flex-row items-center gap-4">
        <div v-for="item in menuItems" :key="item.text" :item="item" @click="handleItemClick">
          <a :href="item.href" :class="{
            'bg-slate-200 bg-opacity-50 rounded-lg p-2': route.path === item.href,
            'rounded-lg p-2': route.path !== item.href,
          }" class="items-center justify-center tracking-tight text-base fill-current">
            {{ item.text }}
          </a>
        </div>
        <div class="cursor-pointer" @click="toggleAppearance">
          <SunIcon v-if="!isDark" key="sun" class="w-5" :title="switchTitle" />
          <MoonIcon v-else key="moon" class="w-5" :title="switchTitle" />
        </div>
      </div>

      <!-- Dropdown menu toggle button (only visible on small screens) -->
      <button @click="toggleDropdown" class="md:hidden">
        <HamburgerIcon />
      </button>
    </div>

    <!-- Dropdown menu (only visible on small screens) -->
    <div v-if="isDropdownOpen" class="md:hidden absolute  top-12 right-0  text-sm shadow-md rounded-lg gap-2">
      <a v-for="item in menuItems" :key="item.text" :href="item.href" class="flex flex-row px-4 py-2"
        @click="toggleDropdown">
        <component :is="item.icon" class="w-4 h-4 mr-2" />
        {{ item.text }}
      </a>
      <div class="flex flex-row align-middle px-4 py-2 gap-2 cursor-pointer" @click="toggleAppearance">
        <SunIcon v-if="!isDark" key="sun" class="w-4" :title="switchTitle" />
        <MoonIcon v-else key="moon" class="w-4" :title="switchTitle" />
        <p>Light</p>
      </div>
      <a href="https://github.com/bblarsen-sci/bblarsen-sci.github.io"
        class="flex flex-row align-middle px-4 py-2 gap-2">
        <GithubIcon class="w-4" />
        <p>GitHub</p>
      </a>
    </div>
  </div>
</template>

<style>
a {
  text-decoration: none;
}

</style>
