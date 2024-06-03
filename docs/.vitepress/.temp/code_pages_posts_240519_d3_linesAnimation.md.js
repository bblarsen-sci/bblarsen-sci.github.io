import { useSSRContext, ref, onMounted, resolveComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
const __pageData = JSON.parse('{"title":"Lines animation","description":"","frontmatter":{"layout":"doc","title":"Lines animation","aside":false,"date":"2024-05-19T00:00:00.000Z","keywords":["D3"],"subtext":"Animation of points with random y-coordinates with fitted line","thumbnail":"/thumbnails/lines_animation.png"},"headers":[],"relativePath":"code_pages/posts/240519_d3_linesAnimation.md","filePath":"code_pages/posts/240519_d3_linesAnimation.md"}');
const __default__ = { name: "code_pages/posts/240519_d3_linesAnimation.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const width = 300;
    const height = 100;
    const marginTop = 10;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = 10;
    function generateData(start, stop, numPoints) {
      const step = (stop - start) / (numPoints - 1);
      return Array.from({ length: numPoints }, (_, i) => ({
        x: start + i * step,
        y: height / 2
      }));
    }
    let data = generateData(0, width, 10);
    const x = d3.scaleLinear().domain([0, width]).range([marginLeft, width - marginRight - marginLeft]);
    const y = d3.scaleLinear().domain([0, height]).range([height - marginBottom, marginTop]);
    d3.axisLeft(y).tickSizeOuter(0);
    const color = d3.scaleSequential().domain([0, 100]).interpolator(d3.interpolateViridis);
    function generateRandomCoordinates() {
      const newData = [...data];
      for (let i = 1; i < data.length - 1; i++) {
        newData[i] = {
          ...newData[i],
          y: Math.random() * height
        };
      }
      return newData;
    }
    function createSvg() {
      const svg = d3.select("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", [0, 0, width, height]).append("g").attr("transform", `translate(${marginLeft - 10},${marginTop - 10})`);
      return svg;
    }
    function updatePath(svg) {
      svg.selectAll("path").data([data]).join(
        (enter) => enter.append("path").attr("mix-blend-mode", "multiply").attr("fill", "none").attr("stroke", "currentColor").attr("stroke-width", 1.5).attr("d", d3.line().curve(d3.curveBasis).x((d) => x(d.x)).y((d) => y(d.y))),
        (update) => update.transition().duration(1e3).attr("d", d3.line().curve(d3.curveBasis).x((d) => x(d.x)).y((d) => y(d.y))),
        (exit) => exit.remove()
      );
    }
    function updateCircle(svg) {
      svg.selectAll("circle").data(data).join(
        (enter) => enter.append("circle").attr("mix-blend-mode", "multiply").attr("cx", (d) => x(d.x)).attr("cy", (d) => y(d.y)).attr("r", 3).attr("fill", (d) => color(d.y)).attr("stroke", "currentColor"),
        (update) => update.transition().duration(1e3).attr("fill", (d) => color(d.y)).attr("cx", (d) => x(d.x)).attr("cy", (d) => y(d.y)),
        (exit) => exit.remove()
      );
    }
    onMounted(() => {
      const svg = createSvg();
      updatePath(svg);
      updateCircle(svg);
      setInterval(() => {
        data = generateRandomCoordinates();
        updateCircle(svg);
        setTimeout(() => {
          updatePath(svg);
        }, 1e3);
      }, 3e3);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240519_d3_linesAnimation.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
