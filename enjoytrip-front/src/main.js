import { createApp } from "vue";
import { createPinia } from "pinia";

import "./assets/main.css";
import router from "./router";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(createPinia());
app.use(router);
app.use(Antd);
app.mount("#app");
