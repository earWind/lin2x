/**
 * 防抖
 * @param {*} fn
 * @param {*} timeOut
 * @returns
 */
function debounce(fn, timeOut) {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, timeOut);
  };
}

/**
 * 节流
 * @param {*} fn
 * @param {*} timeOut
 * @returns
 */
function throttle(fn, timeOut) {
  let timer = null;
  return function () {
    if (!timer) {
      fn.apply(this, arguments);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
    }, timeOut);
  };
}

const testDebounce = debounce(function (data) {
  console.log(data);
}, 500);

const testThrottle = throttle(function (data) {
  console.log(data);
}, 2000);

document.getElementById("btn").addEventListener("click", () => {
  const data = { a: "123" };
  testDebounce(data);
  // testThrottle(data);
});
