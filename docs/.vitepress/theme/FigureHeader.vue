<template>
    <div class="container mx-auto font-roboto max-w-screen-md">
        <div class="flex justify-start py-10">
            <div class="text-left text-2xl">{{ title }}</div>
        </div>
    </div>
</template>
<script setup>
defineProps(['title'])
</script>