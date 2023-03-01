import _ from "lodash";
import "./styles/style.css";
import friend from "./images/friend.jpg";
import { add } from "./utils/common";

function component() {
  let element = document.createElement("div");

  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  element.innerHTML = _.join(["Hello", "webpack"], " ");
  element.classList.add("hello");
  // 将图像添加到我们已经存在的 div 中
  let myImg = new Image();
  myImg.src = friend;
  myImg.classList.add("left");

  element.appendChild(myImg);

  console.log(add(1, 2));

  return element;
}

document.body.appendChild(component());
