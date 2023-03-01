import { createApp } from "vue";
import App from "./App.vue";
import router from "./routers/index";
import store from "./store/index";
import ElementPlus from "element-plus";
import i18n from "./lang";

import "element-plus/dist/index.css";
import "normalize.css";

const app = createApp(App);

app.use(router).use(store).use(ElementPlus).use(i18n).mount("#app");
