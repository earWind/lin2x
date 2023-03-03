{
  // 1. 属性或参数中使用 ? 表示该属性或参数为可选项
  let foo = (data: string) => {
    console.log(data);
  };

  // 2. 属性或参数中使用 ! 表示强制解析/强制链式调用（告诉typescript编译器，这里一定有值）
  let foob = (data: string) => {
    console.log(data);
  };
  let b: { c: string } | null = null;
  foob(b!.c);

  // 3. 变量后使用 ! 表示类型推断排除null、undefined
  let fooa = (data: string) => {
    console.log(data);
  };
  let a: string | undefined;
  fooa(a!);

  // 空值合并运算符(??)
  let d = null;
  let e = 1;
  let f = d ?? e; // f = 1;当d值为null或者undefined时f才等与e

  // 空值赋值运算符(??=)
  let g = null;
  g ??= e; // 当??=左侧的值为null、undefined的时候,才会将右侧变量的值赋值给左侧变量
}
