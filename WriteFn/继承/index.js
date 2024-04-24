function Cat(name) {
  this.name = name;
}

Cat.prototype.getName = function () {
  console.log(this.name);
};

function YellowCat() {
  // 构造函数继承
  Cat.apply(this, arguments);
}

// 原型式继承
YellowCat.prototype = Object.create(Cat.prototype);

// 原型实例等于自身
YellowCat.prototype.construct = YellowCat;

const pnCat = new Cat(2);
pnCat.name = "pang niu";

const plCat = new YellowCat(2);

plCat.name = "yellow";
plCat.getName();

console.log(plCat);
console.log(pnCat);
