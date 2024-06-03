import { useSSRContext, ref, watch, onMounted, resolveComponent, withCtx, createTextVNode, toDisplayString, createVNode } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
import { useResizeObserver } from "@vueuse/core";
const __pageData = JSON.parse('{"title":"Responsive breakpoints","description":"","frontmatter":{"layout":"doc","title":"Responsive breakpoints","aside":false,"date":"2024-05-24T00:00:00.000Z","keywords":["D3"],"subtext":"Test using vue dimension watchers rather than viewbox to responsively adjust plot size","thumbnail":"/thumbnails/responsive.png"},"headers":[],"relativePath":"code_pages/posts/240524_d3_responsive.md","filePath":"code_pages/posts/240524_d3_responsive.md"}');
const __default__ = { name: "code_pages/posts/240524_d3_responsive.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    const svgContainer = ref(null);
    const bigContainer = ref(null);
    const dimensions = ref({
      width: 0,
      height: 0,
      margin: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 40
      }
    });
    let wrapper;
    const data = [
      { x: 10, y: 20 },
      { x: 40, y: 90 },
      { x: 80, y: 50 },
      { x: 160, y: 100 },
      { x: 200, y: 150 }
    ];
    useResizeObserver(bigContainer, (entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      console.log("width", width, "height", height);
      dimensions.value.width = width * 0.8;
      dimensions.value.height = height * 0.8;
    });
    watch(
      () => [dimensions.value.width, dimensions.value.height],
      () => {
        makePlot();
      }
    );
    onMounted(() => {
      makePlot();
    });
    function makePlot() {
      if (!data) {
        return;
      }
      if (wrapper !== void 0) {
        wrapper.remove();
      }
      const innerWidth = dimensions.value.width - dimensions.value.margin.left - dimensions.value.margin.right;
      const innerHeight = dimensions.value.height - dimensions.value.margin.top - dimensions.value.margin.bottom;
      const xAccessor = (d) => d.x;
      const yAccessor = (d) => d.y;
      const colorAccessor = (d) => d.x;
      const colorScale = d3.scaleLinear().domain(d3.extent(data, colorAccessor)).range(["skyblue", "darkslategrey"]);
      wrapper = d3.select(svgContainer.value).append("svg").attr("width", dimensions.value.width).attr("height", dimensions.value.height);
      const bounds = wrapper.append("g").attr("transform", `translate(${dimensions.value.margin.left}, ${dimensions.value.margin.top})`);
      const xScale = d3.scaleLinear().domain(d3.extent(data, xAccessor)).range([0, innerWidth]).nice();
      const yScale = d3.scaleLinear().domain(d3.extent(data, yAccessor)).range([innerHeight, 0]).nice();
      bounds.selectAll("circle").data(data).enter().append("circle").attr("cx", (d) => xScale(xAccessor(d))).attr("cy", (d) => yScale(yAccessor(d))).attr("r", 10).attr("fill", (d) => colorScale(colorAccessor(d)));
      const yAxisGenerator = d3.axisLeft().scale(yScale);
      const yAxis = bounds.append("g").call(yAxisGenerator);
      const xAxisGenerator = d3.axisBottom().scale(xScale);
      const xAxis = bounds.append("g").call(xAxisGenerator).attr("transform", `translate(0, ${innerHeight})`);
      xAxis.append("text").attr("x", innerWidth / 2).attr("y", dimensions.value.margin.bottom - 10).attr("fill", "black").style("font-size", "1.4em").html("Dew point (&deg;F)");
      yAxis.append("text").attr("x", -innerHeight / 2).attr("y", -dimensions.value.margin.left + 10).attr("transform", "rotate(-90)").attr("fill", "black").style("font-size", "1.4em").html("Temp (&deg;F)");
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
            _push2(`<div class="container h-screen w-screen mx-auto"${_scopeId}><div${_scopeId}></div></div>`);
          } else {
            return [
              createVNode("div", {
                ref_key: "bigContainer",
                ref: bigContainer,
                class: "container h-screen w-screen mx-auto"
              }, [
                createVNode("div", {
                  ref_key: "svgContainer",
                  ref: svgContainer
                }, null, 512)
              ], 512)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240524_d3_responsive.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
