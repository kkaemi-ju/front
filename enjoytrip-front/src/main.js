import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/main.css'
import router from './router'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.mount('#app')
