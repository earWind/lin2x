{
  // 接口
  interface LabelParams {
    label: string;
    width?: number; // 可选属性
    readonly height?: number; // 只读属性
    [propName: string]: any; // 额外属性（可以传入用不上的其他属性）
  }

  function printLabel(Params: LabelParams) {
    console.log(Params.label);
  }

  let myObj = { size: 10, label: "Size 10 Object" };
  printLabel(myObj);

  // 函数类型
  interface PrintFunc {
    (label: string, width: number): boolean;
  }
  let printFunc: PrintFunc = (label: string, width: number) => {
    return label.length + width > 10;
  };

  // 可索引的类型
  interface StringArray {
    [index: number]: string;
  }
  let myArray: StringArray = ["b", "a"];

  // 类类型
  class Clock {
    constructor(config: LabelParams) {}
    doSomeThing(d: string): void {}
  }

  // 继承接口
  interface Square {
    h: string;
  }
  interface Foo {
    k: number;
  }
  interface Square1 extends Square {
    s: number;
  }
  interface Square2 extends Square, Foo {
    // 继承多个接口
    g: number;
  }

  // 混合类型
  interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
  }
  function getCounter(): Counter {
    let counter = <Counter>function (start: number) {};
    counter.interval = 0;
    counter.reset = () => {};
    return counter;
  }

  // 接口继承类
  class Control {
    private state: any;
  }
  interface SelectableControl extends Control {
    select(): void;
  }
}
