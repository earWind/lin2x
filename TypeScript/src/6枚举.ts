{
  // 枚举

  // 数字枚举
  enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
  }
  // 使用
  console.log(Direction.Down); // key
  console.log(Direction[1]); // index

  // 字符串枚举
  enum Direction1 {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right",
  }

  // 联合枚举与枚举成员的类型
  interface Run {
    direct: Direction.Down;
  }
  let run: Run = {
    direct: Direction.Down,
  };
}

// 外部枚举
declare enum Enum {
  A = 1,
  B,
  C = 2,
}
