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
    <div id="app" class="flex flex-col min-h-screen ">
        <Nav class=""></Nav>
        <main class="">
            <Home v-if="frontmatter.home" />
            <About class="max-w-screen-md mx-auto" v-else-if="frontmatter.about" />
            <Publications class="max-w-screen-md mx-auto" v-else-if="frontmatter.publications" />
            <Visualizations class="max-w-screen-md mx-auto" v-else-if="frontmatter.visualizations" />
            <ContentPage class="-mt-10 max-w-screen-lg mx-auto" v-else />
        </main>
    </div>
</template>