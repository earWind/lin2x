class P {
  status = "pending";
  resolveVal = "";
  rejectVal = "";

  resolveQueue = [];
  rejectQueue = [];

  constructor(fn) {
    const { resolve, reject } = this;
    fn(resolve, reject);
  }

  static resolve(val) {
    return new P((resolve, _) => {
      resolve(val);
    });
  }

  static reject() {
    return new P((_, reject) => {
      reject(val);
    });
  }

  resolve = (val) => {
    if (this.status === "pending") {
      this.status = "resolve";
      this.resolveVal = val;
      const { resolveQueue } = this;
      while (resolveQueue.length > 0) {
        resolveQueue.shift()(val);
      }
    }
  };

  reject = () => {
    if (this.status === "pending") {
      this.status = "reject";
      this.rejectVal = val;
      const { rejectQueue } = this;
      while (rejectQueue.length > 0) {
        rejectQueue.shift()(val);
      }
    }
  };

  then(onResolve, onReject) {
    const p = new P((resolve, reject) => {
      const resolveTask = () => {
        queueMicrotask(() => {
          const r = onResolve(this.resolveVal);
          resolve(r);
        });
      };
      const rejectTask = () => {
        queueMicrotask(() => {
          const r = onReject(this.rejectVal);
          reject(r);
        });
      };
      switch (this.status) {
        case "pending":
          this.resolveQueue.push(resolveTask);
          this.rejectQueue.push(rejectTask);
          break;
        case "resolve":
          resolveTask();
          break;
        case "reject":
          rejectTask();
          break;
      }

      console.log(this);
    });
    return p;
  }
}

new P((resolve, reject) => {
  console.log(0);
  setTimeout(() => {
    resolve(1);
  }, 0);
})
  .then(
    (res) => {
      console.log(res);
      return 2;
    },
    (err) => {
      console.log(err);
    }
  )
  .then((res) => {
    console.log(res);
  });
