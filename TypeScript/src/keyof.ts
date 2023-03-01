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
}
