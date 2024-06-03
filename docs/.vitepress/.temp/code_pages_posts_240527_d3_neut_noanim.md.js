import { useSSRContext, ref, onMounted, resolveComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
const __pageData = JSON.parse('{"title":"Neutralization curve no animation","description":"","frontmatter":{"layout":"doc","title":"Neutralization curve no animation","aside":false,"date":"2024-05-27T00:00:00.000Z","keywords":["D3"],"subtext":"Make a static neut curve plotted with D3","thumbnail":"/thumbnails/d3_neutCurve_static.png"},"headers":[],"relativePath":"code_pages/posts/240527_d3_neut_noanim.md","filePath":"code_pages/posts/240527_d3_neut_noanim.md"}');
const __default__ = { name: "code_pages/posts/240527_d3_neut_noanim.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    const dataFile = "/data/ephrin_neutcurve_df.csv";
    ref(null);
    const dataset = ref(null);
    const width = 500;
    const height = 300;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 40;
    const marginLeft = 40;
    function formatFile(data) {
      return data.map((d) => ({
        serum: d.serum,
        measurement: +d3.format(".6f")(d.measurement),
        concentration: +d3.format(".8f")(d.concentration),
        fit: +d3.format(".8f")(d.fit),
        upper: +d3.format(".8f")(d.upper),
        lower: +d3.format(".8f")(d.lower)
      })).filter((d) => !isNaN(d.concentration) && !isNaN(d.fit));
    }
    function createSvg() {
      const svg = d3.select("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", [0, 0, width, height]);
      return svg;
    }
    function makePlot(svg) {
      const serumGroups = d3.group(dataset.value, (d) => d.serum);
      const serumDomain = Array.from(serumGroups.keys());
      const innerWidth = width - marginLeft - marginRight;
      const innerHeight = height - marginTop - marginBottom;
      const bounds = svg.append("g").attr("transform", `translate(${marginLeft}, ${marginTop})`);
      const colorScale = d3.scaleOrdinal().domain(serumDomain).range(d3.schemeTableau10);
      const xScale = d3.scaleLog().base(10).domain(d3.extent(dataset.value, (d) => d.concentration)).range([0, innerWidth]).nice();
      const yScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]).nice();
      bounds.selectAll("path").data(serumGroups).enter().append("path").attr("fill", "none").attr("stroke", ([serum]) => colorScale(serum)).attr("stroke-width", 1.5).attr("d", ([, group]) => {
        return d3.line().x((d) => xScale(d.concentration)).y((d) => yScale(d.fit))(group);
      });
      bounds.selectAll("circle").data(dataset.value.filter((d) => d.measurement)).enter().append("circle").attr("fill", (d) => colorScale(d.serum)).attr("cx", (d) => xScale(d.concentration)).attr("cy", (d) => yScale(d.measurement)).attr("r", 4);
      bounds.selectAll(".error-line").data(dataset.value.filter((d) => d.measurement && d.lower && d.upper)).enter().append("line").attr("class", "error-line").attr("x1", (d) => xScale(d.concentration)).attr("y1", (d) => yScale(d.lower)).attr("x2", (d) => xScale(d.concentration)).attr("y2", (d) => yScale(d.upper)).attr("stroke", (d) => colorScale(d.serum)).attr("stroke-width", 1.5).style("opacity", 1);
      const xAxisGenerator = d3.axisBottom().scale(xScale).ticks(4).tickFormat((d) => `${d * 1e3}`).tickSizeOuter(0);
      const xAxis = bounds.append("g").call(xAxisGenerator).attr("transform", `translate(0, ${innerHeight})`);
      xAxis.append("text").attr("x", innerWidth / 2).attr("y", marginBottom - 5).attr("fill", "currentColor").attr("font-size", "12px").html("Concentration (nM)");
      const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4).tickFormat((d) => `${d * 100}`);
      bounds.append("g").call(yAxisGenerator).attr("transform", `translate(0,0)`);
      bounds.append("text").attr("transform", "rotate(-90)").attr("x", -innerHeight / 2).attr("y", -marginLeft + 10).attr("fill", "currentColor").attr("font-size", "12px").attr("text-anchor", "middle").html("Infectivity (%)");
      const legend = svg.append("g").attr("class", "legend").attr("transform", `translate(${width - marginRight - 120}, ${marginTop + 40})`);
      const legendItems = legend.selectAll(".legend-item").data(serumDomain).join("g").attr("class", "legend-item").attr("transform", (d, i) => `translate(0, ${(i + 10) * 14})`);
      legendItems.append("circle").attr("cx", 0).attr("cy", -45).attr("r", 4).attr("fill", (d) => colorScale(d));
      legendItems.append("text").attr("class", "text").attr("x", 6).attr("y", -42).attr("fill", "currentColor").attr("text-anchor", "start").attr("font-size", 10).text((d) => d);
    }
    const fetchData = async () => {
      try {
        const response = await fetch(dataFile);
        const result = await response.text();
        const csv = d3.csvParse(result);
        dataset.value = formatFile(csv);
        const svg = createSvg();
        makePlot(svg);
      } catch (error) {
        console.error(error);
      }
    };
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240527_d3_neut_noanim.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
