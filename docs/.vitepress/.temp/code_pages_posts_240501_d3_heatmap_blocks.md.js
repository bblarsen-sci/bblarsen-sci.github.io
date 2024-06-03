import { useSSRContext, shallowRef, ref, computed, watch, onUnmounted, resolveComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
import { L as Legend } from "./legend.MhBJYvjr.js";
const __pageData = JSON.parse('{"title":"Heatmap windows + animation","description":"","frontmatter":{"layout":"doc","title":"Heatmap windows + animation","aside":false,"date":"2024-05-01T00:00:00.000Z","keywords":["D3"],"subtext":"Heatmap showing effects of mutations in blocks of sites with a transistion animation on repeat.","thumbnail":"/thumbnails/d3_heatmap_blocks.png"},"headers":[],"relativePath":"code_pages/posts/240501_d3_heatmap_blocks.md","filePath":"code_pages/posts/240501_d3_heatmap_blocks.md"}');
const __default__ = { name: "code_pages/posts/240501_d3_heatmap_blocks.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
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
    shallowRef(null);
    const data = shallowRef(null);
    const currentIndex = ref(0);
    const easingRef = ref("easeCubicInOut");
    const delayByIndex = ref(5);
    const intervalId = ref(null);
    const sitesPerView = 20;
    const dataFile = "https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv";
    const height = 300;
    const margin = { top: 10, right: 50, bottom: 90, left: 40 };
    const innerHeight = height - margin.top - margin.bottom;
    const squareSize = Math.min(innerHeight / amino_acids.length, 20);
    const innerWidth = squareSize * sitesPerView;
    const width = innerWidth + margin.left + margin.right;
    const allSites = computed(() => {
      return Array.from(new Set(data.value.map((d) => +d.site)));
    });
    const colorScale = computed(() => {
      return d3.scaleDiverging(d3.interpolateRdBu).domain([-4, 0, 4]);
    });
    const visibleSites = computed(() => {
      return allSites.value.slice(currentIndex.value * sitesPerView, (currentIndex.value + 1) * sitesPerView);
    });
    const dataLookup = computed(() => {
      return data.value.reduce((lookup, dataPoint) => {
        lookup[`${dataPoint.site}-${dataPoint.mutant}`] = dataPoint;
        return lookup;
      }, {});
    });
    const wildtypeLookup = computed(() => {
      return data.value.reduce((lookup, dataPoint) => {
        lookup[dataPoint.site] = dataPoint.wildtype;
        return lookup;
      }, {});
    });
    const allCombinations = computed(() => {
      return visibleSites.value.flatMap((site) => amino_acids.map((mutant) => ({ site, mutant })));
    });
    const filteredData = computed(() => {
      return data.value.filter((d) => visibleSites.value.includes(+d.site));
    });
    const getFillColor = computed(() => {
      return (site, mutant) => {
        const key = `${site}-${mutant}`;
        if (dataLookup.value[key]) {
          return colorScale.value(+dataLookup.value[key].entry_CHO_bEFNB2);
        } else {
          return wildtypeLookup.value[site] === mutant ? "white" : "lightgray";
        }
      };
    });
    const yScale = computed(() => {
      return d3.scaleBand().domain(amino_acids).range([0, innerHeight]).padding(0.1);
    });
    const xScale = computed(() => {
      return d3.scaleBand().domain(visibleSites.value).range([0, innerWidth]).padding(0.1);
    });
    function createSvg() {
      const svgElement = d3.select("svg").attr("width", width).attr("height", height).append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
      return svgElement;
    }
    function createAxes(svgElement) {
      svgElement.append("g").attr("class", "x-axis").attr("transform", `translate(0, ${innerHeight})`);
      svgElement.append("g").call(
        (d) => d.append("text").attr("x", innerWidth / 2).attr("y", height - margin.bottom + 35).attr("text-anchor", "end").attr("fill", "currentColor").attr("font-size", "13px").text("Site")
      );
      yAxisGroup.call(d3.axisLeft(yScale.value).tickSizeOuter(0)).attr("font-size", "11px").call((d) => d.select(".domain").remove()).call(
        (d) => d.append("text").attr("transform", "rotate(-90)").attr("x", -innerHeight / 2).attr("y", -margin.left).attr("dy", "1em").attr("text-anchor", "middle").attr("fill", "currentColor").attr("font-size", "13px").text("Amino Acid")
      );
    }
    function updateHeatmap(svgElement) {
      const totalSites = allSites.value.length;
      const totalPages = Math.ceil(totalSites / sitesPerView);
      intervalId.value = currentIndex.value = (currentIndex.value + 1) % totalPages;
      const t = svgElement.transition().duration(750);
      const gx = svgElement.select(".x-axis").call(d3.axisBottom(xScale.value).tickSizeOuter(0)).attr("transform", `translate(1000,${innerHeight})`).attr("font-size", "11px").call((d) => d.select(".domain").remove());
      gx.transition(t).delay(100).ease(d3.easeCubicInOut).attr("transform", `translate(0,${innerHeight})`).selectAll("text").attr("transform", "rotate(-90)").attr("text-anchor", "end").attr("alignment-baseline", "middle").attr("dy", "-0.7em").attr("dx", "-0.7em");
      svgElement.selectAll("rect").data(allCombinations.value, (d) => `${d.site}-${d.mutant}`).join(
        (enter) => enter.append("rect").attr("fill", (d) => getFillColor.value(d.site, d.mutant)).attr("opacity", 0).attr("x", width).attr("y", (d) => yScale.value(d.mutant)).attr("width", xScale.value.bandwidth()).attr("height", yScale.value.bandwidth()).call(
          (enter2) => enter2.transition(t).delay((d, i) => i * delayByIndex.value * Math.random()).ease(d3[easingRef.value]).attr("x", (d) => xScale.value(d.site)).attr("opacity", 1)
        ),
        (update) => update,
        (exit) => exit.call((exit2) => exit2.transition(t).attr("opacity", 0).remove())
      );
      const uniqueWildtypes = /* @__PURE__ */ new Map();
      filteredData.value.forEach((d) => {
        if (!uniqueWildtypes.has(+d.site)) {
          uniqueWildtypes.set(+d.site, d);
        }
      });
      svgElement.selectAll(".wildtype").data(Array.from(uniqueWildtypes.values()), (d) => d.site).join(
        (enter) => enter.append("text").attr("class", "wildtype").attr("x", (d) => xScale.value(+d.site) + xScale.value.bandwidth() * 10).attr("y", (d) => yScale.value(d.wildtype) + yScale.value.bandwidth() / 2).attr("text-anchor", "middle").attr("opacity", 0).attr("dominant-baseline", "middle").attr("dy", "0.05em").attr("font-size", "10px").text("X").call(
          (enter2) => enter2.transition(t).delay((d, i) => i * delayByIndex.value * Math.random()).ease(d3[easingRef.value]).attr("x", (d) => xScale.value(+d.site) + xScale.value.bandwidth() / 2).attr("fill", "black").attr("opacity", 1)
        ),
        (update) => update,
        (exit) => exit.call((exit2) => exit2.transition(t).attr("opacity", 0).remove())
      );
      setTimeout(() => {
        updateHeatmap(svgElement);
      }, 5e3);
    }
    let yAxisGroup;
    watch(data, () => {
      const svgElement = createSvg();
      yAxisGroup = svgElement.append("g").attr("class", "y-axis");
      Legend(d3.scaleDiverging([-4, 0, 4], d3.interpolateRdBu), {
        //svgRef: svgContainer.value,
        title: "Cell Entry",
        width: 150,
        tickValues: [-4, -2, 0, 2, 4],
        xcoord: innerWidth - 70,
        ycoord: innerHeight + 60
      });
      createAxes(svgElement);
      updateHeatmap(svgElement);
    });
    onUnmounted(() => {
      clearInterval(intervalId.value);
    });
    fetchData();
    async function fetchData() {
      const csv = await d3.csv(dataFile);
      data.value = csv;
    }
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
      _push(ssrRenderComponent(_component_D3PlotContainer, { class: "flex flex-col items-center" }, {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240501_d3_heatmap_blocks.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
