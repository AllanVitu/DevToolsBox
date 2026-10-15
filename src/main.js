import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { registerServiceWorker } from './composables/usePwa';
import { installSpotlight } from './composables/useSpotlight';
import './composables/useTheme';

import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/ui.css';
import './styles/prose.css';

const app = createApp(App);
app.use(router);
app.config.errorHandler = (error, _instance, info) => {
  console.error('[DevToolbox] erreur non capturée :', error, info);
};
app.mount('#app');

installSpotlight();
registerServiceWorker();
