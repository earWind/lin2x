import { createI18n } from "vue-i18n";

import zh from "./cn";
import en from "./en";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem("language") || "zh-CN",
  messages: {
    "zh-CN": zh,
    "en-US": en,
  },
});

export default i18n;
