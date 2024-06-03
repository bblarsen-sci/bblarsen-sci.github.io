import { useSSRContext, ref, onMounted, resolveComponent, withCtx, createTextVNode, toDisplayString, createVNode } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
const __pageData = JSON.parse('{"title":"Radial Phylogeny","description":"","frontmatter":{"title":"Radial Phylogeny","aside":false,"date":"2024-04-28T00:00:00.000Z","keywords":["D3"],"subtext":"Testing making a Nipah Phylogeny","thumbnail":"/thumbnails/d3_phylogeny_radial.png"},"headers":[],"relativePath":"code_pages/posts/240428_d3_phylogeny_radial.md","filePath":"code_pages/posts/240428_d3_phylogeny_radial.md"}');
const __default__ = { name: "code_pages/posts/240428_d3_phylogeny_radial.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    const svgContainer = ref(null);
    function parseNewick(a) {
      for (var e = [], r = {}, s = a.split(/\s*(;|\(|\)|,|:)\s*/), t = 0; t < s.length; t++) {
        var n = s[t];
        switch (n) {
          case "(":
            var c = {};
            r.branchset = [c];
            e.push(r);
            r = c;
            break;
          case ",":
            var c = {};
            e[e.length - 1].branchset.push(c);
            r = c;
            break;
          case ")":
            r = e.pop();
            break;
          case ":":
            break;
          default:
            var h = s[t - 1];
            if (h === ")" || h === "(" || h === ",") {
              const nameAndCountry = n.split(/\[|\]/);
              r.name = nameAndCountry[0];
              r.country = nameAndCountry[1];
            } else if (h === ":") {
              r.length = parseFloat(n);
            }
        }
      }
      return r;
    }
    function drawChart(data) {
      const width = 800;
      const outerRadius = width / 2;
      const innerRadius = outerRadius - 120;
      const root = d3.hierarchy(data, (d) => d.branchset).sum((d) => d.branchset ? 0 : 1).sort((a, b) => a.value - b.value || d3.ascending(a.data.length, b.data.length));
      var cluster = d3.cluster().size([360, innerRadius]).separation((a, b) => 1);
      function maxLength(d) {
        return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0);
      }
      function setRadius(d, y0, k) {
        d.radius = (y0 += d.data.length) * k;
        if (d.children)
          d.children.forEach((d2) => setRadius(d2, y0, k));
      }
      function linkStep(startAngle, startRadius, endAngle, endRadius) {
        const c0 = Math.cos(startAngle = (startAngle - 90) / 180 * Math.PI);
        const s0 = Math.sin(startAngle);
        const c1 = Math.cos(endAngle = (endAngle - 90) / 180 * Math.PI);
        const s1 = Math.sin(endAngle);
        return "M" + startRadius * c0 + "," + startRadius * s0 + (endAngle === startAngle ? "" : "A" + startRadius + "," + startRadius + " 0 0 " + (endAngle > startAngle ? 1 : 0) + " " + startRadius * c1 + "," + startRadius * s1) + "L" + endRadius * c1 + "," + endRadius * s1;
      }
      function linkConstant(d) {
        return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
      }
      cluster(root);
      setRadius(root, root.data.length = 0, innerRadius / maxLength(root));
      const svg = d3.select(svgContainer.value).append("svg").attr("viewBox", [-outerRadius, -outerRadius, width, width]).attr("class", "max-w-full h-auto");
      svg.append("g").attr("class", "stroke").attr("fill", "none").selectAll("path").data(root.links()).join("path").attr("d", linkConstant).attr("stroke-width", 1.5);
      svg.append("g").selectAll("circle").data(root.leaves()).join("circle").attr("transform", (d) => `rotate(${d.x - 90}) translate(${innerRadius + 4},0)`).attr("r", 6).attr("class", "circle").attr("fill", (d) => {
        const countryColors2 = {
          "India": "#ff7f0e",
          "Bangladesh": "#1f77b4",
          "Malaysia": "#2ca02c",
          "Cambodia": "#d62728",
          "Thailand": "#9467bd"
        };
        return countryColors2[d.data.country] || "black";
      });
      const countryColors = {
        "India": "#ff7f0e",
        "Bangladesh": "#1f77b4",
        "Malaysia": "#2ca02c",
        "Cambodia": "#d62728",
        "Thailand": "#9467bd"
      };
      const legend = svg.append("g").attr("class", "legend").attr("transform", `translate(${outerRadius - 750}, ${-outerRadius + 90})`);
      const legendItems = legend.selectAll(".legend-item").data(Object.entries(countryColors)).enter().append("g").attr("class", "legend-item").attr("transform", (d, i) => `translate(0, ${i * 20})`);
      legendItems.append("circle").attr("r", 6).attr("fill", (d) => d[1]).attr("class", "circle");
      legendItems.append("text").attr("class", "legend-text").attr("x", 10).style("fill", "currentColor").attr("y", 6).attr("dy", "0em").text((d) => d[0]);
    }
    async function fetchData() {
      const file = await fetch("/data/nipah_whole_genome_phylo.tre");
      const csv = await file.text();
      const parsedData = parseNewick(csv);
      drawChart(parsedData);
    }
    onMounted(() => {
      fetchData();
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240428_d3_phylogeny_radial.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
