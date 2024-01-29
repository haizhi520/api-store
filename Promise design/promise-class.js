const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
// 规范A+ 写法
const resolvePromise = (promise2, x, resolve, reject) => {

  if (x === promise2) {
    return reject(new TypeError("同一引用！"));
  }
  let called;
  if ((typeof x === "object" && x != null) || typeof x === "function") {
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(x, (y) => {
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        },r=> {
            if (called) return;
            called = true;
            reject(r) 
        });
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
};
class myPromise {
  constructor(executor) {
    this.status = PENDING;
    // 存放成功状态的值，默认为 undefined
    this.value = undefined;
    // 存放失败状态的值，默认为 undefined
    this.reason = undefined;

    this.onResolveCallbacked = []; // 存放成功回调
    this.onRejectCallbacked = []; // 存放失败回调

    let resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onResolveCallbacked.forEach((fn) => fn());
      }
    };
    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.value = reason;
        this.onRejectCallbacked.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFullfilled, onRejected) {
    onFullfilled = typeof onFullfilled === "function" ? onFullfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (error) => {
            throw error;
          };
    // 需要返回一个promise的对象
    let promise2 = new myPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        //   onFullfilled(this.value);
        setTimeout(() => {
          try {
            let x = onFullfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        //   onRejected(this.value);
        setTimeout(() => {
          try {
            let x = onRejected(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === PENDING) {
        this.onResolveCallbacked.push(() => {
          // onFullfilled(this.value);
          setTimeout(() => {
            try {
              let x = onFullfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectCallbacked.push(() => {
          // onRejected(this.value);
          setTimeout(() => {
            try {
              let x = onRejected(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
}

myPromise.defer = myPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new myPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = myPromise