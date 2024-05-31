// loadCSV.data.js
import * as d3 from 'd3';

export default {
  async load() {
    return await d3.csv(
      'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv'
    );
  },
};
