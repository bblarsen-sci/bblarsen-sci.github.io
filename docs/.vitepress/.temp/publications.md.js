import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _sfc_main = {
  data() {
    return {
      publications: [],
      coauthor: [],
      preprints: []
    };
  },
  mounted() {
    fetch("/papers/papersFirst.json").then((response) => response.json()).then((data) => {
      this.publications = data;
    });
    fetch("/papers/papersSecond.json").then((response) => response.json()).then((data) => {
      this.coauthor = data;
    });
    fetch("/papers/preprints.json").then((response) => response.json()).then((data) => {
      this.preprints = data;
    });
  }
};
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"page"},"headers":[],"relativePath":"publications.md","filePath":"publications.md"}');
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-8e225fe1><div class="container mx-auto prose dark:prose-dark dark:prose-invert max-w-screen-lg px-12" data-v-8e225fe1><h1 class="py-10" data-v-8e225fe1>Publications</h1><div class="flex flex-row mb-4 text-sm md:text-md tracking-wider uppercase" data-v-8e225fe1><a class="inline-flex flex-1 justify-center dark:text-slate-300 text-slate-600 hover:text-red-600" href="#section-1" data-v-8e225fe1>Preprints</a><a class="inline-flex flex-1 justify-center dark:text-slate-300 text-slate-600 hover:text-red-600" href="#section-2" data-v-8e225fe1>First author </a><a class="inline-flex flex-1 justify-center dark:text-slate-300 text-slate-600 hover:text-red-600" href="#section-3" data-v-8e225fe1>Co-authored</a></div></div><div class="container mx-auto max-w-screen-lg px-12" data-v-8e225fe1><div class="h-1 bg-black dark:bg-white" data-v-8e225fe1></div><h2 class="py-8 text-2xl font-semibold tracking-tight" data-v-8e225fe1>Preprints</h2><div id="section-1" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" data-v-8e225fe1><!--[-->`);
  ssrRenderList($data.preprints, (paper) => {
    _push(`<div class="card block h-full max-w-sm rounded-lg border border-slate-200 shadow dark:border-slate-700 hover:border-slate-400" data-v-8e225fe1><a${ssrRenderAttr("href", paper.link)} data-v-8e225fe1><div class="p-5" data-v-8e225fe1><h2 class="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white" data-v-8e225fe1>${ssrInterpolate(paper.title)}</h2><img${ssrRenderAttr("src", paper.image)} class="mx-auto object-contain aspect-square max-h-36" data-v-8e225fe1><div class="text-center text-sm my-2" data-v-8e225fe1>${ssrInterpolate(paper.journal)}, ${ssrInterpolate(paper.year)}</div><p class="font-light text-xs line-clamp-3" data-v-8e225fe1>${ssrInterpolate(paper.abstract)}</p></div></a></div>`);
  });
  _push(`<!--]--></div><div class="mt-8 h-1 bg-black dark:bg-white" data-v-8e225fe1></div><h2 class="py-8 text-2xl font-semibold tracking-tight" data-v-8e225fe1>First author publications</h2><div id="section-2" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" data-v-8e225fe1><!--[-->`);
  ssrRenderList($data.publications, (paper) => {
    _push(`<div class="card block h-full max-w-sm rounded-lg border border-slate-200 shadow dark:border-slate-700 hover:border-slate-400" data-v-8e225fe1><a${ssrRenderAttr("href", paper.link)} data-v-8e225fe1><div class="p-5" data-v-8e225fe1><h2 class="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white" data-v-8e225fe1>${ssrInterpolate(paper.title)}</h2><img${ssrRenderAttr("src", paper.image)} class="mx-auto object-contain aspect-square max-h-36" data-v-8e225fe1><div class="text-center text-sm my-2" data-v-8e225fe1>${ssrInterpolate(paper.journal)}, ${ssrInterpolate(paper.year)}</div><p class="font-light text-xs line-clamp-3" data-v-8e225fe1>${ssrInterpolate(paper.abstract)}</p></div></a></div>`);
  });
  _push(`<!--]--></div><div class="mt-8 h-1 bg-black dark:bg-white" data-v-8e225fe1></div><h2 class="py-8 text-2xl font-semibold tracking-tight" data-v-8e225fe1>Co-authored Publications</h2><div id="section-3" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" data-v-8e225fe1><!--[-->`);
  ssrRenderList($data.coauthor, (paper) => {
    _push(`<div class="card block h-full max-w-sm rounded-lg border border-slate-200 shadow dark:border-slate-700 hover:border-slate-400" data-v-8e225fe1><a${ssrRenderAttr("href", paper.link)} data-v-8e225fe1><div class="p-5" data-v-8e225fe1><h2 class="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white" data-v-8e225fe1>${ssrInterpolate(paper.title)}</h2><div class="text-center text-sm my-2" data-v-8e225fe1>${ssrInterpolate(paper.journal)}, ${ssrInterpolate(paper.year)}</div><p class="font-light text-xs line-clamp-3" data-v-8e225fe1>${ssrInterpolate(paper.abstract)}</p></div></a></div>`);
  });
  _push(`<!--]--></div><br data-v-8e225fe1></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("publications.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const publications = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-8e225fe1"]]);
export {
  __pageData,
  publications as default
};
