import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import Altair from "./Altair.vue";
import Figure from "./Figure.vue";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import CodePosts from "./CodePosts.vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import FigureTitle from "./FigureHeader.vue";
import SubtitleHeader from "./SubtitleHeader.vue";
import D3PlotContainer from "./D3PlotContainer.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {

    });
  },
  enhanceApp({ app, router, siteData }) {
    app.component("Altair", Altair);
    app.component("Figure", Figure);
    app.component("CodePosts", CodePosts);
    app.component("v-select", vSelect)
    app.component("FigureTitle", FigureTitle);
    app.component("D3PlotContainer", D3PlotContainer);
    app.component("SubtitleHeader", SubtitleHeader);

  },
};