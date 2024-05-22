<template>
    <div class="p-2 md:p-6">
        <div class="container mx-auto max-w-screen-lg">
            <div class="flex justify-start py-10">
                <div class="text-left text-2xl">{{ title }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
defineProps(['title'])
</script>