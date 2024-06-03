import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/images/nipah.jpg";
const __pageData = JSON.parse('{"title":"Visualizations","description":"","frontmatter":{"layout":"page","aside":false,"dir":"code_pages","title":"Visualizations"},"headers":[],"relativePath":"code_pages/code_index.md","filePath":"code_pages/code_index.md"}');
const _sfc_main = { name: "code_pages/code_index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_CodePosts = resolveComponent("CodePosts");
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-screen-md prose dark:prose-dark dark:prose-invert justify-between pt-8 px-12"><h1 class="">Visualizing Biological Data</h1><img${ssrRenderAttr("src", _imports_0)} class="max-w-60 rounded-lg shadow-md mx-auto"><h2>Overview</h2><p>This section hosts different visualizations, primarily of deep mutational scanning data from the <a href="https://dms-vep.github.io/Nipah_Malaysia_RBP_DMS/">Nipah virus RBP project</a>. Deep mutational scanning is a technique that allows us to measure the effects of all possible mutations on protein function. Visualizing this volume of data is challenging. I initially created this website because I wanted to learn how to make figures with <a href="https://d3js.org/">D3</a>, a JavaScript library for data visualization. As I worked through examples and tutorials, I created some basic and experimental figures. </p><p>My interest in D3 led me to explore <a href="https://vitepress.dev">Vitepress</a>, a static site generator, and <a href="https://vuejs.org">Vue</a>, a front-end JavaScript framework for interacting with the Document Object Model (DOM). The DOM represents the structure of a web page, and both Vue and D3 can manipulate it. With Vitepress, it is possible to make Vue single file components directly in the markdown file, allowing you to mix markdown, HTML, JavaScript, and CSS all in the same file. I am using <a href="https://tailwindcss.com">Tailwind CSS</a> to style the components and applying <a href="https://github.com/tailwindlabs/tailwindcss-typography">Prose typography</a> to certain text elements.</p><p>In addition to the D3 and Vue visualizations, there are also a few posts that explain how to create more intermediate/advanced visualizations using the Python package <a href="https://altair-viz.github.io/">Altair</a>, or how to map deep mutational scanning data onto protein structures using <a href="https://www.cgl.ucsf.edu/chimerax/">ChimeraX</a>.</p><div class="mb-16"></div><h2 class="mb-16">Posts</h2></div>`);
  _push(ssrRenderComponent(_component_CodePosts, {
    currentDirectory: _ctx.$frontmatter.dir
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code_pages/code_index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const code_index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  code_index as default
};
