// Data loader composable
// https://vuejs.org/guide/reusability/composables
// DataLoader.js


import { ref, watchEffect, shallowRef } from 'vue';
import { csvParse } from 'd3';

export function useFetch(url) {
  const data = shallowRef(null); 
  const error = ref(null);

  const fetchData = async () => {
    data.value = null
    error.value = null
    try {
      const res = await fetch(url);
      const text = await res.text();
      const csv = csvParse(text);
      data.value = csv;
    } catch (err) {
      error.value = err;
    }
  };

  watchEffect(() => {
    fetchData();
  });

  return { data, error };
}
