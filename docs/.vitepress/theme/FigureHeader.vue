<template>
    <div class="px-6 md:px-8">
        <div class="mx-auto">
            <div class="flex justify-start py-6">
                <div class="text-left font-semibold text-[16px]">{{ title }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
defineProps(['title'])
</script>