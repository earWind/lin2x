// 1.typeof与数组
const sizes = ["", "default", "small", "large"] as const;
type Size = typeof sizes[number];
const typeofSize: Size = "small";
