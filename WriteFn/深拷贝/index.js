function deepCopy(data) {
  let ret = null;
  // 非对象和数组直接返回
  if (typeof data !== "object" || !data) {
    return data;
  }
  if (Array.isArray(data)) {
    // 遍历数组 copy每一项
    ret = data.map(deepCopy);
  } else {
    // 遍历对象 copy每个属性
    ret = {};
    Object.keys(data).forEach((key) => {
      ret[key] = deepCopy(data[key]);
    });
  }
  return ret;
}

const cat = {
  name: "胖妞",
  age: 4,
  play() {
    console.log(this.age);
  },
};

const yellowCat = deepCopy(cat);
yellowCat.age = 1;
yellowCat.play();
console.log(cat, yellowCat);
