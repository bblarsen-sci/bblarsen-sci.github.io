<template>
    <div class="px-0 md:px-10">
        <div class="max-w-screen-xl mx-auto">
            <div class="flex justify-start py-4">
                <div class="text-left text-2xl">{{ title }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
defineProps(['title'])
</script>