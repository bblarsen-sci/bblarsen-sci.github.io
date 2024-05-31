<template>
  <div class="code-section">
    <h4>Code</h4>
    <div class="max-w-screen-md p-4 text-xs">
      <h4>HTML</h4>
      <pre><code>{{ htmlCode }}</code></pre>

      <h4>Script</h4>
      <pre><code>{{ scriptCode }}</code></pre>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    htmlCode() {
      return this.extractHtmlCode();
    },
    scriptCode() {
      return this.extractScriptCode();
    },
  },
  methods: {
    extractHtmlCode() {
      const template = document.querySelector('template').innerHTML;
      return template.trim();
    },
    extractScriptCode() {
      const script = document.querySelector('script').innerHTML;
      return script.trim();
    },
  },
};
</script>
