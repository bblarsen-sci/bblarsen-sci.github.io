<script setup>
import { useData } from 'vitepress';
import Nav from './components/Nav.vue';
import Home from './components/Home.vue';
import About from './components/About.vue';
import Publications from './components/Publications.vue';
import Visualizations from './components/Visualizations.vue';
import ContentPage from './components/Content.vue';

const { frontmatter } = useData();
</script>

<template>
  <div id="app" class="flex min-h-screen flex-col">
    <Nav></Nav>
    <main>
      <Home v-if="frontmatter.home" />
      <About v-else-if="frontmatter.about" />
      <Publications v-else-if="frontmatter.publications" />
      <Visualizations v-else-if="frontmatter.visualizations" />
      <ContentPage v-else />
    </main>
  </div>
</template>
