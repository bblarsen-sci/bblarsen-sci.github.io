import { useSSRContext, ref, onMounted, watch, resolveComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, withDirectives, createVNode, Fragment, renderList, vModelSelect } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import * as d3 from "d3";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Steamgraph","description":"","frontmatter":{"layout":"doc","title":"Steamgraph","aside":false,"date":"2024-05-21T00:00:00.000Z","keywords":["D3"],"subtext":"Make an animated steamgraph with color selections","thumbnail":"/thumbnails/steamgraph.png"},"headers":[],"relativePath":"code_pages/posts/240521_d3_steamgraph.md","filePath":"code_pages/posts/240521_d3_steamgraph.md"}');
const __default__ = { name: "code_pages/posts/240521_d3_steamgraph.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const colorValue = ref("interpolateBlues");
    const colorOptions = ["interpolateBlues", "interpolateViridis", "interpolateMagma", "interpolateYlOrRd", "interpolateSpectral"];
    const n = 20;
    const m = 500;
    const k = 10;
    const width = 928;
    const height = 300;
    let svg;
    let area;
    let stack;
    let y;
    let z;
    function createSvg() {
      svg = d3.select("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", [0, 0, width, height]);
    }
    function bumps(m2, k2) {
      function bump(a2, n2) {
        const x = 1 / (0.1 + Math.random());
        const y2 = 2 * Math.random() - 0.5;
        const z2 = 10 / (0.1 + Math.random());
        for (let i = 0; i < n2; ++i) {
          const w = (i / n2 - y2) * z2;
          a2[i] += x * Math.exp(-w * w);
        }
      }
      const a = [];
      for (let i = 0; i < m2; ++i)
        a[i] = 0;
      for (let i = 0; i < k2; ++i)
        bump(a, m2);
      return a;
    }
    function randomize(stack2, y2, bumps2) {
      const layers = stack2(d3.transpose(Array.from({ length: n }, () => bumps2(m, k))));
      y2.domain([
        d3.min(layers, (l) => d3.min(l, (d) => d[0])),
        d3.max(layers, (l) => d3.max(l, (d) => d[1]))
      ]);
      return layers;
    }
    function updateChart() {
      const transition = svg.transition().duration(1e3).ease(d3.easeLinear);
      const path = svg.selectAll("path").data(randomize(stack, y, bumps));
      path.enter().append("path").merge(path).transition(transition).attr("fill", (d, i) => z(i / n)).attr("d", area);
      path.exit().remove();
      setTimeout(() => {
        updateChart();
      }, 2e3);
    }
    function initChart() {
      const x = d3.scaleLinear([0, m - 1], [0, width]);
      y = d3.scaleLinear([0, 1], [height, 0]);
      area = d3.area().x((d, i) => x(i)).y0((d) => y(d[0])).y1((d) => y(d[1]));
      stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetWiggle).order(d3.stackOrderNone);
      z = d3[colorValue.value];
    }
    onMounted(() => {
      createSvg();
      initChart();
      updateChart();
    });
    watch(colorValue, (newValue) => {
      z = d3[newValue];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FigureTitle = resolveComponent("FigureTitle");
      const _component_SubtitleHeader = resolveComponent("SubtitleHeader");
      const _component_D3PlotContainer = resolveComponent("D3PlotContainer");
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-cc3fa235>`);
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
      _push(ssrRenderComponent(_component_D3PlotContainer, { class: "max-w-screen-2xl" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg data-v-cc3fa235${_scopeId}></svg><select class="mt-10" data-v-cc3fa235${_scopeId}><!--[-->`);
            ssrRenderList(colorOptions, (color) => {
              _push2(`<option data-v-cc3fa235${_scopeId}>${ssrInterpolate(color)}</option>`);
            });
            _push2(`<!--]--></select>`);
          } else {
            return [
              (openBlock(), createBlock("svg")),
              withDirectives(createVNode("select", {
                class: "mt-10",
                "onUpdate:modelValue": ($event) => colorValue.value = $event
              }, [
                (openBlock(), createBlock(Fragment, null, renderList(colorOptions, (color) => {
                  return createVNode("option", null, toDisplayString(color), 1);
                }), 64))
              ], 8, ["onUpdate:modelValue"]), [
                [vModelSelect, colorValue.value]
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240521_d3_steamgraph.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _240521_d3_steamgraph = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cc3fa235"]]);
export {
  __pageData,
  _240521_d3_steamgraph as default
};
