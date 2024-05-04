<template>
    <div class="w-full flex items-center justify-between border-b-2 border-gray-500 py-3">
        <div class="relative ml-2 md:ml-0">
            <svg class="blob" viewBox="0 0 200 200" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                <path fill="rgb(5, 150, 105)" d="M50.4,-15.8C59.3,10.9,56.2,42.1,36,58.9C15.9,75.8,-21.4,78.3,-41.8,62.4C-62.2,46.4,-65.8,11.9,-56,-16C-46.2,-43.9,-23.1,-65.4,-1.2,-65C20.8,-64.6,41.5,-42.4,50.4,-15.8Z" transform="translate(100 100)" />
            </svg>
            <a>
                <span class="font-bold">Brendan</span>
            </a>
        </div>
        <div class="flex-grow"></div>
        <div class="flex items-center">
            <a href="/" class="mr-4">Home</a>
            <a href="/about" class="mr-4">About</a>
            <a href="/publications" class="mr-4">Publications</a>
            <a href="/code_pages/code_index" class="mr-4">Code</a>
        </div>
    </div>
  </template>
  
  <script setup>
  import { useData } from 'vitepress'
  
  const { page } = useData()
  </script>
  

  