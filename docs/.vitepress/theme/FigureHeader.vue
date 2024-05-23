<template>
    <div class="px-2 md:px-6">
        <div class="container mx-auto max-w-screen-lg">
            <div class="flex justify-start py-4">
                <div class="text-left text-2xl">{{ title }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
defineProps(['title'])
</script>