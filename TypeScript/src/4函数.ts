{
  // 函数

  let myAdd: (x: number, y: number) => number = function (
    x: number,
    y: number
  ): number {
    return x + y;
  };

  // 可选参数
  function getName(a: string, b?: string): string {
    return a + b || "";
  }

  // 默认参数 会自动推导参数类型
  function defaultParams(a = "b", b: string): void {
    console.log(a + b);
  }

  // 剩余参数
  function restParams(a: number, ...args: number[]) {
    console.log(a, args);
  }
  // restParams(1, 2, 3, 4, 5, 6);

  // this
  interface Card {
    width: number;
  }

  interface Deck {
    width: number;
    createCard(this: Deck): Card;
  }

  let deck: Deck = {
    width: 1,
    createCard: function (this: Deck): Card {
      return { width: this.width };
    },
  };
  // const card = deck.createCard();

  // this参数在回调函数里
  class Handler {
    info: string;
    constructor() {
      this.info = "";
    }
    onClickGood(this: Handler, e: Event) {
      // can't use this here because it's of type void!
      console.log(this.info);
    }
  }

  // 重载 ...
  function pickCard(x: { suit: string; card: number }[]): number;
  function pickCard(x: number): { suit: string; card: number };
  function pickCard<T>(x: T): T {
    return x;
  }
}
