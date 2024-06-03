import { useSSRContext, ref, onMounted, resolveComponent, withCtx, createTextVNode, toDisplayString, createVNode } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
const __pageData = JSON.parse('{"title":"Animated lines","description":"","frontmatter":{"layout":"doc","title":"Animated lines","aside":false,"date":"2024-05-22T00:00:00.000Z","keywords":["D3"],"subtext":"Moving red/blue lines with gradient applied on y-axis","thumbnail":"/thumbnails/d3_lines_redblue.png"},"headers":[],"relativePath":"code_pages/posts/240522_d3_linesAnimationRedBlue.md","filePath":"code_pages/posts/240522_d3_linesAnimationRedBlue.md"}');
const __default__ = { name: "code_pages/posts/240522_d3_linesAnimationRedBlue.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    const svgContainer = ref(null);
    const width = 1e3;
    const height = 250;
    function generateData(start, stop, numPoints) {
      const step = (stop - start) / (numPoints - 1);
      return Array.from({ length: numPoints }, (_, i) => ({
        x: start + i * step,
        y: height / 2
      }));
    }
    generateData(0, width, 3);
    const numLines = 10;
    let datasets = Array.from({ length: numLines }, () => generateData(0, width, 10));
    const x = d3.scaleLinear().domain([0, width]).range([0, width]);
    const y = d3.scaleLinear().domain([0, height]).range([height, 0]);
    function generateRandomCoordinates() {
      return datasets.map((data) => {
        const newData = [...data];
        for (let i = 1; i < data.length - 1; i += 1) {
          newData[i] = {
            ...newData[i],
            y: Math.random() * height
          };
        }
        return newData;
      });
    }
    function createSvg() {
      const svg = d3.select(svgContainer.value).append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", [0, 0, width, height]);
      const defs = svg.append("defs");
      const colorSchemes = [
        d3.interpolateBlues,
        d3.interpolateReds
      ];
      colorSchemes.forEach((scheme, i) => {
        const gradient = defs.append("linearGradient").attr("id", `lineGradient-${i}`).attr("gradientUnits", "userSpaceOnUse").attr("x1", 0).attr("y1", y(0)).attr("x2", 0).attr("y2", y(height));
        const color = d3.scaleSequential().domain([0, height]).interpolator(scheme);
        gradient.selectAll("stop").data(color.ticks().map((t, i2, n) => ({ offset: `${100 * i2 / (n.length - 1)}%`, color: color(t) }))).enter().append("stop").attr("offset", (d) => d.offset).attr("stop-color", (d) => d.color);
      });
      return svg;
    }
    function updatePath(svg) {
      svg.selectAll("path").data(datasets).join(
        (enter) => enter.append("path").attr("mix-blend-mode", "multiply").attr("fill", "none").attr("stroke", (d, i) => `url(#lineGradient-${i})`).attr("stroke-width", 1.5).attr("opacity", 1).attr("d", d3.line().curve(d3.curveBasis).x((d) => x(d.x)).y((d) => y(d.y))),
        (update) => update.transition().duration(3e3).ease(d3.easeLinear).attr("d", d3.line().curve(d3.curveBasis).x((d) => x(d.x)).y((d) => y(d.y))),
        (exit) => exit.remove()
      );
    }
    onMounted(() => {
      const svg = createSvg();
      updatePath(svg);
      setInterval(() => {
        datasets = generateRandomCoordinates();
        updatePath(svg);
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
            _push2(`<div class=""${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", {
                class: "",
                ref_key: "svgContainer",
                ref: svgContainer
              }, null, 512)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240522_d3_linesAnimationRedBlue.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
