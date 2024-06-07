// Data loader composable

// DataLoader.js
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);

  const fetchData = async () => {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const csv = d3.csvParse(text);
      data.value = csv;
    } catch (err) {
      error.value = err;
    }
  };

  onMounted(fetchData);

  return { data, error };
}
