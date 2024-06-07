//import { h } from 'vue';
//import Altair from './components/Altair.vue';
import './style.css';
import FigureTitle from './components/FigureHeader.vue';
import SubtitleHeader from './components/SubtitleHeader.vue';
import D3PlotContainer from './components/D3PlotContainer.vue';
import Layout from './Layout.vue';

export default {
  Layout,
  //extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    //app.component('Altair', Altair);
    app.component('FigureTitle', FigureTitle);
    app.component('D3PlotContainer', D3PlotContainer);
    app.component('SubtitleHeader', SubtitleHeader)
  },
};
