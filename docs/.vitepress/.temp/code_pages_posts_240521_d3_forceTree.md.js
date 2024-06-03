import { useSSRContext, ref, onMounted, onUnmounted, resolveComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
import { p as parseNewick, s as scaleBranchLengths } from "./treeUtilities.BKqfN_26.js";
const __pageData = JSON.parse('{"title":"Force phylogenetic tree","description":"","frontmatter":{"layout":"doc","title":"Force phylogenetic tree","aside":false,"date":"2024-05-21T00:00:00.000Z","keywords":["D3"],"subtext":"Force phylogenetic tree that is draggable","thumbnail":"/thumbnails/d3_forceTree.png"},"headers":[],"relativePath":"code_pages/posts/240521_d3_forceTree.md","filePath":"code_pages/posts/240521_d3_forceTree.md"}');
const __default__ = { name: "code_pages/posts/240521_d3_forceTree.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const width = 800;
    const height = 600;
    let data = null;
    let svg = null;
    const colorScale = ref(null);
    let simulation = null;
    function createSvg() {
      const svg2 = d3.select("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", [-width / 2, -height / 2, width, height]);
      return svg2;
    }
    function setupTree() {
      const tree = d3.cluster().size([width, height]).separation(function separation(a, b) {
        return a.parent == b.parent ? 1 : 1;
      });
      const root = d3.hierarchy(data, (d) => d.branchset).sum((d) => d.branchLength || 0).sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id));
      tree(root);
      scaleBranchLengths(root.descendants(), width);
      const countries = Array.from(new Set(root.descendants().map((d) => d.data.country))).filter(Boolean);
      colorScale.value = d3.scaleOrdinal().domain(countries).range(d3.schemeCategory10);
      return { root };
    }
    const drag = (simulation2) => {
      function dragstarted(event, d) {
        if (!event.active)
          simulation2.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event, d) {
        if (!event.active)
          simulation2.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
    };
    onMounted(async () => {
      data = await fetchData();
      const { root } = setupTree();
      svg = createSvg();
      const links = root.links();
      const nodes = root.descendants();
      simulation = d3.forceSimulation(nodes).force("link", d3.forceLink(links).id((d) => d.id).distance(0).strength(1)).force("charge", d3.forceManyBody().strength(-50)).force("center", d3.forceCenter().strength(0.6)).force("x", d3.forceX()).force("y", d3.forceY());
      const link = svg.append("g").attr("stroke", "currentColor").attr("stroke-opacity", 0.8).selectAll("line").data(links).join("line");
      const node = svg.append("g").attr("stroke", "currentColor").attr("stroke-width", 1).selectAll("circle").data(nodes.filter((d) => !d.children)).join("circle").attr("fill", (d) => colorScale.value(d.data.country)).attr("stroke", "currentColor").attr("r", 7).call(drag(simulation));
      simulation.on("tick", () => {
        link.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y).attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      });
    });
    onUnmounted(() => {
      if (simulation) {
        simulation.stop();
      }
    });
    async function fetchData() {
      const file = await fetch("/data/nipah_whole_genome_phylo.tre");
      const csv = await file.text();
      const parsedNewick = parseNewick(csv);
      return parsedNewick;
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240521_d3_forceTree.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
