---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Brendan Larsen"
  tagline: My personal website
  actions:
    - theme: brand
      text: About me
      link: /about
    - theme: brand
      text: Publications
      link: /publications


---



<template>
  <div id="app">
    <bar-chart :data="[5, 10, 15, 20, 25]"></bar-chart>
  </div>
</template>

<script>
import BarChart from './components/BarChart.vue';

export default {
  name: 'App',
  components: {
    BarChart
  }
}
</script>

