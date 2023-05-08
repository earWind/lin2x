{
  // 可以返回一个数据的类型

  // string
  let s = "hello";
  type Str =  typeof s; 

  // array
  let sizes = ["", "default", "small", "large"] as const;
  type Size = typeof sizes[number]; // type Size = "" | "default" | "small" | "large"

  // function
  function f() {
    return { x: 10, y: 3 };
  }
  type F = typeof f
  type P = ReturnType<typeof f>; // type P = {x:number; y:number;}
}
