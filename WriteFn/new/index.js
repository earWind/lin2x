function _new(fnc, ...args) {
  const obj = Object.create(fnc.prototype);
  const ret = fnc.apply(obj, args);
  return typeof res === "object" ? ret : obj;
}

function Foo(count) {
  this.count = count;
}

Foo.prototype.add = function () {
  this.count++;
  console.log(this.count); // 19
};

let foo = _new(Foo, 18);
foo.add();
