let obj = {
  count: 0,
};

function observer(obj) {
  Object.keys(obj).forEach((key) => {
    // 不能在get中读取，也不能在set中修改，所以用一个变量
    let value = obj[key];

    Object.defineProperty(obj, key, {
      // enumerable: true,
      // configurable: true,
      get() {
        console.log("get:", value);
        return value;
      },
      set(val) {
        console.log("set:", val);
        value = val;
      },
    });
  });
}

observer(obj);

obj.count = 1;

console.log(JSON.stringify(obj));
