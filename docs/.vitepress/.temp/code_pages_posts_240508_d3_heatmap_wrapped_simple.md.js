import { useSSRContext, ref, shallowRef, computed, watch, resolveComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
import { L as Legend } from "./legend.MhBJYvjr.js";
const __pageData = JSON.parse('{"title":"Zoomable heatmap","description":"","frontmatter":{"layout":"doc","title":"Zoomable heatmap","aside":false,"date":"2024-05-08T00:00:00.000Z","keywords":["D3"],"subtext":"Demonstration of using D3 zoom function to make heatmap zoomable and draggable inside container. Scales with screen size.","thumbnail":"/thumbnails/d3_zoom_heatmap.png"},"headers":[],"relativePath":"code_pages/posts/240508_d3_heatmap_wrapped_simple.md","filePath":"code_pages/posts/240508_d3_heatmap_wrapped_simple.md"}');
const __default__ = { name: "code_pages/posts/240508_d3_heatmap_wrapped_simple.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const data = shallowRef([]);
    const dataFile = "https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv";
    async function fetchData() {
      const csv = await d3.csv(dataFile);
      const array = csv.map((d) => ({
        site: +d.site,
        wildtype: d.wildtype,
        mutant: d.mutant,
        effect: +d.entry_CHO_bEFNB3
      }));
      data.value = array;
    }
    fetchData();
    const amino_acids = [
      "R",
      "K",
      "H",
      "D",
      "E",
      "Q",
      "N",
      "S",
      "T",
      "Y",
      "W",
      "F",
      "A",
      "I",
      "L",
      "M",
      "V",
      "G",
      "P",
      "C"
    ];
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const rowPadding = 30;
    let rows = 4;
    let paddingValue = 0.1;
    const squareSize = 10;
    const color = "interpolateRdBu";
    const min = -4;
    const max = 4;
    function colorScale(effect) {
      return d3.scaleDiverging(d3[color]).domain([min, 0, max])(effect);
    }
    const sites = computed(() => Array.from(new Set(data.value.map((d) => +d.site))));
    const sitesPerRow = computed(() => Math.ceil(sites.value.length / rows));
    const siteRows = computed(
      () => Array.from(
        { length: rows },
        (_, i) => sites.value.slice(i * sitesPerRow.value, (i + 1) * sitesPerRow.value)
      )
    );
    const maxSitesInRow = computed(() => Math.max(...siteRows.value.map((row) => row.length)));
    const innerWidth = computed(() => squareSize * maxSitesInRow.value);
    const width = computed(() => innerWidth.value + margin.left + margin.right);
    const height = computed(
      () => squareSize * amino_acids.length * rows + margin.top + margin.bottom + rowPadding * (rows - 1) + margin.bottom
    );
    const innerHeight = computed(() => height.value - margin.top - margin.bottom);
    const dataLookup = computed(
      () => data.value.reduce((lookup, dataPoint) => {
        lookup[`${dataPoint.site}-${dataPoint.mutant}`] = dataPoint;
        return lookup;
      }, {})
    );
    const wildtypeLookup = computed(
      () => data.value.reduce((lookup, dataPoint) => {
        lookup[dataPoint.site] = dataPoint.wildtype;
        return lookup;
      }, {})
    );
    const uniqueWildtypes = computed(() => {
      const map = /* @__PURE__ */ new Map();
      data.value.forEach((d) => {
        if (!map.has(+d.site)) {
          map.set(+d.site, d);
        }
      });
      return map;
    });
    const xScale = computed(
      () => d3.scaleBand().domain(Array.from({ length: maxSitesInRow.value }, (_, i) => i)).range([0, innerWidth.value]).padding(paddingValue)
    );
    const yScale = computed(
      () => d3.scaleBand().domain(amino_acids).range([0, squareSize * amino_acids.length]).padding(paddingValue)
    );
    function updateHeatmap() {
      console.log("updating heatmap");
      function zoomed(event) {
        chartGroup.attr("transform", event.transform);
      }
      const svgElement = d3.select("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", `0 0 ${width.value} ${height.value}`).call(d3.zoom().on("zoom", zoomed));
      const chartGroup = svgElement.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
      siteRows.value.forEach((siteRow, rowIndex) => {
        chartGroup.selectAll(`rect-row-${rowIndex}`).data(siteRow.flatMap((site) => amino_acids.map((mutant) => ({ site, mutant })))).enter().append("rect").attr("x", (d) => xScale.value(siteRow.indexOf(d.site))).attr("y", (d) => yScale.value(d.mutant) + (yScale.value.range()[1] + rowPadding) * rowIndex).attr("width", xScale.value.bandwidth()).attr("height", yScale.value.bandwidth()).attr("fill", (d) => {
          const key = `${d.site}-${d.mutant}`;
          if (dataLookup.value[key]) {
            return colorScale(+dataLookup.value[key].effect);
          } else {
            return wildtypeLookup.value[d.site] === d.mutant ? "white" : "lightgray";
          }
        });
        chartGroup.selectAll(`.wildtype-row-${rowIndex}`).data(Array.from(uniqueWildtypes.value.values()).filter((d) => siteRow.includes(+d.site))).enter().append("text").attr("class", `wildtype-row`).attr("x", (d) => xScale.value(siteRow.indexOf(+d.site)) + xScale.value.bandwidth() / 2).attr("y", (d) => yScale.value(d.wildtype) + (yScale.value.range()[1] + rowPadding) * rowIndex + yScale.value.bandwidth() / 2 + 3).attr("text-anchor", "middle").text("X");
        const xAxis = d3.axisBottom(xScale.value).tickSizeOuter(0);
        if (siteRow.length <= 50) {
          xAxis.tickFormat((d) => siteRow[d]);
        } else {
          xAxis.tickFormat((d, i) => i % 10 === 0 ? siteRow[d] : "");
        }
        chartGroup.append("g").attr("class", `x-axis-row`).attr("transform", `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex + yScale.value.range()[1]})`).call(xAxis).selectAll("text").attr("dx", "-7px").attr("dy", "-5px");
        chartGroup.append("g").attr("class", `y-axis-row`).attr("transform", `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex})`).call(d3.axisLeft(yScale.value).tickSizeOuter(0));
      });
      chartGroup.append("text").attr("class", "axis-title-x").attr("x", innerWidth.value / 2).attr("y", innerHeight.value - 10).text("Site");
      chartGroup.append("text").attr("class", "axis-title-y").attr("x", -innerHeight.value / 2).attr("y", -margin.left).attr("dy", "1em").text("Amino Acid");
      Legend(d3.scaleDiverging([min, 0, max], d3[color]).clamp(true), {
        //svgRef: svgContainer.value,
        title: "Cell Entry",
        width: 200,
        tickValues: [min, 0, max],
        xcoord: 0,
        ycoord: height.value - 50
      });
    }
    watch(data, () => {
      updateHeatmap();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FigureTitle = resolveComponent("FigureTitle");
      const _component_SubtitleHeader = resolveComponent("SubtitleHeader");
      const _component_D3PlotContainer = resolveComponent("D3PlotContainer");
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_FigureTitle, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$frontmatter.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$frontmatter.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SubtitleHeader, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$frontmatter.subtext)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$frontmatter.subtext), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_D3PlotContainer, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg${_scopeId}></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg"))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240508_d3_heatmap_wrapped_simple.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
