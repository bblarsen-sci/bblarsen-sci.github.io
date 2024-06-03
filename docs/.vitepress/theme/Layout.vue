<script setup>
import { Content, useData } from 'vitepress'
import Nav from './components/Nav.vue'
import Home from './components/Home.vue'
import About from './components/About.vue'
import Publications from './components/Publications.vue'
import Visualizations from './components/Visualizations.vue'
import ContentPage from './components/Content.vue'

const { frontmatter } = useData()
</script>
    
<template>
    <div id="app" class="flex flex-col bg-white dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-300">
        <Nav class="mb-4"></Nav>
        <main class="container mx-auto px-4 sm:px-6">
            <Home v-if="frontmatter.home" />
            <About v-else-if="frontmatter.about" />
            <Publications v-else-if="frontmatter.publications" />
            <Visualizations v-else-if="frontmatter.visualizations" />
            <ContentPage v-else />
        </main>
    </div>
</template>