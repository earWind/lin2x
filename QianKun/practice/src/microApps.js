import { registerMicroApps, start, setDefaultMountApp } from "qiankun";

function registerMicro() {
  registerMicroApps([
    {
      name: "reactApp",
      entry: "//localhost:7100",
      container: "#container",
      activeRule: "/app-react",
    },
    {
      name: "vueApp",
      entry: "//localhost:7101",
      container: "#container",
      activeRule: "/app-vue",
    },
  ]);
  setDefaultMountApp("/app-vue");
  // 启动 qiankun
  start();
}

export default registerMicro;
