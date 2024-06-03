import { useSSRContext, mergeModels, useModel, mergeProps, shallowRef, ref, computed, watch, resolveComponent, withCtx, createTextVNode, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
import * as d3 from "d3";
import { L as Legend } from "./legend.MhBJYvjr.js";
import { T as Tooltip } from "./tooltip.DMyqZ4_3.js";
const _sfc_main$1 = {
  __name: "sidebar",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    strokeOptions: {
      type: Array,
      required: true
    },
    paddingOptions: {
      type: Array,
      required: true
    },
    colorOptions: {
      type: Array,
      required: true
    },
    rowOptions: {
      type: Array,
      required: true
    },
    siteInputValue: {
      type: String,
      required: true
    },
    selectedSites: {
      type: Array,
      required: true
    },
    parseSites: {
      type: Function,
      required: true
    }
  }, {
    "rows": {},
    "rowsModifiers": {},
    "paddingValue": {},
    "paddingValueModifiers": {},
    "strokeWidthValue": {},
    "strokeWidthValueModifiers": {},
    "selectedColorScale": {},
    "selectedColorScaleModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels([
    "downloadSVG",
    "downloadImage",
    "update:selectedSites",
    "update:siteInputValue"
  ], ["update:rows", "update:paddingValue", "update:strokeWidthValue", "update:selectedColorScale"]),
  setup(__props, { emit: __emit }) {
    useModel(__props, "rows");
    useModel(__props, "paddingValue");
    useModel(__props, "strokeWidthValue");
    useModel(__props, "selectedColorScale");
    const heatmapOptions = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sticky top-0 inline-block w-full items-center justify-center overflow-hidden border-2 p-4" }, _attrs))} data-v-358c6855><div class="flex flex-col gap-4 text-xs" data-v-358c6855><div class="text-xl font-bold" data-v-358c6855>Heatmap Options</div><div class="flex flex-col" data-v-358c6855><label class="font-semibold" for="siteInput" data-v-358c6855>Enter Specific Sites:</label><input class="form-input" placeholder="e.g., 1-2,3" data-v-358c6855><button class="btn-primary mt-2" data-v-358c6855> Update Sites </button></div><div class="flex flex-col" data-v-358c6855><label class="font-semibold" data-v-358c6855>Select Padding:</label><select class="form-select" data-v-358c6855><!--[-->`);
      ssrRenderList(heatmapOptions.paddingOptions, (padding) => {
        _push(`<option data-v-358c6855>${ssrInterpolate(padding)}</option>`);
      });
      _push(`<!--]--></select></div><div class="flex flex-col" data-v-358c6855><label class="font-semibold" data-v-358c6855>Select Stroke:</label><select class="form-select" data-v-358c6855><!--[-->`);
      ssrRenderList(heatmapOptions.strokeOptions, (stroke) => {
        _push(`<option data-v-358c6855>${ssrInterpolate(stroke)}</option>`);
      });
      _push(`<!--]--></select></div><div class="flex flex-col" data-v-358c6855><label class="font-semibold" data-v-358c6855>Select Rows:</label><select class="form-select" data-v-358c6855><!--[-->`);
      ssrRenderList(heatmapOptions.rowOptions, (row) => {
        _push(`<option data-v-358c6855>${ssrInterpolate(row)}</option>`);
      });
      _push(`<!--]--></select></div><div class="flex flex-col" data-v-358c6855><label class="font-semibold" data-v-358c6855>Change Color:</label><select class="form-select" data-v-358c6855><!--[-->`);
      ssrRenderList(heatmapOptions.colorOptions, (color) => {
        _push(`<option data-v-358c6855>${ssrInterpolate(color)}</option>`);
      });
      _push(`<!--]--></select></div><div class="mt-10 flex flex-col gap-2" data-v-358c6855><button class="btn-primary" data-v-358c6855>Download SVG</button><button class="btn-primary" data-v-358c6855>Download PNG</button></div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const sidebar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-358c6855"]]);
const __pageData = JSON.parse('{"title":"Heatmap wrapped in rows","description":"","frontmatter":{"layout":"doc","title":"Heatmap wrapped in rows","aside":false,"date":"2024-05-03T00:00:00.000Z","keywords":["D3"],"subtext":"Heatmap of deep mutational scanning data that is wrapped in multiple rows and allows customization.","thumbnail":"/thumbnails/d3_heatmap_wrapped.png"},"headers":[],"relativePath":"code_pages/posts/240503_d3_heatmap_wrapped.md","filePath":"code_pages/posts/240503_d3_heatmap_wrapped.md"}');
const __default__ = { name: "code_pages/posts/240503_d3_heatmap_wrapped.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    const dataFile = "https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv";
    const data = shallowRef([]);
    shallowRef(null);
    const svgContainer = shallowRef(null);
    const paddingValue = ref(0.1);
    const strokeWidthValue = ref(0);
    const rows = ref(4);
    const selectedColorScale = ref("interpolateRdBu");
    const siteInputValue = ref("");
    const selectedSites = ref([]);
    const tooltip = ref(null);
    const min = ref(-4);
    const max = ref(4);
    const colorOptions = [
      "interpolateRdBu",
      "interpolateBrBG",
      "interpolatePRGn",
      "interpolatePiYG",
      "interpolatePuOr",
      "interpolateSpectral"
    ];
    const rowOptions = [1, 2, 3, 4, 5, 6];
    const paddingOptions = [0, 0.05, 0.1, 0.15, 0.2];
    const strokeOptions = [0, 0.5, 1];
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
    let svgElement = null;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const rowPadding = 30;
    const squareSize = 9;
    async function downloadImage() {
      try {
        const plotContainer = svgContainer.value;
        if (!plotContainer) {
          console.error("SVG element not found");
          return;
        }
        const clone = plotContainer.cloneNode(true);
        const dpi = 200;
        const scaleFactor = dpi / 96;
        clone.style.transform = `scale(${scaleFactor})`;
        clone.style.transformOrigin = "top right";
        clone.style.position = "fixed";
        clone.style.top = "-10000px";
        document.body.appendChild(clone);
        const canvas = await html2canvas(clone, {
          scale: scaleFactor,
          useCORS: true,
          logging: true
        });
        document.body.removeChild(clone);
        const blob = await new Promise(
          (resolve) => canvas.toBlob(resolve, "image/png")
        );
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `heatmap.png`;
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    }
    function downloadSVG() {
      const svgElement2 = document.querySelector("svg");
      const serializer = new XMLSerializer();
      const svgBlob = new Blob([serializer.serializeToString(svgElement2)], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "heatmap.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    }
    function parseSites(input) {
      const ranges = input.split(",").map((s) => s.trim());
      let sites2 = [];
      ranges.forEach((range) => {
        if (range.includes("-")) {
          const [start, end] = range.split("-").map(Number);
          sites2 = sites2.concat(Array.from({ length: end - start + 1 }, (_, i) => start + i));
        } else {
          sites2.push(Number(range));
        }
      });
      return sites2;
    }
    const sites = computed(() => {
      if (selectedSites.value.length > 0) {
        return Array.from(new Set(data.value.map((d) => +d.site))).filter((site) => selectedSites.value.includes(site));
      } else {
        return Array.from(new Set(data.value.map((d) => +d.site)));
      }
    });
    const sitesPerRow = computed(() => Math.ceil(sites.value.length / rows.value));
    const siteRows = computed(() => {
      if (selectedSites.value.length > 0) {
        return [sites.value];
      } else {
        return Array.from(
          { length: rows.value },
          (_, i) => sites.value.slice(i * sitesPerRow.value, (i + 1) * sitesPerRow.value)
        );
      }
    });
    const maxSitesInRow = computed(() => {
      if (selectedSites.value.length > 0) {
        return selectedSites.value.length;
      } else {
        return Math.max(...siteRows.value.map((row) => row.length));
      }
    });
    const innerWidth = computed(() => squareSize * maxSitesInRow.value);
    const width = computed(() => innerWidth.value + margin.left + margin.right);
    const height = computed(() => {
      if (selectedSites.value.length > 0) {
        return squareSize * amino_acids.length + margin.top + margin.bottom + margin.bottom;
      } else {
        return squareSize * amino_acids.length * rows.value + margin.top + margin.bottom + rowPadding * (rows.value - 1) + margin.bottom;
      }
    });
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
    const xScale = computed(() => {
      return d3.scaleBand().domain(Array.from({ length: maxSitesInRow.value }, (_, i) => i)).range([0, innerWidth.value]).padding(paddingValue.value);
    });
    const yScale = computed(() => {
      return d3.scaleBand().domain(amino_acids).range([0, squareSize * amino_acids.length]).padding(paddingValue.value);
    });
    const colorScale = computed(() => {
      return d3.scaleDiverging(d3[selectedColorScale.value]).domain([min.value, 0, max.value]);
    });
    watch([data, xScale, rows, selectedSites, strokeWidthValue, colorScale], () => {
      updateHeatmap();
    });
    function makeSvg() {
      const svgElement2 = d3.select("svg").attr("width", width.value).attr("height", height.value).append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
      return svgElement2;
    }
    function updateHeatmap() {
      const svg = d3.select("svg");
      svg.selectAll("*").remove();
      svgElement = makeSvg();
      siteRows.value.forEach((siteRow, rowIndex) => {
        svgElement.selectAll(`rect-row-${rowIndex}`).data(siteRow.flatMap((site) => amino_acids.map((mutant) => ({ site, mutant })))).enter().append("rect").attr("x", (d) => xScale.value(siteRow.indexOf(d.site))).attr("y", (d) => yScale.value(d.mutant) + (yScale.value.range()[1] + rowPadding) * rowIndex).attr("width", xScale.value.bandwidth()).attr("height", yScale.value.bandwidth()).attr("fill", (d) => {
          const key = `${d.site}-${d.mutant}`;
          if (dataLookup.value[key]) {
            return colorScale.value(+dataLookup.value[key].effect);
          } else {
            return wildtypeLookup.value[d.site] === d.mutant ? "white" : "lightgray";
          }
        }).attr("stroke", "black").attr("stroke-width", strokeWidthValue.value).on("mouseover", (event, d) => {
          const key = `${d.site}-${d.mutant}`;
          if (dataLookup.value[key]) {
            tooltip.value.showTooltip(event);
            tooltip.value.data = {
              site: d.site,
              mutant: d.mutant,
              wildtype: wildtypeLookup.value[d.site],
              effect: dataLookup.value[key].effect
            };
            const cellColor = colorScale.value(+dataLookup.value[key].effect);
            tooltip.value.color = cellColor;
          }
        }).on("mouseout", () => {
          tooltip.value.hideTooltip();
        });
        svgElement.selectAll(`.wildtype-row-${rowIndex}`).data(Array.from(uniqueWildtypes.value.values()).filter((d) => siteRow.includes(+d.site))).enter().append("text").attr("class", `wildtype-row`).attr("x", (d) => xScale.value(siteRow.indexOf(+d.site)) + xScale.value.bandwidth() / 2).attr("y", (d) => yScale.value(d.wildtype) + (yScale.value.range()[1] + rowPadding) * rowIndex + yScale.value.bandwidth() / 2 + 3).text("X");
        const xAxis = d3.axisBottom(xScale.value).tickSizeOuter(0);
        if (siteRow.length <= 50) {
          xAxis.tickFormat((d) => siteRow[d]);
        } else {
          xAxis.tickFormat((d, i) => i % 10 === 0 ? siteRow[d] : "");
        }
        svgElement.append("g").attr("transform", `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex + yScale.value.range()[1]})`).call(xAxis).selectAll("text").attr("dx", "-7px").attr("transform", "rotate(-90)").attr("text-anchor", "end").attr("dy", "-5px");
        svgElement.append("g").attr("transform", `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex})`).call(d3.axisLeft(yScale.value).tickSizeOuter(0));
        svgElement.append("text").attr("class", "axis-title-x").attr("x", innerWidth.value / 2).attr("y", innerHeight.value).text("Site");
        svgElement.append("text").attr("class", "axis-title-y").attr("x", -innerHeight.value / 2 + 20).attr("y", 0 - 30).text("Amino Acid");
      });
      Legend(d3.scaleDiverging([min.value, 0, max.value], d3[selectedColorScale.value]).clamp(true), {
        //svgRef: legend.value,
        title: "Cell Entry",
        width: 150,
        tickValues: [min.value, 0, max.value],
        xcoord: 0,
        ycoord: innerHeight.value + 20
      });
    }
    fetchData();
    async function fetchData() {
      try {
        const response = await fetch(dataFile);
        const file_text = await response.text();
        const csv = d3.csvParse(file_text);
        const array = csv.map((d) => ({
          site: +d.site,
          wildtype: d.wildtype,
          mutant: d.mutant,
          effect: +d.entry_CHO_bEFNB3
        }));
        data.value = array;
      } catch (error) {
        console.error("Error fetching CSV file:", error);
      }
    }
    watch(data, () => {
      updateHeatmap();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FigureTitle = resolveComponent("FigureTitle");
      const _component_SubtitleHeader = resolveComponent("SubtitleHeader");
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
      _push(`<div class="w-full px-2 lg:px-6"><div class="flex flex-row py-4"><aside class="w-full sm:w-1/4 md:w-1/6">`);
      _push(ssrRenderComponent(sidebar, {
        rows: rows.value,
        "onUpdate:rows": ($event) => rows.value = $event,
        selectedColorScale: selectedColorScale.value,
        "onUpdate:selectedColorScale": ($event) => selectedColorScale.value = $event,
        paddingValue: paddingValue.value,
        "onUpdate:paddingValue": ($event) => paddingValue.value = $event,
        strokeWidthValue: strokeWidthValue.value,
        "onUpdate:strokeWidthValue": ($event) => strokeWidthValue.value = $event,
        rowOptions,
        colorOptions,
        paddingOptions,
        strokeOptions,
        parseSites,
        selectedSites: selectedSites.value,
        siteInputValue: siteInputValue.value,
        "onUpdate:siteInputValue": ($event) => siteInputValue.value = $event,
        "onUpdate:selectedSites": ($event) => selectedSites.value = $event,
        onDownloadSVG: downloadSVG,
        onDownloadImage: downloadImage
      }, null, _parent));
      _push(`</aside><main class="w-full sm:w-3/4 md:w-5/6 px-2"><div><svg></svg></div></main></div>`);
      _push(ssrRenderComponent(Tooltip, {
        ref_key: "tooltip",
        ref: tooltip
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240503_d3_heatmap_wrapped.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
