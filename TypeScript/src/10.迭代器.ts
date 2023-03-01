{
  let arrIer: number[] = [1, 2, 3];

  let iter: Iterator<number> = arrIer[Symbol.iterator]();

  console.log(iter.next()); // {value: 1, done: false}
  console.log(iter.next());
  console.log(iter.next());

  for (let entry of arrIer) {
    console.log(entry); // 1, 2, 3
  }

  for (let i in arrIer) {
    console.log(i); // "0", "1", "2",
  }
}
