// useRandomData.js
import * as d3 from 'd3';

export function makeData(width, height, dispersion, dataPoints, type = 'normal') {
  const randomX = type === 'uniform'
    ? d3.randomUniform(20, width - 10)
    : d3.randomNormal(width / 2, dispersion);
  const randomY = type === 'uniform'
    ? d3.randomUniform(20, height - 10)
    : d3.randomNormal(height / 2, dispersion);
  return Array.from({ length: dataPoints }, () => [randomX(), randomY()]);
}