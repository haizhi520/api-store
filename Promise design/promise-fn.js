const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("循环引用，则抛出异常"));
  }
  let called;

  if ((x != null && typeof x === "object") || typeof x === "function") {
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (e) => {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    // 传出普通值
    resolve(x);
  }
}

function myPromise(executor) {
  var self = this;
  self.status = PENDING;
  self.value = undefined;
  self.reason = undefined;

  self.onResolvedCallbacks = [];
  self.onRejectedCallbacks = [];

  function resolve(value) {
    if (self.status === PENDING) {
      self.status = FULFILLED;
      self.value = value;
      self.onResolvedCallbacks.forEach((fn) => fn());
    }
  }
  function reject(reason) {
    if (self.status === PENDING) {
      self.status = REJECTED;
      self.reason = reason;
      self.onRejectedCallbacks.forEach((fn) => fn());
    }
  }
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}
// 用原型链来写then方法
myPromise.prototype.then = function (onFulfilled, onRejected) {

    onFulfilled = typeof onFulfilled === "function" ? onFulfilled: v=>v
    onRejected = typeof onRejected === "function" ? onRejected: error=>{
        throw error
    }


  let promise2 = new myPromise((resolve, reject) => {
    if (this.status === FULFILLED) {
      // onFulfilled(this.value);
      setTimeout(() => {
        try {
          let x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }, 0);
    }
    if (this.status === REJECTED) {
      // onRejected(this.reason);
      setTimeout(() => {
        try {
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }, 0);
    }
    if (this.status === PENDING) {
      // 这里得知道pending的时候肯定是异步效果
      // this.onResolvedCallbacks.push(onFulfilled(this.value));
      // this.onRejectedCallbacks.push(onRejected(this.reason));
      this.onResolvedCallbacks.push(() => {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    }
  });
  return promise2;
};
myPromise.defer = myPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new myPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = myPromise;
