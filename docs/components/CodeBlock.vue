<!-- CodeBlock.vue -->
<template>
    <pre class="shiki" :class="language" v-html="highlightedCode"></pre>
</template>

<script setup>
import { shiki } from 'shiki';
import { defineProps, computed } from 'vue';

const props = defineProps({
    language: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
});

const highlightedCode = computed(() => {
    return shiki.getHighlighter({
        theme: 'nord', // You can change the theme as needed
    }).then((highlighter) => {
        return highlighter.codeToHtml(props.code, props.language);
    });
});
</script>

<style>
.shiki {
    /* Add any custom styles for the code block */
}
</style>