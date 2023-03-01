# js
<!-- js事件循环，原型链机制，hash和history -->
## 数据类型

1. 基本数据类型
number、boolean、string、null、undefined、symbol、bigInt

2. 引用类型
object，对象子类型（Array、Function、Date、Math、RegExp）

## 数据类型检测  

1. typeof
`typeof 1 // 'number'`
typeof可用于检测基本数据类型（null返回object），检测引用类型均返回为object

2. instanceof
`[] instanceof Array // true`
instanceof只能用于引用类型的检测，原理是基于原型链`L.__proto__ === R.prototype`

3. Object.prototype.toString.call()
`Object.prototype.toString.call([]) // '[object Array]'`

## 原型以及原型链

1. 原型
每个对象拥有一个`原型对象`，对象以其原型为模板、从原型继承方法和属性

2. 原型链
查找对象的某个属性时，如果没有，就会到原型（__proto__）上找，如果原型上还没有，会继续在原型的原型上找，直到null为止

* 每个函数都有一个特殊的属性叫作原型（prototype）
* 属性和方法定义在 Object 的构造器函数之上的 `prototype` 属性上
* 实例对象的 `__proto__` 指向原型的 `prototype`
* 每个实例对象都从原型中继承了一个 `constructor` 属性，该属性指向了用于构造此实例对象的构造函数

## 继承

1. 原型链继承

```js
function Animal() {
  this.color = ['black', 'white']
}
Animal.prototype.getColor = function() {
  return this.color
}

function Dog() {}
Dog.prototype = new Animal()

var dog1 = new Dog()
dog1.color.push('brown')
var dog2 = new Dog()
dog2.getColor() // ['black', 'white', 'brown']
```

原型链继承存在的问题：原型中包含的引用类型属性将被所有实例共享，子类在实例化的时候不能给父类构造函数传参

2. 借用构造函数实现继承

```js
function Animal(name) {
  this.name = name
  this.getName = function() {
    return this.name
  }
}
function Dog(name) {
  Animal.call(this, name)
}
Dog.prototype = new Animal()
```

借用构造函数实现继承解决了原型链继承的2个问题：引用类型共享问题以及传参问题。但是由于方法必须定义在构造函数中，所以会导致每次创建子类实例都会创建一遍方法

3. 组合式继承

```js
function Animal(name) {
  this.name = name
}
Animal.prototype.getName = function() {
  return this.name
}
function Dog(name, age) {
  Animal.call(this, name)
  this.age = age
}
Dog.prototype = new Animal()
Dog.prototype.constructor = Dog
```

组合继承结合了原型链和借用构造函数，将两者的优点集中了起来。基本的思路是使用原型链继承原型上的属性和方法，而通过借用构造函数继承实例属性。这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性

4. 寄生式组合继承

```js
function Animal(name) {
  this.name = name;
  this.color = ["black", "white"];
}
Animal.prototype.getName = function () {
  return this.name;
};
function Dog(name, age) {
  Animal.call(this, name);
  this.age = age;
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```

组合继承已经相对完善了，但还是存在问题，它的问题就是调用了 2 次父类构造函数，第一次是在 new Animal()，第二次是在 Animal.call()。所以解决方案就是不直接调用父类构造函数给子类原型赋值，而是通过创建空函数F获取父类原型的副本

5. Class继承

```js
class Animal {
  constructor(name) {
    this.name = name
  } 
  getName() {
    return this.name
  }
}
class Dog extends Animal {
  constructor(name, age) {
    super(name) // 关键
    this.age = age
  }
}
```

## 作用域

1. 作用域：是当前的执行上下文，变量和表达式在其中可被访问，子作用域可以访问父作用域，反过来则不行
作用域分：全局作用域、函数作用域、块级作用域（一对花括号创建的作用域）。块级作用域只对 `let` 和 `const` 声明有效，对 `var` 声明无效（在花括号外也能访问）
2. 作用域链：当访问一个变量时，会首先从当前的作用域中查找，如果没有，就会去父作用域查找，如果父作用域还没有则继续向上查找，直到全局作用域为止

## 闭包

闭包让开发者可以从函数外访问函数内部的作用域，闭包会随着函数的创建而被同时创建

```js
function makeFunc() {
  var name = "Mozilla";
  function displayName() {
    alert(name);
  }
  return displayName;
}
var myFunc = makeFunc();
myFunc();
```

闭包的应用：返回函数、函数当做参数传递、模块化
闭包的缺点：不会被自动清除，有可能会导致内存泄漏

## 变量声明

### const、let 和 var 的区别

