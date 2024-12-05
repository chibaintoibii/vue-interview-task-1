import { createApp } from "vue";
import "./assets/main.css";
import "vue-final-modal/style.css";

import App from "./App.vue";
import router from "./router";
import { createVfm } from "vue-final-modal";
import { VueQueryPlugin } from "@tanstack/vue-query";
import ToastPlugin from "@/components/Toast/ToastPlugin.ts";

const app = createApp(App);
app.use(router);
app.use(VueQueryPlugin);
app.use(createVfm());
app.use(ToastPlugin);
app.mount("#app");
