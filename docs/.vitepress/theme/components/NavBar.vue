<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue';
import { breakpointsTailwind, useBreakpoints, useToggle } from '@vueuse/core';

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
  sticky: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  solid: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('md');
const isShowMenuOnMobile = ref(false);
const toggleMobileMenu = useToggle(isShowMenuOnMobile);
const navbarBaseClasses = ' border-slate-300';


const isShowMenu = computed(() => (!isMobile ? true : isShowMenuOnMobile.value));
</script>

<template>
  <nav :class="navbarBaseClasses">
    <div class="container mx-auto flex flex-wrap items-center justify-between">
      <slot name="logo" />
      <button
        aria-controls="navbar-default"
        aria-expanded="false"
        class="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
        type="button"
        @click="toggleMobileMenu()"
      >
        <span class="sr-only">Open main menu</span>
        <slot name="menu-icon">
          <svg
            aria-hidden="true"
            class="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              fill-rule="evenodd"
            />
          </svg>
        </slot>
      </button>
      <slot :is-show-menu="isShowMenu" name="default" />
      <div v-if="slots['right-side']" class="hidden md:order-2 md:flex">
        <slot name="right-side" />
      </div>
    </div>
  </nav>
</template>
