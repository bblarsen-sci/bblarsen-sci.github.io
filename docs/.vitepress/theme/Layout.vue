<template>
    <Header />
    <Content />
</template>


<script>
    import Header from './Header.vue'    
    export default {
      name: 'Layout',
      components: {
        Header,
      }
    }
</script>