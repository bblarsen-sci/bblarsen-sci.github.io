import { useSSRContext, ref, computed, watch, resolveComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
const __pageData = JSON.parse('{"title":"Hierarchial data","description":"","frontmatter":{"title":"Hierarchial data","aside":false,"date":"2024-04-30T00:00:00.000Z","keywords":["D3"],"subtext":"Convert a .csv into a hierarchy using D3","thumbnail":"/thumbnails/d3_hierarchy.png"},"headers":[],"relativePath":"code_pages/posts/240430_d3_hierarchy.md","filePath":"code_pages/posts/240430_d3_hierarchy.md"}');
const __default__ = { name: "code_pages/posts/240430_d3_hierarchy.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    const root = ref(null);
    const width = 500;
    const dx = 6;
    const dataFile = "https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv";
    const colorScale = computed(() => {
      return d3.scaleDiverging().domain([-4, 0, 2]).interpolator(d3.interpolateRdBu);
    });
    function makePlot() {
      const dy = width / (root.value.height + 1);
      const tree = d3.tree().nodeSize([dx, dy]);
      root.value.sort((a, b) => d3.ascending(a.data.name, b.data.name));
      tree(root.value);
      let x0 = Infinity;
      let x1 = -x0;
      root.value.each((d) => {
        if (d.x > x1)
          x1 = d.x;
        if (d.x < x0)
          x0 = d.x;
      });
      const height = x1 - x0 + dx * 2;
      const svg = d3.select("svg").attr("width", width).attr("height", height).attr("viewBox", [-dy / 3, x0 - dx, width, height]);
      svg.append("g").attr("fill", "none").attr("stroke", "currentColor").attr("stroke-opacity", 0.3).attr("stroke-width", 1.5).selectAll().data(root.value.links()).join("path").attr("d", d3.linkHorizontal().x((d) => d.y).y((d) => d.x));
      const node = svg.append("g").attr("stroke-linejoin", "round").attr("stroke-width", 3).selectAll().data(root.value.descendants()).join("g").attr("transform", (d) => `translate(${d.y},${d.x})`);
      node.append("circle").attr("fill", (d) => {
        if (d.depth === 3) {
          return colorScale.value(d.data.entry);
        }
        return "currentColor";
      }).attr("r", 5);
      node.append("text").attr("dy", "0.31em").attr("fill", "currentColor").attr("x", (d) => d.children ? -10 : 22).attr("text-anchor", (d) => d.children ? "end" : "middle").attr("font-size", "12px").text((d) => {
        if (d.depth === 0) {
          return "Sites";
        } else if (d.depth === 1) {
          return d.data[0];
        } else if (d.depth === 2) {
          return d.data[0];
        } else if (d.depth === 3) {
          return d3.format(".1f")(parseFloat(d.data.entry));
        }
      });
    }
    async function fetchData() {
      const csv = await d3.csv(dataFile);
      const array = csv.map((d) => ({
        site: +d.site,
        wildtype: d.wildtype,
        mutant: d.mutant,
        entry: +d.entry_CHO_bEFNB3
      }));
      const filteredArray = array.filter((d) => d.site <= 73);
      const group = d3.group(filteredArray, (d) => d.site, (d) => d.mutant);
      const test = d3.hierarchy(group);
      Array.from(group, ([site, mutants]) => [
        site,
        Array.from(mutants, ([mutant, entries]) => ({
          mutant,
          entry: entries[0].entry
        }))
      ]);
      root.value = test;
    }
    fetchData();
    watch(root, () => {
      makePlot();
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240430_d3_hierarchy.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
