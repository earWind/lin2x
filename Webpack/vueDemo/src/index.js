/**
 * 此文件用于测试打包
 */

import _ from "lodash";
import "./styles/style.css";

export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}

function printMe() {
  console.log("I get called from print.js!");
  // cosnole.log("I get called from print.js!");
}

function component() {
  let element = document.createElement("div");
  let btn = document.createElement("button");

  element.innerHTML = _.join(["Hello", "webpack"], " ");
  element.classList.add("hello");

  btn.innerHTML = "点击这里，然后查看 console!..";
  btn.onclick = printMe;

  element.appendChild(btn);
  return element;
}

document.body.appendChild(component());
