/**
 * 参考：https://www.bilibili.com/video/BV1H34y117fe/?spm_id_from=333.337.search-card.all.click&vd_source=882cc41e5b4d1de7ca7d872e4b8a766f
 * 微前端运行原理：（类似vue-router）
 *    1.监听路由变化
 *    2.匹配子应用
 *    3.加载子应用
 *    4.渲染子应用
 */

let apps = [];

function registerMicroApps(data) {
  apps = data;
}

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
  window.history.pushState = (...args) => {
    rawPushState.apply(window.history, args);
    // console.log("监听 pushState");
    routerChange();
  };
  const rawReplaceState = window.history.replaceState;
  window.history.replaceState = (...args) => {
    rawReplaceState.apply(window.history, args);
    // console.log("监听 replaceState");
  };
}

async function routerChange() {
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    // 2.匹配子应用
    if (window.location.hash.endsWith(app.activeRule)) {
      const { template, execScripts } = await importHtml(app.entry);

      const container = document.querySelector(app.container);
      container.appendChild(template);

      execScripts();
    }
  }
}

async function fetchResource(url) {
  return await fetch(url).then((res) => res.text());
}

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
  }

  return {
    template,
    getExternalScripts,
    execScripts,
  };
}
