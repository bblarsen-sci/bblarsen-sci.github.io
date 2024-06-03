import { useSSRContext, ref, computed, onMounted, watchEffect, resolveComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
import { p as parseNewick, s as scaleBranchLengths, d as diagonal } from "./treeUtilities.BKqfN_26.js";
const __pageData = JSON.parse('{"title":"PhyloTree Animated","description":"","frontmatter":{"layout":"doc","title":"PhyloTree Animated","aside":false,"date":"2024-05-19T00:00:00.000Z","keywords":["D3"],"subtext":"Messing with transitions and animations in D3 on a phylogenetic tree.","thumbnail":"/thumbnails/phylogenyAnimated.png"},"headers":[],"relativePath":"code_pages/posts/240519_d3_phylotreeRight.md","filePath":"code_pages/posts/240519_d3_phylotreeRight.md"}');
const __default__ = { name: "code_pages/posts/240519_d3_phylotreeRight.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    const dataset = ref(null);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 600;
    const height = 700;
    let svg = null;
    const tree = computed(
      () => d3.cluster().size([height - margin.top - margin.bottom, width - margin.right - margin.left]).separation(function separation(a, b) {
        return a.parent == b.parent ? 1 : 1;
      })
    );
    const root = computed(
      () => d3.hierarchy(dataset.value, (d) => d.branchset).sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id)).sum((d) => d.branchLength || 0)
    );
    const countries = computed(
      () => Array.from(new Set(root.value.descendants().map((d) => d.data.country))).filter(Boolean)
    );
    const colorScale = computed(
      () => d3.scaleOrdinal().domain(countries.value).range(d3.schemeCategory10)
    );
    function setColor(d) {
      if (d.children) {
        const childColors = d.children.map((child) => setColor(child));
        const uniqueColors = [...new Set(childColors)];
        d.color = uniqueColors.length === 1 ? uniqueColors[0] : "#ccc";
      } else {
        const country = d.data.country;
        d.color = colorScale.value.domain().indexOf(country) >= 0 ? colorScale.value(country) : null;
      }
      return d.color;
    }
    function makeFigure() {
      tree.value(root.value);
      setColor(root.value);
      scaleBranchLengths(root.value.descendants(), width - margin.left - margin.right);
      const links = svg.append("g").attr("class", "links").attr("fill", "none").attr("stroke", "currentColor").attr("stroke-width", 1).attr("stroke-opacity", 0.5);
      links.selectAll("path").data(root.value.links()).join(
        (enter) => enter.append("path").attr("d", diagonal),
        (update) => update,
        //.attr('d', diagonal),
        (exit) => exit.remove()
      );
      const nodes = svg.append("g").attr("class", "nodes").attr("stroke-linejoin", "round").attr("stroke-width", 0.5).attr("stroke", "currentColor");
      nodes.selectAll("circle").data(root.value.descendants().filter((d) => !d.children)).join(
        (enter) => enter.append("circle").attr("fill", (d) => colorScale.value(d.data.country)).attr("transform", (d) => `translate(${d.y},${d.x})`).attr("r", 4),
        (update) => update.transition().duration(1e3).attr("transform", (d) => `translate(${d.y},${d.x})`).attr("r", 4),
        (exit) => exit.remove()
      );
      svg.append("g").selectAll("text").data(root.value.leaves()).join("text").attr("dy", "3px").attr("dx", "6px").attr("transform", (d) => `translate(${d.y},${d.x})`).text((d) => d.data.name.replace(/'/g, "")).attr("font-size", "6px").attr("text-anchor", "start").attr("text-align");
      const legendGroup = svg.append("g").attr("class", "legend").attr("transform", `translate(${margin.left + 200}, ${margin.top})`);
      const legendItems = legendGroup.selectAll(".legend-item").data(colorScale.value.domain()).join("g").attr("class", "legend-item").attr("transform", (d, i) => `translate(0, ${i * 20})`);
      legendItems.append("circle").attr("r", 4).attr("stroke", "currentColor").attr("stroke-width", 0.5).attr("filter", (d) => `drop-shadow(0 0 6px ${colorScale.value(d)})`).attr("fill", colorScale.value);
      legendItems.append("text").attr("x", 8).attr("y", 1).attr("text-anchor", "start").attr("alignment-baseline", "middle").attr("fill", "currentColor").attr("font-size", "12px").text((d) => d);
    }
    onMounted(() => {
      svg = d3.select("svg").attr("viewBox", [0, 0, width, height]).append("g").attr("transform", `translate(${margin.left - 200}, ${margin.top})`);
    });
    watchEffect(() => {
      if (dataset.value) {
        makeFigure();
      }
    });
    fetchData();
    async function fetchData() {
      const file = await fetch("/data/nipah_whole_genome_phylo.tre");
      const csv = await file.text();
      dataset.value = parseNewick(csv);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240519_d3_phylotreeRight.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
