// d3CustomExport.js
import { select, pointer, leastIndex } from 'd3-selection';
import { extent, min, max } from 'd3-array';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line } from 'd3-shape';

const d3 = {
  select,
  pointer,
  leastIndex,
  extent,
  min,
  max,
  scaleLinear,
  scaleOrdinal,
  axisBottom,
  axisLeft,
  line,
};

export default d3;
