{
  interface Teacher {
    age: number;
    name: string;
  }
  interface Student {
    age: number;
    name: string;
    homeWork: string;
  }

  // 1.Partial - 将一个接口的所有属性都设置成可选状态
  // type Partial<T> = {
  //   [P in keyof T]?: T[P];
  // };

  const teacherA: Partial<Teacher> = { age: 18 };

  // 2.Required - 接口中的每个属性都改成必须的
  // type Required<T> = {
  //   [P in keyof T]-?: T[P];
  // };
  const teacherB: Required<Teacher> = { age: 18, name: "" };

  // 3.Extract - 提取公共属性
  // type Extract<T, U> = T extends U ? T : never;
  type CommonKeys = Extract<keyof Teacher, keyof Student>; // "age"

  // 4.Exclude - 提取除公共属性外的其他属性
  //  type Exclude<T, U> = T extends U ? never : T
  type ExcludeKeys = Exclude<keyof Student, keyof Teacher>; // "Teacher"

  // 5.Pick - 提取接口中的某几个属性
  // type Pick<T, K extends keyof T> = {
  //   [P in K]: T[P]
  // }
  type studentA = Pick<Student, "name" | "age">; // 提取这个接口中的name和age属性

  // 6.Omit - 排除接口中的某几个属性
  // type Omit<T, K extends keyof any> = Pick<
  //   T, Exclude<keyof T, K>
  // >
  type studentB = Omit<Student, "name">; // 排除掉这个接口中的name属性

  // 7.Record - 构造一个具有一组属性 K(类型 T)的类型
  // type Record<K extends keyof any, T> = {
  //   [P in K]: T;
  // };
  enum Methods {
    GET = "get",
    POST = "post",
    DELETE = "delete",
    PUT = "put",
  }
  type Router = Record<Methods, (req: () => void, res: () => void) => void>;
}
