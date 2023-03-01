{
  // 高级类型

  // 1.交叉类型
  type A = { a: string } & { b: number };
  type C = string & number;
  // 2.联合类型
  type B = string | number;

  let a: A = { a: "s", b: 0 };
  let b: B = 1;

  // 类型保护

  // 3.typeof类型保护
  // 返回值是一个 类型谓词 -- 谓词为 parameterName is Type这种形式
  function isString(x: any): x is string {
    if (typeof x === "number") {
      // ...
    }
    return typeof x === "string";
  }

  // 4.instanceof类型保护
  interface Padder {
    a: string;
  }
  class Padder1 implements Padder {
    a: string;
    constructor() {
      this.a = "";
    }
  }
  let padder: Padder = new Padder1();
  if (padder instanceof Padder1) {
    // ...
  }

  // 5.字符串/数字字面量类型
  type Easing = "a" | "b" | "c";
  function eas(eas: Easing) {
    console.log(eas);
  }
  eas("a"); // 只能传 a | b | c

  // 索引类型和字符串索引签名
  interface Pap<T> {
    [key: string]: T;
  }
  let keys: keyof Pap<number>;
  let value: Pap<number>[];

  // 映射类型 - 从旧类型中创建新类型并可以重新设置每个属性
  type _Readonly<T> = {
    readonly [P in keyof T]: T[P];
  };
  type _Partial<T> = {
    [P in keyof T]?: T[P];
  };
  type Person = {
    age: number;
    name: string;
  };
  type ReadonlyPerson = _Readonly<Person>; // 全都只读
  type PartialPerson = _Partial<Person>; // 全都可选

  let rp: ReadonlyPerson = { age: 0, name: "" };
  let pp: PartialPerson = {};

  // 条件类型
  type Condition<T, U> = T extends U ? T : never;
}
