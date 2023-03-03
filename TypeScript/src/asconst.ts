{
  // const 常量声明是 ES6 的语法，对 TS 而言，它只能反映该常量本身是不可被重新赋值的，它的子属性仍然可以被修改，故 TS 只会对它们做松散的类型推断
  // as const 是 TS 的语法，它告诉 TS 它所断言的值以及该值的所有层级的子属性都是不可篡改的，故对每一级子属性都会做最严格的类型推断

  // 对象
  const style = {
    psychodelic: {
      "magical-mystery-tour": 1967,
      "the-piper-at-the-gates-of-dawn": 1967,
    },
    glam: {
      "a-night-at-the-opera": 1975,
      "diamond-dogs": 1974,
    },
  } as const;

  // 数组
  const sizes = ["", "default", "small", "large"] as const;
  type Sizes = typeof sizes[number];

  // 枚举
  const env = {
    Development: "dev",
    Production: "prod",
    Testing: "test",
  } as const;
  // type ValueOf<T> = T[keyof T];
  // type ConstEnum = ValueOf<typeof constEnum>;
  type Dev = typeof env["Development"];
  const dev: Dev = "dev";
}
