<template>
    <component :is="componentName" class="flex items-center" :[linkAttr]="link">
        <img :src="imageUrl" :alt="alt" class="mr-3 h-6 sm:h-10">
        <span class="self-center font-semibold whitespace-nowrap">
            <slot />
        </span>
    </component>
</template>

<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

interface IFwbNavbarLogoProps {
    link?: string
    imageUrl?: string
    alt?: string
    component?: string
    linkAttr?: string
}
const props = withDefaults(defineProps<IFwbNavbarLogoProps>(), {
    link: '/',
    imageUrl: './icons/Bat.svg',
    alt: 'Logo',
    component: 'a',
    linkAttr: 'href',
})
const componentName = computed(() => {
    return props.component !== 'a' ? resolveComponent(props.component) : 'a'
})
</script>