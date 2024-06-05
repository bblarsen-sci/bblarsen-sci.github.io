import { h } from 'vue';
import Altair from './Altair.vue';
import Figure from './Figure.vue';
import './style.css';
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import FigureTitle from './FigureHeader.vue';
import SubtitleHeader from './SubtitleHeader.vue';
import D3PlotContainer from './D3PlotContainer.vue';
import Layout from './Layout.vue';

export default {
  Layout,
  //extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component('Altair', Altair);
    app.component('Figure', Figure);
    app.component('FigureTitle', FigureTitle);
    app.component('D3PlotContainer', D3PlotContainer);
    app.component('SubtitleHeader', SubtitleHeader);
    app.component('TwoslashFloatingVue', TwoslashFloatingVue)
  },
};
