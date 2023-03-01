// 类
class Greeter {
  f: string; // 默认为 public
  public o: number; // 公共
  private g: string; // 私有
  protected q: string; // 与private相似，但是在派生类中可以访问
  readonly n: string; // 只读

  constructor(g: string) {
    this.g = g;
    this.o = 0;
    this.f = "";
    this.n = "";
    this.q = "";
  }
  greet() {
    return "Hello, " + this.g;
  }
}

let greeter: Greeter = new Greeter("world");

// 存储器
class Employee {
  private _name: string;
  constructor(n: string) {
    this._name = n;
  }
  get name(): string {
    console.log("get");
    return this._name;
  }
  set name(name: string) {
    console.log("set");
    this._name = name;
  }
}
let employee: Employee = new Employee("哈哈");
employee.name = "嘿嘿";
console.log(employee.name);

// 把类当做接口使用
class Point {
  x: number;
  y: number;
  constructor() {
    this.x = this.y = 0;
  }
}
interface Point3d extends Point {
  z: number;
}
let point3d: Point3d = { x: 1, y: 2, z: 3 };
console.log(point3d);
