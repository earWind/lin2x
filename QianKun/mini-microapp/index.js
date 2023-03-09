/**
 * 参考：https://www.bilibili.com/video/BV1H34y117fe/?spm_id_from=333.337.search-card.all.click&vd_source=882cc41e5b4d1de7ca7d872e4b8a766f
 * 微前端运行原理：（类似vue-router）
 *    1.监听路由变化
 *    2.匹配子应用
 *    3.加载子应用
 *    4.渲染子应用
 */

let apps = [];
let prevRoute = "";
let nextRoute = "";

// 注册路由
function registerMicroApps(data) {
  apps = data;
}

// 入口
function start() {
  // 1.监听路由变化

  /**
   * hash路由：window.onhashchange事件
   */
  // window.addEventListener("hashchange", () => {
  //   console.log("监听 hashchange");
  // });

  /**
   * history路由
   * window.onpopstate 事件监听 history.go、history.back、history.forward
   * pushState 和 replaceState 需要通过函数重写的方式进行劫持
   */

  // window.addEventListener("popstate", () => {
  //   console.log("监听 popstate");
  // });

  const rawPushState = window.history.pushState;
  window.history.pushState = async (...args) => {
    // 导航前
    prevRoute = window.location.hash;
    await unmountPrevRoute();

    rawPushState.apply(window.history, args);
    // console.log("监听 pushState");

    // 导航后
    nextRoute = window.location.hash;
    routerChange();
  };

  const rawReplaceState = window.history.replaceState;
  window.history.replaceState = (...args) => {
    rawReplaceState.apply(window.history, args);
    // console.log("监听 replaceState");
  };

  routerChange();
  prevRoute = window.location.hash;
}

// 销毁上一应用
async function unmountPrevRoute() {
  for (let i = 0; i < apps.length; i++) {
    const prevApp = apps[i];
    if (prevRoute.endsWith(prevApp.activeRule)) {
      if (prevApp && prevApp.unmount) {
        // 卸载子应用
        await prevApp.unmount();
      }
    }
  }
}

// 渲染应用
async function routerChange() {
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];

    // 2.匹配子应用
    if (window.location.hash.endsWith(app.activeRule)) {
      const { template, execScripts } = await importHtml(app.entry);

      const container = document.querySelector(app.container);
      container.appendChild(template);

      const appExports = await execScripts();
      app.bootstrap = appExports.bootstrap;
      app.mount = appExports.mount;
      app.unmount = appExports.unmount;

      // 渲染前
      await microBootstrap(app);

      // 渲染
      await microMount(app);
    }
  }
}

// 请求html资源
async function fetchResource(url) {
  return await fetch(url).then((res) => res.text());
}

// 加载应用（html）并加载html里面的script
async function importHtml(url) {
  // 3.加载子应用
  const html = await fetchResource(url);

  // 4.渲染子应用 - innerHTML中的js不会加载执行（需要手动加载执行）
  const template = document.createElement("div");
  template.innerHTML = html;

  const scripts = template.querySelectorAll("script");

  // 获取所有js标签的代码: [code, code]
  function getExternalScripts() {
    return Promise.all(
      Array.from(scripts).map((script) => {
        const src = script.getAttribute("src");
        if (!src) {
          return Promise.resolve(script.innerHTML);
        } else {
          return fetchResource(src);
        }
      })
    );
  }

  // 获取并执行js脚本代码
  async function execScripts() {
    const scriptCodes = await getExternalScripts();
    scriptCodes.forEach(eval);
    return window.exports;
  }

  return {
    template,
    getExternalScripts,
    execScripts,
  };
}

async function microBootstrap(app) {
  if (app.bootstrap) {
    await app.bootstrap();
  }
}

async function microMount(app) {
  if (app.mount) {
    await app.mount({
      container: document.querySelector(app.container),
    });
  }
}

async function microUnmount(app) {
  if (app.unmount) {
    await app.unmount();
  }
}
