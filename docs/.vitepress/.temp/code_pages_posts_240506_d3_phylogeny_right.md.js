import { useSSRContext, ref, computed, onMounted, resolveComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
import { s as scaleBranchLengths, d as diagonal, p as parseNewick } from "./treeUtilities.BKqfN_26.js";
const __pageData = JSON.parse('{"title":"Phylogeny linear","description":"","frontmatter":{"layout":"doc","title":"Phylogeny linear","aside":false,"date":"2024-05-06T00:00:00.000Z","keywords":["D3"],"subtext":"Nipah phylogeny that is linear and has scaled branch lengths","thumbnail":"/thumbnails/phylogeny_right.png"},"headers":[],"relativePath":"code_pages/posts/240506_d3_phylogeny_right.md","filePath":"code_pages/posts/240506_d3_phylogeny_right.md"}');
const __default__ = { name: "code_pages/posts/240506_d3_phylogeny_right.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    const data = ref(null);
    const root = computed(
      () => d3.hierarchy(data.value, (d) => d.branchset).sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id)).sum((d) => d.branchLength || 0)
    );
    const tree = computed(
      () => d3.cluster().size([height - margin.top - margin.bottom, width - margin.right - margin.left]).separation(function separation(a, b) {
        return a.parent == b.parent ? 1 : 1;
      })
    );
    const countries = computed(
      () => Array.from(new Set(root.value.descendants().map((d) => d.data.country))).filter(Boolean)
    );
    const colorScale = computed(
      () => d3.scaleOrdinal().domain(countries.value).range(d3.schemeCategory10)
    );
    const legend = (svg) => {
      const g = svg.selectAll("g").attr("class", "legend").data(colorScale.value.domain()).join("g").attr("transform", (d, i) => `translate(${margin.left + 100}, ${i * 20})`);
      g.append("circle").attr("class", "legendcircle").attr("r", 4).attr("stroke", "currentColor").attr("fill", colorScale.value);
      g.append("text").attr("class", "legend-text").attr("x", 10).attr("dy", "0.1em").text((d) => d);
    };
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 500;
    const height = 400;
    function drawChart() {
      tree.value(root.value);
      scaleBranchLengths(root.value.descendants(), width - margin.left - margin.right);
      var svg = d3.select("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", [0, 0, width, height]).append("g").attr("transform", `translate(${margin.left - 100}, ${margin.top})`);
      svg.append("g").call(legend);
      svg.append("g").attr("class", "link").selectAll("path").data(root.value.links()).join("path").attr("d", diagonal);
      svg.append("g").selectAll("circle").data(root.value.descendants().filter((d) => !d.children)).join("circle").attr("r", 4).attr("stroke", "currentColor").attr("fill", (d) => colorScale.value(d.data.country)).attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });
    }
    async function fetchData() {
      const file = await fetch("/data/nipah_whole_genome_phylo.tre");
      const csv = await file.text();
      const parsedNewick = parseNewick(csv);
      return parsedNewick;
    }
    onMounted(async () => {
      data.value = await fetchData();
      drawChart();
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240506_d3_phylogeny_right.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
