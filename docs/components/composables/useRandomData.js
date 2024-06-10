// Data loader composable
// https://vuejs.org/guide/reusability/composables
// DataLoader.js

import * as d3 from 'd3';

export function makeData(width,height,dispersion) {
  const randomX = d3.randomNormal(width / 2, dispersion);
  //const randomX = d3.randomUniform(20, width-50);
  const randomY = d3.randomNormal(height / 2, dispersion);
  //const randomY = d3.randomUniform(20, height-50);
  const data = Array.from({ length: 100 }, () => [randomX(), randomY()]);

  return { data };
}
