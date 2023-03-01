{
  // 基础类型

  // 1.布尔值
  let boolean: boolean = false;

  // 2.数字
  let number: number = 1;

  // 3.字符串
  let string: string = "hah";

  // 4.数组
  let array1: string[] = ["a", "b"];
  let array2: Array<number> = [1, 2];

  // 5.元组
  let tuple: [string, number, string | number] = ["a", 1, 2];

  // 6.枚举
  enum Color {
    red = 2,
    green,
    blue,
  }
  let color: Color = Color.green;
  // console.log(Color.green); // 3
  // console.log(Color[3]); // green

  // 7.any
  let any: any = "whatever";

  // 8.void
  function notReturn(): void {}

  // 9.Null 和 Undefined
  let u: undefined = undefined;
  let n: null = null;

  // 10.Never 没啥用

  // 11.object
  let obj: object = {};

  // 12 symbol

  let sb: symbol = Symbol("sb");

  // 类型断言 尖括号 和 as
  let someValue: any = "this is a string";
  let strLength1: number = (<string>someValue).length;
  let strLength2: number = (someValue as string).length;
}
