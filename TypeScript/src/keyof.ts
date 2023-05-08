{
  // keyof操作符，是将一个类型映射为它所有成员名称的联合类型

  interface Person {
    name: string;
    age: number;
    gender: string;
  }
  type P1 = keyof Person; // 'name' | 'age' | 'gender'
  let p1: P1 = "age";

  type Point = { x: number; y: number };
  type P2 = keyof Point; // 'x' | 'y'
  let p2: P2 = "x";

  // typescript中使用 in 关键字来遍历联合类型
  type key = 'vue' | 'react';
  type MappedType = { [k in key]: string }

  // clone
  type Clone<S extends Person> = { [P in keyof Person ]: S[P] };

  // 对于数组可以通过以下方式获取联合类型
  type framework = ['vue', 'react', 'angular'];
  type frameworkVal1 = framework[number]; // "vue" | "react" | "angular"

}
