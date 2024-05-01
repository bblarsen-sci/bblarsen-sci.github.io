<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    dateString: String
});

const dateTime = ref(new Date(props.dateString).toISOString());

watch(() => props.dateString, (newValue) => {
    dateTime.value = new Date(parseISOString(newValue)).toISOString();
}, { immediate: true });

// Function to parse ISO string and adjust for timezone
function parseISOString(s) {
    var b = s.split(/\D+/);
    var utcDate = new Date(Date.UTC(b[0], --b[1], b[2]));
    return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
}

// Computed property to format the date
const formattedDate = computed(() => {
    const dateObj = new Date(parseISOString(props.dateString));
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString(undefined, options);
});
</script>

<template>
    <dl>
        <dt class="sr-only">Published on</dt>
        <dd class="date text-base leading-6 font-medium">
            <time :datetime="dateTime">{{ formattedDate }}</time>
        </dd>
    </dl>
</template>