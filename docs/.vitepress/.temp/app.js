import { useSSRContext, mergeProps, shallowRef, inject, computed, ref, watch, reactive, markRaw, readonly, nextTick, defineComponent, h, resolveComponent, unref, onMounted, watchEffect, onUnmounted, createSSRApp } from "vue";
import * as vega from "vega";
import * as vegaLite from "vega-lite";
import vegaEmbed from "vega-embed";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderSlot, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderClass, renderToString } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
import { useDark } from "@vueuse/core";
async function parseVegaSpecFromHTML(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const scripts = doc.querySelectorAll("script");
  let vegaSpecString = "";
  scripts.forEach((script) => {
    if (script.textContent.includes("var spec =")) {
      vegaSpecString = script.textContent;
    }
  });
  if (!vegaSpecString) {
    throw new Error("Vega spec not found in the HTML document.");
  }
  const specStart = vegaSpecString.indexOf("var spec =") + "var spec =".length;
  const specEnd = vegaSpecString.indexOf("};", specStart) + 1;
  const jsonSubstring = vegaSpecString.substring(specStart, specEnd);
  const trimmedJsonString = jsonSubstring.trim();
  let vegaSpecObject;
  try {
    vegaSpecObject = JSON.parse(trimmedJsonString);
  } catch (error) {
    console.log(trimmedJsonString);
    throw new Error("Error parsing Vega spec JSON: " + error.message);
  }
  return vegaSpecObject;
}
const _sfc_main$d = {
  name: "VegaChart",
  props: {
    specUrl: {
      type: String,
      required: true
    },
    showShadow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isExpanded: false
    };
  },
  mounted() {
    this.loadChart(this.specUrl);
  },
  methods: {
    // Parse and load the chart from the URL
    async loadChart(url) {
      try {
        let spec;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          const htmlContent = await this.fetchLocalFile(url);
          spec = await parseVegaSpecFromHTML(htmlContent);
        } else {
          const urlObj = new URL(url);
          const path = urlObj.pathname;
          const response = await fetch(url);
          if (path.endsWith(".html")) {
            const htmlContent = await response.text();
            spec = await parseVegaSpecFromHTML(htmlContent);
          } else if (path.endsWith(".json")) {
            spec = await response.json();
          } else {
            console.error("Unsupported file format");
            return;
          }
        }
        this.renderChart(spec);
      } catch (error) {
        console.error("Error loading Vega spec:", error);
      }
    },
    // Fetch the text from local files
    async fetchLocalFile(filePath) {
      const response = await fetch(filePath);
      if (!response.ok)
        throw new Error("Failed to fetch local file");
      console.log("response.text()", response);
      return await response.text();
    },
    // Render the chart using VegaEmbed
    renderChart(spec) {
      vegaEmbed(this.$refs.vegaContainer, spec, {
        renderer: "canvas",
        vega,
        vegaLite,
        actions: false
      }).then((result) => {
      }).catch(console.error);
    },
    // Toggle the expanded view
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    }
  }
};
function _sfc_ssrRender$b(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: ["vega-chart-container", { expanded: $data.isExpanded, "no-box-shadow": !$props.showShadow }]
  }, _attrs))}><div></div><button class="expand-btn">`);
  if ($data.isExpanded) {
    _push(`<i class="bi bi-arrows-angle-contract"></i>`);
  } else {
    _push(`<i class="bi bi-arrows-angle-expand"></i>`);
  }
  _push(`</button></div>`);
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/Altair.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const Altair = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["ssrRender", _sfc_ssrRender$b]]);
const _sfc_main$c = {
  props: {
    imageSrc: {
      type: String,
      default: ""
    },
    caption: {
      type: String,
      required: true
    }
  }
};
function _sfc_ssrRender$a(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<p${ssrRenderAttrs(_attrs)} data-v-03a35c10><figure data-v-03a35c10>`);
  if ($props.imageSrc) {
    _push(`<img${ssrRenderAttr("src", $props.imageSrc)}${ssrRenderAttr("alt", $props.caption)} data-v-03a35c10>`);
  } else {
    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  }
  _push(`<figcaption data-v-03a35c10>${ssrInterpolate($props.caption)}</figcaption></figure></p>`);
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/Figure.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const Figure = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["ssrRender", _sfc_ssrRender$a], ["__scopeId", "data-v-03a35c10"]]);
const data = JSON.parse('[{"title":"Scatterplot with selectable DMS data","url":"/code_pages/posts/240527_d3_dataWranglingTest.html","subtext":"Toggle between four types of DMS data in scatterplot","keywords":["D3"],"date":"2024-05-28T00:00:00.000Z","thumbnail":"/thumbnails/data_wrangling.png"},{"title":"Gradient Stripes","url":"/code_pages/posts/240527_d3_stripes.html","subtext":"Map mean DMS data to a diverging color scale using D3.","keywords":["D3"],"date":"2024-05-28T00:00:00.000Z","thumbnail":"/thumbnails/gradientStripes.png"},{"title":"Test different code style","url":"/code_pages/posts/240527_d3_dataWrangling.html","subtext":"Make a basic plot but put syntax logic in vue instead of D3","keywords":["D3"],"date":"2024-05-27T00:00:00.000Z","thumbnail":"/thumbnails/data_wrangling.png"},{"title":"Neutralization curve no animation","url":"/code_pages/posts/240527_d3_neut_noanim.html","subtext":"Make a static neut curve plotted with D3","keywords":["D3"],"date":"2024-05-27T00:00:00.000Z","thumbnail":"/thumbnails/d3_neutCurve_static.png"},{"title":"Responsive breakpoints","url":"/code_pages/posts/240524_d3_responsive.html","subtext":"Test using vue dimension watchers rather than viewbox to responsively adjust plot size","keywords":["D3"],"date":"2024-05-24T00:00:00.000Z","thumbnail":"/thumbnails/responsive.png"},{"title":"Animated lines","url":"/code_pages/posts/240522_d3_linesAnimationRedBlue.html","subtext":"Moving red/blue lines with gradient applied on y-axis","keywords":["D3"],"date":"2024-05-22T00:00:00.000Z","thumbnail":"/thumbnails/d3_lines_redblue.png"},{"title":"Force phylogenetic tree","url":"/code_pages/posts/240521_d3_forceTree.html","subtext":"Force phylogenetic tree that is draggable","keywords":["D3"],"date":"2024-05-21T00:00:00.000Z","thumbnail":"/thumbnails/d3_forceTree.png"},{"title":"Steamgraph","url":"/code_pages/posts/240521_d3_steamgraph.html","subtext":"Make an animated steamgraph with color selections","keywords":["D3"],"date":"2024-05-21T00:00:00.000Z","thumbnail":"/thumbnails/steamgraph.png"},{"title":"Circle animation Test","url":"/code_pages/posts/240520_d3_circleAnimation.html","subtext":"Playing around with D3 animations and transitions","keywords":["D3"],"date":"2024-05-20T00:00:00.000Z","thumbnail":"/thumbnails/circle_animation.png"},{"title":"Lines animation","url":"/code_pages/posts/240519_d3_linesAnimation.html","subtext":"Animation of points with random y-coordinates with fitted line","keywords":["D3"],"date":"2024-05-19T00:00:00.000Z","thumbnail":"/thumbnails/lines_animation.png"},{"title":"PhyloTree Animated","url":"/code_pages/posts/240519_d3_phylotreeRight.html","subtext":"Messing with transitions and animations in D3 on a phylogenetic tree.","keywords":["D3"],"date":"2024-05-19T00:00:00.000Z","thumbnail":"/thumbnails/phylogenyAnimated.png"},{"title":"Lentivirus genome","url":"/code_pages/posts/240517_d3_lentivirus_genome.html","subtext":"Testing slide animations with a lentivirus genome","keywords":["D3"],"date":"2024-05-17T00:00:00.000Z","thumbnail":"/thumbnails/lenti_genome.png"},{"title":"Zoom and animations","url":"/code_pages/posts/240517_d3_plasmid_DMS.html","subtext":"Testing different zoom animations on a hypothetical mutant plasmid library","keywords":["D3"],"date":"2024-05-17T00:00:00.000Z","thumbnail":"/thumbnails/plasmidZoom.jpg"},{"title":"Vue/D3 Slider Test","url":"/code_pages/posts/240517_d3_reactiveSliders.html","subtext":"Connecting sliders to values to manipulate objects reactively","keywords":["D3"],"date":"2024-05-17T00:00:00.000Z","thumbnail":"/thumbnails/slider_test.png"},{"title":"Animated neutralization curves","url":"/code_pages/posts/240515_d3_neutCurves.html","subtext":"Transitioning lines and circles with error bars showing neutralization of pseudovirus with soluble receptors","keywords":["D3"],"date":"2024-05-15T00:00:00.000Z","thumbnail":"/thumbnails/d3_neutCurves.png"},{"title":"Zoomable heatmap","url":"/code_pages/posts/240508_d3_heatmap_wrapped_simple.html","subtext":"Demonstration of using D3 zoom function to make heatmap zoomable and draggable inside container. Scales with screen size.","keywords":["D3"],"date":"2024-05-08T00:00:00.000Z","thumbnail":"/thumbnails/d3_zoom_heatmap.png"},{"title":"Phylogeny linear","url":"/code_pages/posts/240506_d3_phylogeny_right.html","subtext":"Nipah phylogeny that is linear and has scaled branch lengths","keywords":["D3"],"date":"2024-05-06T00:00:00.000Z","thumbnail":"/thumbnails/phylogeny_right.png"},{"title":"Altair CSS","url":"/code_pages/posts/240503_altair_css.html","subtext":"How to inject custom CSS into Altair plots.","keywords":["Altair"],"date":"2024-05-03T00:00:00.000Z"},{"title":"Altair neutralization curves","url":"/code_pages/posts/240503_altair_neuts.html","subtext":"How to plot nice neutralization curves using Altair.","keywords":["Altair"],"date":"2024-05-03T00:00:00.000Z","thumbnail":"/thumbnails/altair_neut_curve.png"},{"title":"Altair themes","url":"/code_pages/posts/240503_altair_theme.html","subtext":"How to use Altair themes.","keywords":["Altair"],"date":"2024-05-03T00:00:00.000Z","thumbnail":"/thumbnails/altair_theme.png"},{"title":"Heatmap wrapped in rows","url":"/code_pages/posts/240503_d3_heatmap_wrapped.html","subtext":"Heatmap of deep mutational scanning data that is wrapped in multiple rows and allows customization.","keywords":["D3"],"date":"2024-05-03T00:00:00.000Z","thumbnail":"/thumbnails/d3_heatmap_wrapped.png"},{"title":"Heatmap windows + animation","url":"/code_pages/posts/240501_d3_heatmap_blocks.html","subtext":"Heatmap showing effects of mutations in blocks of sites with a transistion animation on repeat.","keywords":["D3"],"date":"2024-05-01T00:00:00.000Z","thumbnail":"/thumbnails/d3_heatmap_blocks.png"},{"title":"Hierarchial data","url":"/code_pages/posts/240430_d3_hierarchy.html","subtext":"Convert a .csv into a hierarchy using D3","keywords":["D3"],"date":"2024-04-30T00:00:00.000Z","thumbnail":"/thumbnails/d3_hierarchy.png"},{"title":"Radial Phylogeny","url":"/code_pages/posts/240428_d3_phylogeny_radial.html","subtext":"Testing making a Nipah Phylogeny","keywords":["D3"],"date":"2024-04-28T00:00:00.000Z","thumbnail":"/thumbnails/d3_phylogeny_radial.png"},{"title":"Altair letter scatter","url":"/code_pages/posts/240426_altair_amino_acid_scatter.html","subtext":"How to make a simple interactive plot with Altair","keywords":["Altair"],"date":"2024-04-26T00:00:00.000Z","thumbnail":"/thumbnails/altair_letter_scatter.png"},{"title":"Mapping quantitative values onto protein structures","url":"/code_pages/posts/240425_chimera_mean_effects.html","subtext":"How to map aggregate deep mutational scanning measurements on a protein structure using ChimeraX.","keywords":["ChimeraX"],"date":"2024-04-25T00:00:00.000Z","thumbnail":"/thumbnails/chimera_mean_effects.png"}]');
function deserializeFunctions(r) {
  return Array.isArray(r) ? r.map(deserializeFunctions) : typeof r == "object" && r !== null ? Object.keys(r).reduce((t, n) => (t[n] = deserializeFunctions(r[n]), t), {}) : typeof r == "string" && r.startsWith("_vp-fn_") ? new Function(`return ${r.slice(7)}`)() : r;
}
const siteData = deserializeFunctions(JSON.parse(`{"lang":"en-US","dir":"ltr","title":"Brendan Larsen","description":"Brendan Larsen's Personal Website","base":"/","head":[],"router":{"prefetchLinks":true},"appearance":true,"themeConfig":{"nav":[{"text":"Home","link":"/"},{"text":"About","link":"/about"},{"text":"Publications","link":"/publications"},{"text":"Visualizations","link":"/code_pages/code_index"}],"socialLinks":[{"icon":"github","link":"https://github.com/bblarsen-sci"},{"icon":"twitter","link":"https://twitter.com/bblarsen1"}]},"locales":{},"scrollOffset":134,"cleanUrls":false}`));
var define_import_meta_env_default = { BASE_URL: "/", MODE: "production", DEV: false, PROD: true, SSR: true };
const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i;
const APPEARANCE_KEY = "vitepress-theme-appearance";
const HASH_RE = /#.*$/;
const HASH_OR_QUERY_RE = /[?#].*$/;
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/;
const inBrowser = typeof document !== "undefined";
const notFoundPageData = {
  relativePath: "404.md",
  filePath: "",
  title: "404",
  description: "Not Found",
  headers: [],
  frontmatter: { sidebar: false, layout: "page" },
  lastUpdated: 0,
  isNotFound: true
};
function isActive(currentPath, matchPath, asRegex = false) {
  if (matchPath === void 0) {
    return false;
  }
  currentPath = normalize(`/${currentPath}`);
  if (asRegex) {
    return new RegExp(matchPath).test(currentPath);
  }
  if (normalize(matchPath) !== currentPath) {
    return false;
  }
  const hashMatch = matchPath.match(HASH_RE);
  if (hashMatch) {
    return (inBrowser ? location.hash : "") === hashMatch[0];
  }
  return true;
}
function normalize(path) {
  return decodeURI(path).replace(HASH_OR_QUERY_RE, "").replace(INDEX_OR_EXT_RE, "$1");
}
function isExternal(path) {
  return EXTERNAL_URL_RE.test(path);
}
function getLocaleForPath(siteData2, relativePath) {
  return Object.keys((siteData2 == null ? void 0 : siteData2.locales) || {}).find((key) => key !== "root" && !isExternal(key) && isActive(relativePath, `/${key}/`, true)) || "root";
}
function resolveSiteDataByRoute(siteData2, relativePath) {
  var _a, _b, _c, _d, _e, _f, _g;
  const localeIndex = getLocaleForPath(siteData2, relativePath);
  return Object.assign({}, siteData2, {
    localeIndex,
    lang: ((_a = siteData2.locales[localeIndex]) == null ? void 0 : _a.lang) ?? siteData2.lang,
    dir: ((_b = siteData2.locales[localeIndex]) == null ? void 0 : _b.dir) ?? siteData2.dir,
    title: ((_c = siteData2.locales[localeIndex]) == null ? void 0 : _c.title) ?? siteData2.title,
    titleTemplate: ((_d = siteData2.locales[localeIndex]) == null ? void 0 : _d.titleTemplate) ?? siteData2.titleTemplate,
    description: ((_e = siteData2.locales[localeIndex]) == null ? void 0 : _e.description) ?? siteData2.description,
    head: mergeHead(siteData2.head, ((_f = siteData2.locales[localeIndex]) == null ? void 0 : _f.head) ?? []),
    themeConfig: {
      ...siteData2.themeConfig,
      ...(_g = siteData2.locales[localeIndex]) == null ? void 0 : _g.themeConfig
    }
  });
}
function createTitle(siteData2, pageData) {
  const title = pageData.title || siteData2.title;
  const template = pageData.titleTemplate ?? siteData2.titleTemplate;
  if (typeof template === "string" && template.includes(":title")) {
    return template.replace(/:title/g, title);
  }
  const templateString = createTitleTemplate(siteData2.title, template);
  if (title === templateString.slice(3)) {
    return title;
  }
  return `${title}${templateString}`;
}
function createTitleTemplate(siteTitle, template) {
  if (template === false) {
    return "";
  }
  if (template === true || template === void 0) {
    return ` | ${siteTitle}`;
  }
  if (siteTitle === template) {
    return "";
  }
  return ` | ${template}`;
}
function hasTag(head, tag) {
  const [tagType, tagAttrs] = tag;
  if (tagType !== "meta")
    return false;
  const keyAttr = Object.entries(tagAttrs)[0];
  if (keyAttr == null)
    return false;
  return head.some(([type, attrs]) => type === tagType && attrs[keyAttr[0]] === keyAttr[1]);
}
function mergeHead(prev, curr) {
  return [...prev.filter((tagAttrs) => !hasTag(curr, tagAttrs)), ...curr];
}
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;
function sanitizeFileName(name) {
  const match = DRIVE_LETTER_REGEX.exec(name);
  const driveLetter = match ? match[0] : "";
  return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "_").replace(/(^|\/)_+(?=[^/]*$)/, "$1");
}
const KNOWN_EXTENSIONS = /* @__PURE__ */ new Set();
function treatAsHtml(filename) {
  var _a;
  if (KNOWN_EXTENSIONS.size === 0) {
    const extraExts = typeof process === "object" && ((_a = process.env) == null ? void 0 : _a.VITE_EXTRA_EXTENSIONS) || (define_import_meta_env_default == null ? void 0 : define_import_meta_env_default.VITE_EXTRA_EXTENSIONS) || "";
    ("3g2,3gp,aac,ai,apng,au,avif,bin,bmp,cer,class,conf,crl,css,csv,dll,doc,eps,epub,exe,gif,gz,ics,ief,jar,jpe,jpeg,jpg,js,json,jsonld,m4a,man,mid,midi,mjs,mov,mp2,mp3,mp4,mpe,mpeg,mpg,mpp,oga,ogg,ogv,ogx,opus,otf,p10,p7c,p7m,p7s,pdf,png,ps,qt,roff,rtf,rtx,ser,svg,t,tif,tiff,tr,ts,tsv,ttf,txt,vtt,wav,weba,webm,webp,woff,woff2,xhtml,xml,yaml,yml,zip" + (extraExts && typeof extraExts === "string" ? "," + extraExts : "")).split(",").forEach((ext2) => KNOWN_EXTENSIONS.add(ext2));
  }
  const ext = filename.split(".").pop();
  return ext == null || !KNOWN_EXTENSIONS.has(ext.toLowerCase());
}
const dataSymbol = Symbol();
const siteDataRef = shallowRef(siteData);
function initData(route) {
  const site = computed(() => resolveSiteDataByRoute(siteDataRef.value, route.data.relativePath));
  const appearance = site.value.appearance;
  const isDark = appearance === "force-dark" ? ref(true) : appearance ? useDark({
    storageKey: APPEARANCE_KEY,
    initialValue: () => typeof appearance === "string" ? appearance : "auto",
    ...typeof appearance === "object" ? appearance : {}
  }) : ref(false);
  const hashRef = ref(inBrowser ? location.hash : "");
  if (inBrowser) {
    window.addEventListener("hashchange", () => {
      hashRef.value = location.hash;
    });
  }
  watch(() => route.data, () => {
    hashRef.value = inBrowser ? location.hash : "";
  });
  return {
    site,
    theme: computed(() => site.value.themeConfig),
    page: computed(() => route.data),
    frontmatter: computed(() => route.data.frontmatter),
    params: computed(() => route.data.params),
    lang: computed(() => site.value.lang),
    dir: computed(() => route.data.frontmatter.dir || site.value.dir),
    localeIndex: computed(() => site.value.localeIndex || "root"),
    title: computed(() => createTitle(site.value, route.data)),
    description: computed(() => route.data.description || site.value.description),
    isDark,
    hash: computed(() => hashRef.value)
  };
}
function useData() {
  const data2 = inject(dataSymbol);
  if (!data2) {
    throw new Error("vitepress data not properly injected in app");
  }
  return data2;
}
function joinPath(base, path) {
  return `${base}${path}`.replace(/\/+/g, "/");
}
function withBase(path) {
  return EXTERNAL_URL_RE.test(path) || !path.startsWith("/") ? path : joinPath(siteDataRef.value.base, path);
}
function pathToFile(path) {
  let pagePath = path.replace(/\.html$/, "");
  pagePath = decodeURIComponent(pagePath);
  pagePath = pagePath.replace(/\/$/, "/index");
  {
    if (inBrowser) {
      const base = "/";
      pagePath = sanitizeFileName(pagePath.slice(base.length).replace(/\//g, "_") || "index") + ".md";
      let pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
      if (!pageHash) {
        pagePath = pagePath.endsWith("_index.md") ? pagePath.slice(0, -9) + ".md" : pagePath.slice(0, -3) + "_index.md";
        pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
      }
      if (!pageHash)
        return null;
      pagePath = `${base}${"assets"}/${pagePath}.${pageHash}.js`;
    } else {
      pagePath = `./${sanitizeFileName(pagePath.slice(1).replace(/\//g, "_"))}.md.js`;
    }
  }
  return pagePath;
}
let contentUpdatedCallbacks = [];
function getScrollOffset() {
  let scrollOffset = siteDataRef.value.scrollOffset;
  let offset = 0;
  let padding = 24;
  if (typeof scrollOffset === "object" && "padding" in scrollOffset) {
    padding = scrollOffset.padding;
    scrollOffset = scrollOffset.selector;
  }
  if (typeof scrollOffset === "number") {
    offset = scrollOffset;
  } else if (typeof scrollOffset === "string") {
    offset = tryOffsetSelector(scrollOffset, padding);
  } else if (Array.isArray(scrollOffset)) {
    for (const selector of scrollOffset) {
      const res = tryOffsetSelector(selector, padding);
      if (res) {
        offset = res;
        break;
      }
    }
  }
  return offset;
}
function tryOffsetSelector(selector, padding) {
  const el = document.querySelector(selector);
  if (!el)
    return 0;
  const bot = el.getBoundingClientRect().bottom;
  if (bot < 0)
    return 0;
  return bot + padding;
}
const RouterSymbol = Symbol();
const fakeHost = "http://a.com";
const getDefaultRoute = () => ({
  path: "/",
  component: null,
  data: notFoundPageData
});
function createRouter(loadPageModule, fallbackComponent) {
  const route = reactive(getDefaultRoute());
  const router = {
    route,
    go
  };
  async function go(href = inBrowser ? location.href : "/") {
    var _a, _b;
    href = normalizeHref(href);
    if (await ((_a = router.onBeforeRouteChange) == null ? void 0 : _a.call(router, href)) === false)
      return;
    if (inBrowser && href !== normalizeHref(location.href)) {
      history.replaceState({ scrollPosition: window.scrollY }, "");
      history.pushState({}, "", href);
    }
    await loadPage(href);
    await ((_b = router.onAfterRouteChanged) == null ? void 0 : _b.call(router, href));
  }
  let latestPendingPath = null;
  async function loadPage(href, scrollPosition = 0, isRetry = false) {
    var _a;
    if (await ((_a = router.onBeforePageLoad) == null ? void 0 : _a.call(router, href)) === false)
      return;
    const targetLoc = new URL(href, fakeHost);
    const pendingPath = latestPendingPath = targetLoc.pathname;
    try {
      let page = await loadPageModule(pendingPath);
      if (!page) {
        throw new Error(`Page not found: ${pendingPath}`);
      }
      if (latestPendingPath === pendingPath) {
        latestPendingPath = null;
        const { default: comp, __pageData } = page;
        if (!comp) {
          throw new Error(`Invalid route component: ${comp}`);
        }
        route.path = inBrowser ? pendingPath : withBase(pendingPath);
        route.component = markRaw(comp);
        route.data = true ? markRaw(__pageData) : readonly(__pageData);
        if (inBrowser) {
          nextTick(() => {
            let actualPathname = siteDataRef.value.base + __pageData.relativePath.replace(/(?:(^|\/)index)?\.md$/, "$1");
            if (!siteDataRef.value.cleanUrls && !actualPathname.endsWith("/")) {
              actualPathname += ".html";
            }
            if (actualPathname !== targetLoc.pathname) {
              targetLoc.pathname = actualPathname;
              href = actualPathname + targetLoc.search + targetLoc.hash;
              history.replaceState({}, "", href);
            }
            if (targetLoc.hash && !scrollPosition) {
              let target = null;
              try {
                target = document.getElementById(decodeURIComponent(targetLoc.hash).slice(1));
              } catch (e) {
                console.warn(e);
              }
              if (target) {
                scrollTo(target, targetLoc.hash);
                return;
              }
            }
            window.scrollTo(0, scrollPosition);
          });
        }
      }
    } catch (err) {
      if (!/fetch|Page not found/.test(err.message) && !/^\/404(\.html|\/)?$/.test(href)) {
        console.error(err);
      }
      if (!isRetry) {
        try {
          const res = await fetch(siteDataRef.value.base + "hashmap.json");
          window.__VP_HASH_MAP__ = await res.json();
          await loadPage(href, scrollPosition, true);
          return;
        } catch (e) {
        }
      }
      if (latestPendingPath === pendingPath) {
        latestPendingPath = null;
        route.path = inBrowser ? pendingPath : withBase(pendingPath);
        route.component = fallbackComponent ? markRaw(fallbackComponent) : null;
        const relativePath = inBrowser ? pendingPath.replace(/(^|\/)$/, "$1index").replace(/(\.html)?$/, ".md").replace(/^\//, "") : "404.md";
        route.data = { ...notFoundPageData, relativePath };
      }
    }
  }
  if (inBrowser) {
    if (history.state === null) {
      history.replaceState({}, "");
    }
    window.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (button)
        return;
      const link2 = e.target.closest("a");
      if (link2 && !link2.closest(".vp-raw") && (link2 instanceof SVGElement || !link2.download)) {
        const { target } = link2;
        const { href, origin, pathname, hash, search } = new URL(link2.href instanceof SVGAnimatedString ? link2.href.animVal : link2.href, link2.baseURI);
        const currentUrl = new URL(location.href);
        if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey && !target && origin === currentUrl.origin && treatAsHtml(pathname)) {
          e.preventDefault();
          if (pathname === currentUrl.pathname && search === currentUrl.search) {
            if (hash !== currentUrl.hash) {
              history.pushState({}, "", href);
              window.dispatchEvent(new HashChangeEvent("hashchange", {
                oldURL: currentUrl.href,
                newURL: href
              }));
            }
            if (hash) {
              scrollTo(link2, hash, link2.classList.contains("header-anchor"));
            } else {
              window.scrollTo(0, 0);
            }
          } else {
            go(href);
          }
        }
      }
    }, { capture: true });
    window.addEventListener("popstate", async (e) => {
      var _a;
      if (e.state === null) {
        return;
      }
      await loadPage(normalizeHref(location.href), e.state && e.state.scrollPosition || 0);
      (_a = router.onAfterRouteChanged) == null ? void 0 : _a.call(router, location.href);
    });
    window.addEventListener("hashchange", (e) => {
      e.preventDefault();
    });
  }
  return router;
}
function useRouter() {
  const router = inject(RouterSymbol);
  if (!router) {
    throw new Error("useRouter() is called without provider.");
  }
  return router;
}
function useRoute() {
  return useRouter().route;
}
function scrollTo(el, hash, smooth = false) {
  let target = null;
  try {
    target = el.classList.contains("header-anchor") ? el : document.getElementById(decodeURIComponent(hash).slice(1));
  } catch (e) {
    console.warn(e);
  }
  if (target) {
    let scrollToTarget = function() {
      if (!smooth || Math.abs(targetTop - window.scrollY) > window.innerHeight)
        window.scrollTo(0, targetTop);
      else
        window.scrollTo({ left: 0, top: targetTop, behavior: "smooth" });
    };
    const targetPadding = parseInt(window.getComputedStyle(target).paddingTop, 10);
    const targetTop = window.scrollY + target.getBoundingClientRect().top - getScrollOffset() + targetPadding;
    requestAnimationFrame(scrollToTarget);
  }
}
function normalizeHref(href) {
  const url = new URL(href, fakeHost);
  url.pathname = url.pathname.replace(/(^|\/)index(\.html)?$/, "$1");
  if (siteDataRef.value.cleanUrls)
    url.pathname = url.pathname.replace(/\.html$/, "");
  else if (!url.pathname.endsWith("/") && !url.pathname.endsWith(".html"))
    url.pathname += ".html";
  return url.pathname + url.search + url.hash;
}
const runCbs = () => contentUpdatedCallbacks.forEach((fn) => fn());
const Content = defineComponent({
  name: "VitePressContent",
  props: {
    as: { type: [Object, String], default: "div" }
  },
  setup(props) {
    const route = useRoute();
    const { site } = useData();
    return () => h(props.as, site.value.contentProps ?? { style: { position: "relative" } }, [
      route.component ? h(route.component, {
        onVnodeMounted: runCbs,
        onVnodeUpdated: runCbs,
        onVnodeUnmounted: runCbs
      }) : "404 Page Not Found"
    ]);
  }
});
const _sfc_main$b = {
  __name: "Date",
  __ssrInlineRender: true,
  props: {
    dateString: String
  },
  setup(__props) {
    const props = __props;
    const dateTime = ref(new Date(props.dateString).toISOString());
    watch(
      () => props.dateString,
      (newValue) => {
        dateTime.value = new Date(parseISOString(newValue)).toISOString();
      },
      { immediate: true }
    );
    function parseISOString(s) {
      var b = s.split(/\D+/);
      var utcDate = new Date(Date.UTC(b[0], --b[1], b[2]));
      return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 6e4);
    }
    const formattedDate = computed(() => {
      const dateObj = new Date(parseISOString(props.dateString));
      const options = { year: "numeric", month: "long", day: "numeric" };
      return dateObj.toLocaleDateString(void 0, options);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<dl${ssrRenderAttrs(_attrs)}><dt class="sr-only">Published on</dt><dd class="date text-base font-medium leading-6"><time${ssrRenderAttr("datetime", dateTime.value)}>${ssrInterpolate(formattedDate.value)}</time></dd></dl>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/Date.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = {
  components: {
    DateComponent: _sfc_main$b
  },
  props: {
    currentDirectory: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { frontmatter } = useData();
    const selectedKeywords = ref([]);
    const filteredPosts = computed(() => {
      const currentDirectory = props.currentDirectory;
      return data.filter((post) => {
        var _a;
        const parentDirectory = post.url.split("/").slice(-3, -2)[0];
        const isInCurrentDirectory = parentDirectory === currentDirectory;
        const hasSelectedKeywords = selectedKeywords.value.length === 0 || ((_a = post.keywords) == null ? void 0 : _a.some((keyword) => selectedKeywords.value.includes(keyword)));
        return isInCurrentDirectory && hasSelectedKeywords;
      });
    });
    const filteredKeywords = computed(() => {
      const keywords = /* @__PURE__ */ new Set();
      filteredPosts.value.forEach((post) => {
        if (post.keywords) {
          post.keywords.forEach((keyword) => keywords.add(keyword));
        }
      });
      return Array.from(keywords);
    });
    return {
      frontmatter,
      selectedKeywords,
      filteredKeywords,
      filteredPosts,
      currentDirectory: props.currentDirectory
    };
  }
};
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto max-w-screen-md px-12" }, _attrs))} data-v-0366bd99><div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10" data-v-0366bd99><!--[-->`);
  ssrRenderList($setup.filteredPosts, (post, index) => {
    _push(`<div class="card container block max-w-sm rounded-lg border border-slate-200 shadow hover:border-slate-400 dark:border-slate-700" data-v-0366bd99><a${ssrRenderAttr("href", post.url)} class="flex h-full flex-col" data-v-0366bd99>`);
    if (post.thumbnail) {
      _push(`<div class="h-36" data-v-0366bd99><img${ssrRenderAttr("src", post.thumbnail)} class="h-full w-full rounded-t-lg object-cover" data-v-0366bd99></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="flex flex-grow flex-col justify-between p-5" data-v-0366bd99><div data-v-0366bd99><h2 class="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white" data-v-0366bd99>${ssrInterpolate(post.title)}</h2>`);
    if (post.subtext) {
      _push(`<p class="keywords mb-2 text-sm" data-v-0366bd99>${post.subtext ?? ""}</p>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
    if (post.keywords) {
      _push(`<div class="keywords mt-4" data-v-0366bd99><span data-v-0366bd99><strong class="font-bold text-slate-900 dark:text-white" data-v-0366bd99>Software: </strong></span><!--[-->`);
      ssrRenderList(post.keywords, (keyword, kIndex) => {
        _push(`<span data-v-0366bd99>${ssrInterpolate(keyword)}`);
        if (kIndex < post.keywords.length - 1) {
          _push(`<span data-v-0366bd99>, </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span>`);
      });
      _push(`<!--]--></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></a></div>`);
  });
  _push(`<!--]--></div></div>`);
}
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/CodePosts.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const CodePosts = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["ssrRender", _sfc_ssrRender$9], ["__scopeId", "data-v-0366bd99"]]);
const _sfc_main$9 = {};
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "!prose !prose-dark dark:!prose-invert" }, _attrs))}><h1 class="!pt-0">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</h1></div>`);
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/FigureHeader.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const FigureTitle = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$8]]);
const _sfc_main$8 = {};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "!prose dark:!prose-invert" }, _attrs))}><h3 class="!pb-12 !font-light !opacity-80">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</h3></div>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/SubtitleHeader.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const SubtitleHeader = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$7]]);
const _sfc_main$7 = {};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto mb-24 rounded-lg p-4 font-light text-slate-950 dark:text-slate-200 md:shadow-lg" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/D3PlotContainer.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const D3PlotContainer = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$6]]);
const _sfc_main$6 = {
  props: {
    item: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit("item-clicked");
    }
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<a${ssrRenderAttrs(mergeProps({
    href: $props.item.href,
    class: [{ "text-red-400": $props.isActive, "text-gray-600": !$props.isActive }, "no-underline md:text-lg px-4 py-4 md:py-2 flex items-center justify-center md:flex-none md:items-stretch md:justify-start"]
  }, _attrs))}>${ssrInterpolate($props.item.text)}</a>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/NavBarMenuItem.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const NavBarMenuItem = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$5]]);
const _sfc_main$5 = {
  components: {
    NavBarMenuItem
  },
  setup() {
    const { page } = useData();
    const currentPath = ref(page.value.relativePath);
    watch(() => page.value.relativePath, (newPath) => {
      currentPath.value = newPath;
    });
    const menuItems = computed(() => [
      { text: "About", href: "/about/", active: currentPath.value.startsWith("about/") },
      { text: "Publications", href: "/publications/", active: currentPath.value.startsWith("publications/") },
      { text: "Visualizations", href: "/code_pages/code_index", active: currentPath.value.startsWith("/code_pages/code_index") }
    ]);
    return { menuItems };
  },
  methods: {
    handleItemClick() {
      this.$emit("menu-item-clicked");
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NavBarMenuItem = resolveComponent("NavBarMenuItem");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex" }, _attrs))}><!--[-->`);
  ssrRenderList($setup.menuItems, (item) => {
    _push(ssrRenderComponent(_component_NavBarMenuItem, {
      key: item.text,
      item,
      isActive: item.active,
      onItemClicked: $options.handleItemClick
    }, null, _parent));
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/NavBarMenu.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const NavBarMenu = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$4]]);
const _sfc_main$4 = {
  methods: {
    handleTitleClick() {
      this.$emit("title-clicked");
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<a${ssrRenderAttrs(mergeProps({
    href: "/",
    class: "flex items-center no-underline prose dark:prose-dark"
  }, _attrs))}><p class="">Brendan Larsen</p></a>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/NavBarTitle.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const NavBarTitle = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$3 = {
  components: {
    NavBarMenu,
    NavBarTitle
  },
  data() {
    return {
      isMenuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    }
  },
  watch: {
    isMenuOpen(newValue) {
      const body = document.body;
      if (newValue) {
        body.classList.add("disable-scroll");
      } else {
        body.classList.remove("disable-scroll");
      }
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NavBarTitle = resolveComponent("NavBarTitle");
  const _component_NavBarMenu = resolveComponent("NavBarMenu");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex justify-between items-center w-full px-4 select-none" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_NavBarTitle, { onTitleClicked: $options.closeMenu }, null, _parent));
  _push(`<button class="flex md:hidden text-gray-600"><span class="${ssrRenderClass($data.isMenuOpen ? "i-x h-6 w-6" : "i-menu h-6 w-6")}"></span></button>`);
  _push(ssrRenderComponent(_component_NavBarMenu, {
    onMenuItemClicked: $options.closeMenu,
    class: ["bg-custom-soft backdrop-blur-md md:backdrop-blur-none flex-col md:flex-row bg-opacity-75 md:bg-transparent md:flex md:items-center md:px-0 px-3 md:pb-0 pb-10 md:static absolute md:w-auto w-full md:h-auto h-full md:pt-0 pt-10 top-14 z-50", `md:flex ${$data.isMenuOpen ? "flex" : "hidden"} ${$data.isMenuOpen ? "left-0" : "left-[-100%]"}`]
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/NavBar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const NavBar = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$2 = {
  components: {
    NavBar
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NavBar = resolveComponent("NavBar");
  _push(`<nav${ssrRenderAttrs(mergeProps({ class: "p-2 prose dark:prose-dark" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_NavBar, null, null, _parent));
  _push(`</nav>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/Nav.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Nav = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "w-full p-4 bg-white text-center text-gray-400 text-sm" }, _attrs))}><p> Copyright © Brendan Larsen 2024-Present </p></footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "Layout",
  __ssrInlineRender: true,
  setup(__props) {
    useData();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "app",
        class: "flex flex-col min-h-screen"
      }, _attrs))}>`);
      _push(ssrRenderComponent(Nav, { class: "mb-4" }, null, _parent));
      _push(`<main class="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-5xl xl:px-0">`);
      _push(ssrRenderComponent(unref(Content), null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/Layout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RawTheme = {
  Layout: _sfc_main,
  //extends: DefaultTheme,
  enhanceApp({ app, router, siteData: siteData2 }) {
    app.component("Layout", _sfc_main);
    app.component("Altair", Altair);
    app.component("Figure", Figure);
    app.component("CodePosts", CodePosts);
    app.component("FigureTitle", FigureTitle);
    app.component("D3PlotContainer", D3PlotContainer);
    app.component("SubtitleHeader", SubtitleHeader);
  }
};
const ClientOnly = defineComponent({
  setup(_, { slots }) {
    const show = ref(false);
    onMounted(() => {
      show.value = true;
    });
    return () => show.value && slots.default ? slots.default() : null;
  }
});
function useCodeGroups() {
  if (inBrowser) {
    window.addEventListener("click", (e) => {
      var _a;
      const el = e.target;
      if (el.matches(".vp-code-group input")) {
        const group = (_a = el.parentElement) == null ? void 0 : _a.parentElement;
        if (!group)
          return;
        const i = Array.from(group.querySelectorAll("input")).indexOf(el);
        if (i < 0)
          return;
        const blocks = group.querySelector(".blocks");
        if (!blocks)
          return;
        const current = Array.from(blocks.children).find((child) => child.classList.contains("active"));
        if (!current)
          return;
        const next = blocks.children[i];
        if (!next || current === next)
          return;
        current.classList.remove("active");
        next.classList.add("active");
        const label = group == null ? void 0 : group.querySelector(`label[for="${el.id}"]`);
        label == null ? void 0 : label.scrollIntoView({ block: "nearest" });
      }
    });
  }
}
function useCopyCode() {
  if (inBrowser) {
    const timeoutIdMap = /* @__PURE__ */ new WeakMap();
    window.addEventListener("click", (e) => {
      var _a;
      const el = e.target;
      if (el.matches('div[class*="language-"] > button.copy')) {
        const parent = el.parentElement;
        const sibling = (_a = el.nextElementSibling) == null ? void 0 : _a.nextElementSibling;
        if (!parent || !sibling) {
          return;
        }
        const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(parent.className);
        const ignoredNodes = [".vp-copy-ignore", ".diff.remove"];
        const clone = sibling.cloneNode(true);
        clone.querySelectorAll(ignoredNodes.join(",")).forEach((node) => node.remove());
        let text = clone.textContent || "";
        if (isShell) {
          text = text.replace(/^ *(\$|>) /gm, "").trim();
        }
        copyToClipboard(text).then(() => {
          el.classList.add("copied");
          clearTimeout(timeoutIdMap.get(el));
          const timeoutId = setTimeout(() => {
            el.classList.remove("copied");
            el.blur();
            timeoutIdMap.delete(el);
          }, 2e3);
          timeoutIdMap.set(el, timeoutId);
        });
      }
    });
  }
}
async function copyToClipboard(text) {
  try {
    return navigator.clipboard.writeText(text);
  } catch {
    const element = document.createElement("textarea");
    const previouslyFocusedElement = document.activeElement;
    element.value = text;
    element.setAttribute("readonly", "");
    element.style.contain = "strict";
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.fontSize = "12pt";
    const selection = document.getSelection();
    const originalRange = selection ? selection.rangeCount > 0 && selection.getRangeAt(0) : null;
    document.body.appendChild(element);
    element.select();
    element.selectionStart = 0;
    element.selectionEnd = text.length;
    document.execCommand("copy");
    document.body.removeChild(element);
    if (originalRange) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }
}
function useUpdateHead(route, siteDataByRouteRef) {
  let isFirstUpdate = true;
  let managedHeadElements = [];
  const updateHeadTags = (newTags) => {
    if (isFirstUpdate) {
      isFirstUpdate = false;
      newTags.forEach((tag) => {
        const headEl = createHeadElement(tag);
        for (const el of document.head.children) {
          if (el.isEqualNode(headEl)) {
            managedHeadElements.push(el);
            return;
          }
        }
      });
      return;
    }
    const newElements = newTags.map(createHeadElement);
    managedHeadElements.forEach((oldEl, oldIndex) => {
      const matchedIndex = newElements.findIndex((newEl) => newEl == null ? void 0 : newEl.isEqualNode(oldEl ?? null));
      if (matchedIndex !== -1) {
        delete newElements[matchedIndex];
      } else {
        oldEl == null ? void 0 : oldEl.remove();
        delete managedHeadElements[oldIndex];
      }
    });
    newElements.forEach((el) => el && document.head.appendChild(el));
    managedHeadElements = [...managedHeadElements, ...newElements].filter(Boolean);
  };
  watchEffect(() => {
    const pageData = route.data;
    const siteData2 = siteDataByRouteRef.value;
    const pageDescription = pageData && pageData.description;
    const frontmatterHead = pageData && pageData.frontmatter.head || [];
    const title = createTitle(siteData2, pageData);
    if (title !== document.title) {
      document.title = title;
    }
    const description = pageDescription || siteData2.description;
    let metaDescriptionElement = document.querySelector(`meta[name=description]`);
    if (metaDescriptionElement) {
      if (metaDescriptionElement.getAttribute("content") !== description) {
        metaDescriptionElement.setAttribute("content", description);
      }
    } else {
      createHeadElement(["meta", { name: "description", content: description }]);
    }
    updateHeadTags(mergeHead(siteData2.head, filterOutHeadDescription(frontmatterHead)));
  });
}
function createHeadElement([tag, attrs, innerHTML]) {
  const el = document.createElement(tag);
  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
  if (innerHTML) {
    el.innerHTML = innerHTML;
  }
  if (tag === "script" && !attrs.async) {
    el.async = false;
  }
  return el;
}
function isMetaDescription(headConfig) {
  return headConfig[0] === "meta" && headConfig[1] && headConfig[1].name === "description";
}
function filterOutHeadDescription(head) {
  return head.filter((h2) => !isMetaDescription(h2));
}
const hasFetched = /* @__PURE__ */ new Set();
const createLink = () => document.createElement("link");
const viaDOM = (url) => {
  const link2 = createLink();
  link2.rel = `prefetch`;
  link2.href = url;
  document.head.appendChild(link2);
};
const viaXHR = (url) => {
  const req = new XMLHttpRequest();
  req.open("GET", url, req.withCredentials = true);
  req.send();
};
let link;
const doFetch = inBrowser && (link = createLink()) && link.relList && link.relList.supports && link.relList.supports("prefetch") ? viaDOM : viaXHR;
function usePrefetch() {
  if (!inBrowser) {
    return;
  }
  if (!window.IntersectionObserver) {
    return;
  }
  let conn;
  if ((conn = navigator.connection) && (conn.saveData || /2g/.test(conn.effectiveType))) {
    return;
  }
  const rIC = window.requestIdleCallback || setTimeout;
  let observer = null;
  const observeLinks = () => {
    if (observer) {
      observer.disconnect();
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link2 = entry.target;
          observer.unobserve(link2);
          const { pathname } = link2;
          if (!hasFetched.has(pathname)) {
            hasFetched.add(pathname);
            const pageChunkPath = pathToFile(pathname);
            if (pageChunkPath)
              doFetch(pageChunkPath);
          }
        }
      });
    });
    rIC(() => {
      document.querySelectorAll("#app a").forEach((link2) => {
        const { hostname, pathname } = new URL(link2.href instanceof SVGAnimatedString ? link2.href.animVal : link2.href, link2.baseURI);
        const extMatch = pathname.match(/\.\w+$/);
        if (extMatch && extMatch[0] !== ".html") {
          return;
        }
        if (
          // only prefetch same tab navigation, since a new tab will load
          // the lean js chunk instead.
          link2.target !== "_blank" && // only prefetch inbound links
          hostname === location.hostname
        ) {
          if (pathname !== location.pathname) {
            observer.observe(link2);
          } else {
            hasFetched.add(pathname);
          }
        }
      });
    });
  };
  onMounted(observeLinks);
  const route = useRoute();
  watch(() => route.path, observeLinks);
  onUnmounted(() => {
    observer && observer.disconnect();
  });
}
function resolveThemeExtends(theme) {
  if (theme.extends) {
    const base = resolveThemeExtends(theme.extends);
    return {
      ...base,
      ...theme,
      async enhanceApp(ctx) {
        if (base.enhanceApp)
          await base.enhanceApp(ctx);
        if (theme.enhanceApp)
          await theme.enhanceApp(ctx);
      }
    };
  }
  return theme;
}
const Theme = resolveThemeExtends(RawTheme);
const VitePressApp = defineComponent({
  name: "VitePressApp",
  setup() {
    const { site, lang, dir } = useData();
    onMounted(() => {
      watchEffect(() => {
        document.documentElement.lang = lang.value;
        document.documentElement.dir = dir.value;
      });
    });
    if (site.value.router.prefetchLinks) {
      usePrefetch();
    }
    useCopyCode();
    useCodeGroups();
    if (Theme.setup)
      Theme.setup();
    return () => h(Theme.Layout);
  }
});
async function createApp() {
  globalThis.__VITEPRESS__ = true;
  const router = newRouter();
  const app = newApp();
  app.provide(RouterSymbol, router);
  const data2 = initData(router.route);
  app.provide(dataSymbol, data2);
  app.component("Content", Content);
  app.component("ClientOnly", ClientOnly);
  Object.defineProperties(app.config.globalProperties, {
    $frontmatter: {
      get() {
        return data2.frontmatter.value;
      }
    },
    $params: {
      get() {
        return data2.page.value.params;
      }
    }
  });
  if (Theme.enhanceApp) {
    await Theme.enhanceApp({
      app,
      router,
      siteData: siteDataRef
    });
  }
  return { app, router, data: data2 };
}
function newApp() {
  return createSSRApp(VitePressApp);
}
function newRouter() {
  let isInitialPageLoad = inBrowser;
  let initialPath;
  return createRouter((path) => {
    let pageFilePath = pathToFile(path);
    let pageModule = null;
    if (pageFilePath) {
      if (isInitialPageLoad) {
        initialPath = pageFilePath;
      }
      if (isInitialPageLoad || initialPath === pageFilePath) {
        pageFilePath = pageFilePath.replace(/\.js$/, ".lean.js");
      }
      if (false)
        ;
      else if (true) {
        pageModule = import(
          /*@vite-ignore*/
          `${pageFilePath}?t=${Date.now()}`
        );
      } else
        ;
    }
    if (inBrowser) {
      isInitialPageLoad = false;
    }
    return pageModule;
  }, Theme.NotFound);
}
if (inBrowser) {
  createApp().then(({ app, router, data: data2 }) => {
    router.go().then(() => {
      useUpdateHead(router.route, data2.site);
      app.mount("#app");
    });
  });
}
async function render(path) {
  const { app, router } = await createApp();
  await router.go(path);
  const ctx = { content: "" };
  ctx.content = await renderToString(app, ctx);
  return ctx;
}
export {
  render
};
