import { useSSRContext, ref, watchEffect, mergeProps, onMounted, watch, resolveComponent, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import * as d3 from "d3";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _sfc_main$1 = {
  __name: "CustomSlider",
  __ssrInlineRender: true,
  props: {
    id: {
      type: String,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    modelValue: {
      type: Number,
      default: 10
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const { id, min, max, step, modelValue } = __props;
    const emit = __emit;
    const sliderValue = ref(modelValue);
    const slider = ref(null);
    const getProgress = (value, min2, max2) => {
      return (value - min2) / (max2 - min2) * 100;
    };
    const setCSSProgress = (progress) => {
      slider.value.style.setProperty("--ProgressPercent", `${progress}%`);
    };
    watchEffect(() => {
      if (slider.value) {
        emit("update:modelValue", sliderValue.value);
        const progress = getProgress(sliderValue.value, slider.value.min, slider.value.max);
        let extraWidth = (100 - progress) / 10;
        setCSSProgress(progress + extraWidth);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "custom-slider" }, _attrs))} data-v-5116e0d3><input${ssrRenderAttr("value", sliderValue.value)} type="range"${ssrRenderAttr("min", __props.min)}${ssrRenderAttr("max", __props.max)}${ssrRenderAttr("step", __props.step)} class="slider" data-v-5116e0d3></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CustomSlider.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const CustomSlider = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-5116e0d3"]]);
const __pageData = JSON.parse('{"title":"Vue/D3 Slider Test","description":"","frontmatter":{"layout":"doc","title":"Vue/D3 Slider Test","aside":false,"date":"2024-05-17T00:00:00.000Z","keywords":["D3"],"subtext":"Connecting sliders to values to manipulate objects reactively","thumbnail":"/thumbnails/slider_test.png"},"headers":[],"relativePath":"code_pages/posts/240517_d3_reactiveSliders.md","filePath":"code_pages/posts/240517_d3_reactiveSliders.md"}');
const __default__ = { name: "code_pages/posts/240517_d3_reactiveSliders.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    let circle = null;
    const height = 100;
    const width = 300;
    const margin = { top: 10, right: 20, bottom: 30, left: 30 };
    const sliders = ref([
      { label: "Radius", value: 10, min: 5, max: 50 },
      { label: "X-Axis", value: (width - margin.left - margin.right) / 2, min: 0, max: 250 },
      { label: "Y-Axis", value: (height - margin.top - margin.bottom) / 2, min: 0, max: height - margin.top - margin.bottom }
    ]);
    onMounted(() => {
      const svgElement = d3.select("svg").attr("viewBox", `0 0 ${width} ${height}`).append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
      circle = svgElement.append("g").append("circle").attr("cx", sliders.value[1].value).attr("cy", sliders.value[2].value).attr("r", sliders.value[0].value).attr("fill", "steelblue");
    });
    sliders.value.forEach((slider, index) => {
      watch(() => slider.value, (newValue) => {
        if (circle) {
          switch (index) {
            case 0:
              circle.attr("r", newValue);
              break;
            case 1:
              circle.attr("cx", newValue);
              break;
            case 2:
              circle.attr("cy", newValue);
              break;
          }
        }
      });
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
            _push2(`<div class="flex flex-wrap gap-4 justify-evenly pb-10 border-0"${_scopeId}><!--[-->`);
            ssrRenderList(sliders.value, (slider, index) => {
              _push2(`<div${_scopeId}><h3${_scopeId}>${ssrInterpolate(slider.label)}: ${ssrInterpolate(slider.value)}</h3>`);
              _push2(ssrRenderComponent(CustomSlider, {
                min: slider.min,
                max: slider.max,
                modelValue: slider.value,
                "onUpdate:modelValue": ($event) => slider.value = $event
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]--></div><svg${_scopeId}></svg>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-wrap gap-4 justify-evenly pb-10 border-0" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(sliders.value, (slider, index) => {
                  return openBlock(), createBlock("div", { key: index }, [
                    createVNode("h3", null, toDisplayString(slider.label) + ": " + toDisplayString(slider.value), 1),
                    createVNode(CustomSlider, {
                      min: slider.min,
                      max: slider.max,
                      modelValue: slider.value,
                      "onUpdate:modelValue": ($event) => slider.value = $event
                    }, null, 8, ["min", "max", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ]),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240517_d3_reactiveSliders.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
