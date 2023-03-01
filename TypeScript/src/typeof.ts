{
  // string
  let s = "hello";
  let n: typeof s; // let n: string

  // array
  let sizes = ["", "default", "small", "large"] as const;
  type Size = typeof sizes[number]; // type Size = "" | "default" | "small" | "large"

  // function
  function f() {
    return { x: 10, y: 3 };
  }
  type P = ReturnType<typeof f>; // type P = {x:number; y:number;}
}
