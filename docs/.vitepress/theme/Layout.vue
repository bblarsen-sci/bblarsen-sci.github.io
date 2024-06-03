<script setup>
import { Content, useData } from 'vitepress'
import Nav from './components/Nav.vue'


</script>
    
<template>
    <div id="app" class="flex flex-col min-h-screen">
    <Nav class="mb-4"></Nav>
    <main class="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-5xl xl:px-0">
        <Content />
    </main>
    </div>
</template>