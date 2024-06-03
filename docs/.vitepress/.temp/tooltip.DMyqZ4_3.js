import { useSSRContext, ref, computed, mergeProps } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _sfc_main = {
  __name: "tooltip",
  __ssrInlineRender: true,
  props: {
    data: {
      type: Object,
      default: null
    },
    color: {
      type: String,
      default: "rgba(0, 0, 0, 0.8)"
    }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const visible = ref(false);
    const x = ref(0);
    const y = ref(0);
    const data = ref(props.data);
    const color = ref(props.color);
    const textColor = computed(() => {
      const rgb = color.value.replace(/[^\d,]/g, "").split(",");
      const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1e3;
      return brightness > 128 ? "black" : "white";
    });
    function showTooltip(event) {
      visible.value = true;
      x.value = event.clientX + 10;
      y.value = event.clientY + 10;
    }
    function hideTooltip() {
      visible.value = false;
    }
    __expose({
      showTooltip,
      hideTooltip,
      data,
      color
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "tooltip-wrapper" }, _attrs))} data-v-032b869d>`);
      if (visible.value && data.value) {
        _push(`<div class="tooltip" style="${ssrRenderStyle({ top: `${y.value}px`, left: `${x.value}px`, background: color.value, color: textColor.value })}" data-v-032b869d><p data-v-032b869d>Site: ${ssrInterpolate(data.value.site)}</p><p data-v-032b869d>Wildtype: ${ssrInterpolate(data.value.wildtype)}</p><p data-v-032b869d>Mutant: ${ssrInterpolate(data.value.mutant)}</p><p data-v-032b869d>Effect: ${ssrInterpolate(data.value.effect)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tooltip.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-032b869d"]]);
export {
  Tooltip as T
};
