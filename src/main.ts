import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from "./router";
import { createVfm } from 'vue-final-modal'
import { VueQueryPlugin } from '@tanstack/vue-query'


const app = createApp(App)
const vfm = createVfm()
app.use(router)
app.use(VueQueryPlugin)
app.use(vfm)
app.mount('#app')
