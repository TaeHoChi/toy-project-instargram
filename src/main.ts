import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081/api';

loadFonts();

var app = createApp(App).use(router).use(store).use(vuetify);

app.config.globalProperties.$axios = axios;
// app.provider('$axios', axios)
app.mount('#app');
