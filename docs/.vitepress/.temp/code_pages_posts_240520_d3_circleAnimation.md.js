import { useSSRContext, ref, onMounted, resolveComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
const __pageData = JSON.parse('{"title":"Circle animation Test","description":"","frontmatter":{"layout":"doc","title":"Circle animation Test","aside":false,"date":"2024-05-20T00:00:00.000Z","keywords":["D3"],"subtext":"Playing around with D3 animations and transitions","thumbnail":"/thumbnails/circle_animation.png"},"headers":[],"relativePath":"code_pages/posts/240520_d3_circleAnimation.md","filePath":"code_pages/posts/240520_d3_circleAnimation.md"}');
const __default__ = { name: "code_pages/posts/240520_d3_circleAnimation.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const width = 300;
    const height = 100;
    d3.scaleLinear().domain([0, width]).range([0, width]);
    d3.scaleLinear().domain([0, height]).range([0, height]);
    const generateDataset = () => Array(20).fill(0).map(() => [
      d3.randomNormal(width / 2, width / 6)(),
      d3.randomNormal(height / 2, height / 8)()
    ]);
    function createSvg() {
      const svg = d3.select("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", [0, 0, width, height]);
      return svg;
    }
    onMounted(() => {
      const svg = createSvg();
      update(svg);
      setInterval(() => {
        update(svg);
      }, 3e3);
    });
    function update(svg) {
      const data = generateDataset();
      const colorScale = d3.scaleDiverging(d3.interpolateRdBu).domain([0, width / 2, width]);
      svg.selectAll("circle").data(data).join(
        (enter) => enter.append("circle").attr("cx", (d) => d[0]).attr("cy", (d) => d[1]).transition().duration(2e3).ease(d3.easePolyInOut).attr("stroke", "currentColor").style("mix-blend-mode", "multiply").attr("stroke-width", 0.5).attr("r", 5).attr("fill", (d) => colorScale(d[0])),
        (update2) => update2.transition().duration(2e3).ease(d3.easePolyInOut).attr("cx", (d) => d[0]).attr("cy", (d) => d[1]).attr("fill", (d) => colorScale(d[0])),
        (exit) => exit.remove()
      );
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240520_d3_circleAnimation.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
