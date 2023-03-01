{
  const reg: RegExp = /0-9/;

  const date: Date = new Date();

  const error: Error = new Error();

  const el: HTMLElement = document.createElement("div");

  const time1: ReturnType<typeof setTimeout> = setTimeout(() => {}, 0);

  const promise: Promise<boolean> = new Promise<boolean>((resolve, reject) => {
    resolve(true);
  });
  promise.then((r) => {});

  const map9: Map<string, number> = new Map();
  map9.set("a", 1);
}
