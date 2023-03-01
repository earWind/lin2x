interface Example {
  a: string;
  b: string | number;
  c: () => void;
  d: {};
}

// 测试用例：
type StringKeysOnly = ConditionalPick<Example, string>;

type ConditionalPick<V, T> = {
  [K in keyof V as V[K] extends T ? K : never]: V[K];
};