1. 块级作用域
2. 不存在变量提升（即在声明前访问会报错）
3. 不可重复声明
4. let、const 声明的全局变量不会挂在顶层对象下面
5. const 声明之后必须马上赋值，否则会报错
6. const 基本类型一旦声明就不能再更改

### 变量提升

1. 声明会提升到作用域顶端

```js
console.log(v1);
var v1 = 100;
function foo() {
    console.log(v1);
    var v1 = 200;
    console.log(v1);
}
foo();
console.log(v1);
// 打印顺序为 undefined undefined 200 100
```

2. 函数提升是整个代码块提升到它所在的作用域的最开始执行

```js
foo();
var foo;
function foo() {
    console.log(1);
}
foo = function () {
    console.log(2);
};
foo()
// 打印顺序为 1 2
```

## this

1. this永远指向最后调用它的那个对象
2. 箭头函数的this始终指向函数定义时的this，而非执行时
3. 匿名函数的this永远指向window
4. 作为方法调用：a.fn() -> this永远指向最后调用它的那个对象
5. 作为函数调用：fn() -> 没有挂载在任何对象上，所以对于没有挂载在任何对象上的函数，在非严格模式下this就是指向window

[参考](https://juejin.cn/post/6844903496253177863#heading-11)

## 0.1 + 0.2 !== 0.3

js最大安全整数：

```js
Number.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1 = 9007199254740991
```

计算机存储双精度浮点数需要先把进制数转换为二进制的科学记数法的形式，然后计算机以自己的规则{符号位+(指数位+指数偏移量的二进制)+小数部分}存储二进制的科学记数法,因为存储时有位数限制（64位），并且某些十进制的浮点数在转换为二进制数时会出现无限循环，会造成二进制的舍入操作(0舍1入)，当再转换为十进制时就造成了计算误差

```js
// 0.1 >>> 二进制
0.1 >>> 0.0001 1001 1001 1001... //（1001无限循环）
// 0.2 >>> 二进制
0.2 >>> 0.0011 0011 0011 0011... //（0011无限循环）
// 0.1 + 0.2
0.1 + 0.2 >>> 0.0100 1100 1100 1100... //（1100无限循环）
```

[参考](https://zhuanlan.zhihu.com/p/100353781)

## 事件循环机制（Event Loop）

事件循环机制是javaScript代码的执行顺序，指浏览器或Node的一种解决javaScript单线程运行时不会阻塞的一种机制，也就是我们经常使用异步的原理

一个事件循环

1. 整体script作为第一个宏任务进入主线程执行
2. 遇到微任务就把微任务放入微任务队列，遇到宏任务就把宏任务放入宏任务队列
3. 执行完script后先执行微任务队列
4. 第一轮事件循环结束开始宏任务队列（开始下一轮循环）

宏任务：`script`/`setTimeout`/`setInterval`/`setImmediate`/`I/O`/`UI Rendering`
微任务：`process.nextTick`/`Promise`

上诉的 setTimeout 和 setInterval 等都是任务源，真正进入任务队列的是他们分发的任务

优先级

1. setTimeout = setInterval
2. setTimeout > setImmediate
3. process.nextTick > Promise

[参考](https://juejin.cn/post/6844903512845860872#comment)

## 事件流

1. DOM1级事件onclick
2. DOM2级事件规定的事件流包括三个阶段：`事件捕获阶段`、`处于目标阶段`、`事件冒泡阶段`，DOM2级事件中规定的事件流同时支持了`事件捕获`和`事件冒泡`

```js
// useCapture：false事件冒泡，true事件捕获，默认false
element.addEventListener(event, function, useCapture)
```

阻止事件冒泡：`event.stopPropagation()`

2. 事件代理

由于事件冒泡机制，点击了 `li` 后会冒泡到 `ul` ，此时就会触发绑定在 `ul` 上的点击事件，再利用 `e.target` 找到事件实际发生的元素，就可以达到预期的效果。使用事件代理的好处不仅在于将多个事件处理函数减为一个，而且对于不同的元素可以有不同的处理方法。假如上述列表元素当中添加了其他的元素节点，我们不必再一次循环给每一个元素绑定事件，直接修改事件代理的事件处理函数即可

[参考](https://juejin.cn/post/6844903834075021326#heading-0)

## js加载

1. async（异步）
js加载不会阻塞浏览器做任何其它的事情。它的加载是异步的，当它加载结束，JS 脚本会立即执行
2. defer（延缓）
js加载是异步的，执行是被推迟的。等整个文档解析完成、DOMContentLoaded 事件即将被触发时，被标记了 defer 的 js 文件才会开始依次执行
