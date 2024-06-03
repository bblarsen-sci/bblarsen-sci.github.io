<script setup>
    import { ref, computed, watch } from 'vue';
    import { useData, useRoute } from 'vitepress';
    import VPNavBarAppearance from './VPNavBarAppearance.vue'
    
    const isMenuOpen = ref(false);
    const route = useRoute();
    
    // Computed property for menu items
    const menuItems = computed(() => [
      { text: 'About', href: '/about/' },
      { text: 'Publications', href: '/publications/' },
      { text: 'Visualizations', href: '/code_pages/code_index/' },
    ]);
    
    // Toggle the menu state
    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };
    
    // Close the menu
    const closeMenu = () => {
      isMenuOpen.value = false;
    };
    
    // Watch the menu state and update the body class to disable scrolling when the menu is open
    watch(isMenuOpen, (newValue) => {
      const body = document.body;
      if (newValue) {
        body.classList.add('disable-scroll');
      } else {
        body.classList.remove('disable-scroll');
      }
    });
    
    // Handle menu item click event
    const handleItemClick = () => {
      closeMenu();
    };
    </script>

<template>
    <nav class="p-4">
        <div class="flex justify-between items-center w-full px-4 select-none">
            <a href="/" class="flex items-center no-underline">
              <span class="title text-md font-semibold z-20 tracking-tight collapse sm:visible">Brendan Larsen</span>
            </a>
            <div
              class="bg-custom-soft backdrop-blur-md md:backdrop-blur-none flex-col md:flex-row bg-opacity-75 md:bg-transparent md:flex md:items-center md:px-0 px-3 md:pb-0 pb-10 md:static absolute md:w-auto w-full md:h-auto h-full md:pt-0 pt-10 top-14 z-50"
              :class="`md:flex ${isMenuOpen ? 'flex' : 'hidden'} ${isMenuOpen ? 'left-0' : 'left-[-100%]'}`"
            >
              <div class="flex flex-col md:flex-row">
                <div
                  v-for="item in menuItems"
                  :key="item.text"
                  :item="item"
                  @click="handleItemClick"
                >
                  <a
                    :href="item.href"
                    :class="{ 'text-red-400': route.path === item.href, 'text-gray-600': route.path !== item.href }"
                    class="px-4 py-4 flex flex-col items-center justify-center hover:text-red-400"
                  >
                    {{ item.text }}
                  </a>
                </div>
              </div>
            </div>
            <button class="flex flex-col md:hidden text-gray-600" @click="toggleMenu">
              <span :class="isMenuOpen ? 'i-x h-6 w-6' : 'i-menu h-6 w-6'"></span>
            </button>
            <VPNavBarAppearance class="appearance" />
          </div>
    </nav>
</template>

<style>
    .disable-scroll {
      overflow: hidden;
    }
    a {
      text-decoration: none;
    }
    </style>