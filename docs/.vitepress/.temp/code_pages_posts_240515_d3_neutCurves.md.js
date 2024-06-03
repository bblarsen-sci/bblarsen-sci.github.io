import { useSSRContext, ref, computed, onMounted, resolveComponent, withCtx, createTextVNode, toDisplayString, createVNode } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import * as d3 from "d3";
const __pageData = JSON.parse('{"title":"Animated neutralization curves","description":"","frontmatter":{"layout":"doc","title":"Animated neutralization curves","aside":false,"date":"2024-05-15T00:00:00.000Z","keywords":["D3"],"subtext":"Transitioning lines and circles with error bars showing neutralization of pseudovirus with soluble receptors","thumbnail":"/thumbnails/d3_neutCurves.png"},"headers":[],"relativePath":"code_pages/posts/240515_d3_neutCurves.md","filePath":"code_pages/posts/240515_d3_neutCurves.md"}');
const __default__ = { name: "code_pages/posts/240515_d3_neutCurves.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    const svgContainer = ref(null);
    const dataset = ref(null);
    const width = 600;
    const height = 400;
    const marginTop = 50;
    const marginRight = 10;
    const marginBottom = 40;
    const marginLeft = 50;
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
    const x = computed(() => {
      return d3.scaleLog().base(10).domain([d3.min(dataset.value, (d) => d.concentration), d3.max(dataset.value, (d) => d.concentration)]).range([marginLeft, width - marginRight]);
    });
    const y = computed(() => {
      return d3.scaleLinear().domain([0, 1]).range([height - marginBottom, marginTop]);
    });
    function createSvg() {
      const svg = d3.select(svgContainer.value).append("svg").attr("width", width).attr("height", height).attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", [0, 0, width, height]);
      return svg;
    }
    function makePlot(svg) {
      const g = svg.append("g");
      const serumGroups = d3.group(dataset.value, (d) => d.serum);
      const serumDomain = Array.from(serumGroups.keys());
      const colorScale = d3.scaleOrdinal().domain(serumDomain).range(d3.schemeCategory10);
      const duration = 3e3;
      const pauseDuration = 5e3;
      function drawLines() {
        const lines = g.selectAll("path").data(serumGroups).join("path").attr("fill", "none").attr("stroke", ([serum]) => colorScale(serum)).attr("stroke-width", 1.5).attr("d", ([, group]) => {
          return d3.line().x((d) => x.value(d.concentration)).y((d) => y.value(d.fit))(group);
        }).attr("stroke-dasharray", function() {
          return this.getTotalLength();
        }).attr("stroke-dashoffset", function() {
          return this.getTotalLength();
        });
        lines.transition().duration(duration).ease(d3.easeCubicInOut).attr("stroke-dashoffset", 0);
      }
      function drawCircles() {
        const circles = g.selectAll("circle").data(dataset.value).join("circle").attr("fill", (d) => colorScale(d.serum)).attr("cx", (d) => x.value(d.concentration)).attr("cy", (d) => y.value(d.measurement)).attr("r", 4).style("opacity", 0);
        circles.transition().duration(duration).ease(d3.easeCubicInOut).style("opacity", (d) => d.measurement ? 1 : 0).delay((d, i) => i * (duration / dataset.value.length / 2));
      }
      function drawErrorLines() {
        const errorLines = g.selectAll(".error-line").data(dataset.value.filter((d) => d.measurement && d.lower && d.upper)).join("line").attr("class", "error-line").attr("x1", (d) => x.value(d.concentration)).attr("y1", (d) => y.value(d.lower)).attr("x2", (d) => x.value(d.concentration)).attr("y2", (d) => y.value(d.upper)).attr("stroke", (d) => colorScale(d.serum)).attr("stroke-width", 1.5).style("opacity", 0);
        errorLines.transition().duration(duration).ease(d3.easeCubicInOut).style("opacity", 1).delay((d, i) => i * (duration / dataset.value.length));
      }
      function animateLoop() {
        drawLines();
        drawCircles();
        drawErrorLines();
        setTimeout(() => {
          g.selectAll("path").remove();
          g.selectAll("circle").remove();
          g.selectAll(".error-line").remove();
          setTimeout(animateLoop, 10);
        }, duration + pauseDuration);
      }
      animateLoop();
      g.append("g").attr("transform", `translate(0,${height - marginBottom})`).call(d3.axisBottom(x.value).ticks(4, ".0e").tickSizeOuter(0)).call((d) => d.select(".domain").remove()).call((d) => d.selectAll(".tick text").attr("font-size", "12px")).call((g2) => g2.append("text").attr("x", width / 2).attr("y", marginBottom - 2).attr("fill", "currentColor").attr("font-size", "14px").attr("text-anchor", "middle").text("Concentration (µM)"));
      g.append("g").attr("transform", `translate(${marginLeft},0)`).call(d3.axisLeft(y.value).ticks(3).tickFormat((d) => `${d * 100}`)).call((d) => d.select(".domain").remove()).call((d) => d.selectAll(".tick text").attr("font-size", "12px")).call((d) => d.append("text").attr("transform", "rotate(-90)").attr("x", -height / 2).attr("y", -marginLeft + 15).attr("fill", "currentColor").attr("font-size", "14px").attr("text-anchor", "middle").text("Infectivity (%)"));
      const legend = svg.append("g").attr("class", "legend").attr("transform", `translate(${width - marginRight - 120}, ${marginTop})`);
      const legendItems = legend.selectAll(".legend-item").data(serumDomain).join("g").attr("class", "legend-item").attr("transform", (d, i) => `translate(0, ${i * 20})`);
      legendItems.append("circle").attr("cx", 0).attr("cy", -45).attr("r", 4).attr("fill", (d) => colorScale(d));
      legendItems.append("text").attr("x", 6).attr("y", -42).attr("fill", "currentColor").attr("text-anchor", "start").attr("font-size", "10px").text((d) => d);
    }
    const fetchData = async () => {
      try {
        const response = await fetch("/data/ephrin_neutcurve_df.csv");
        const result = await response.text();
        const csv = d3.csvParse(result);
        dataset.value = await formatFile(csv);
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
            _push2(`<div class="flex flex-col items-center"${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", {
                class: "flex flex-col items-center",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/posts/240515_d3_neutCurves.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
