import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import Altair from "./Altair.vue";
import Figure from "./Figure.vue";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import Experiments from "./Experiments.vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {

    });
  },
  enhanceApp({ app, router, siteData }) {
    app.component("Altair", Altair);
    app.component("Figure", Figure);
    app.component("Experiments", Experiments);
    app.component("v-select", vSelect)

  },
};