import { useSSRContext, onMounted, resolveComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
const __pageData = JSON.parse('{"title":"Zoom and animations","description":"","frontmatter":{"layout":"doc","title":"Zoom and animations","aside":false,"date":"2024-05-17T00:00:00.000Z","keywords":["D3"],"subtext":"Testing different zoom animations on a hypothetical mutant plasmid library","thumbnail":"/thumbnails/plasmidZoom.jpg"},"headers":[],"relativePath":"code_pages/posts/240517_d3_plasmid_DMS.md","filePath":"code_pages/posts/240517_d3_plasmid_DMS.md"}');
const __default__ = { name: "code_pages/posts/240517_d3_plasmid_DMS.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    onMounted(() => {
      const width = 500;
      const height = 500;
      const svg = d3.select("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", [0, 0, width, height]);
      const g = svg.append("g");
      const arcData = [];
      function generateArcs(numArcs) {
        const rows = Math.floor(Math.sqrt(numArcs));
        const cols = Math.ceil(numArcs / rows);
        const xSpacing = width / (cols + 1);
        const ySpacing = height / (rows + 1);
        const aminoAcids = ["A", "R", "N", "D", "C", "Q", "E", "G", "H", "I", "L", "K", "M", "F", "P", "S", "T", "W", "Y", "V"];
        let count = 0;
        for (let i = 1; i <= rows; i++) {
          for (let j = 1; j <= cols; j++) {
            if (count >= numArcs)
              break;
            const x = j * xSpacing;
            const y = i * ySpacing;
            g.append("path").attr("transform", `translate(${x},${y})`).attr("fill", "currentColor").attr("d", d3.arc()({
              innerRadius: 10,
              outerRadius: 7,
              startAngle: -Math.PI,
              endAngle: Math.PI
            }));
            const randomColor = d3.interpolateSpectral(d3.randomUniform()(0, 1));
            const arcGroup = g.append("g").attr("transform", `translate(${x},${y})`);
            arcGroup.append("path").attr("fill", randomColor).attr("d", d3.arc()({
              innerRadius: 11,
              outerRadius: 6,
              startAngle: -Math.PI / 3,
              endAngle: Math.PI / 3
            }));
            const randomNumber = Math.floor(Math.random() * 476) + 25;
            const randomAminoAcid1 = aminoAcids[Math.floor(Math.random() * aminoAcids.length)];
            let randomAminoAcid2 = aminoAcids[Math.floor(Math.random() * aminoAcids.length)];
            while (randomAminoAcid2 === randomAminoAcid1) {
              randomAminoAcid2 = aminoAcids[Math.floor(Math.random() * aminoAcids.length)];
            }
            const randomText = `${randomAminoAcid1}${randomNumber}${randomAminoAcid2}`;
            arcGroup.append("text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-size", "4px").attr("fill", "currentColor").text(randomText);
            arcData.push([x, y, 30]);
            count++;
          }
        }
      }
      generateArcs(400);
      let currentTransform = [width / 2, height / 2, height];
      function transition() {
        const d = arcData[Math.floor(Math.random() * arcData.length)];
        const i = d3.interpolateZoom(currentTransform, [...d, d[2] * 10 + 1]);
        g.transition().delay(250).duration(i.duration).attrTween("transform", () => (t) => transform(currentTransform = i(t))).on("end", () => {
          const initialView = [width / 2, height / 2, height];
          const j = d3.interpolateZoom(currentTransform, initialView);
          g.transition().delay(1e3).duration(j.duration).attrTween("transform", () => (t) => transform(currentTransform = j(t))).on("end", () => {
            setTimeout(transition, 2e3);
          });
        });
      }
      function transform([x, y, r]) {
        return `
      translate(${width / 2}, ${height / 2})
      scale(${height / r})
      translate(${-x}, ${-y})
    `;
      }
      transition();
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240517_d3_plasmid_DMS.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
