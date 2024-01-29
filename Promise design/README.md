# 手写实现一个Promise 

##  Promise/A的规范

### 1、Promise 对象的状态

```javascript
1、Promise 对象有三种状态：pending（等待中）、fulfilled（已成功）、rejected（已拒绝）。
2、初始状态是 pending。
3、一旦状态变为 fulfilled 或 rejected，就不能再改变
```

### 2. Promise 构造函数：

```javascript
1、 Promise 构造函数接受一个执行器函数，该函数在实例化时立即执行，接受两个参数：`resolve` 和 `reject`，分别用于将 Promise 状态变为 fulfilled 和 rejected。
2、执行器函数在执行过程中可能抛出异常，如果抛出异常，则将 Promise 的状态变为 rejected。
```

### 3. then 方法：

```javascript
1 、Promise 实例必须提供一个 `then` 方法，该方法接受两个可选参数：onFulfilled 和 onRejected。
2、 如果 Promise 的状态是 fulfilled，则调用 onFulfilled，并将 Promise 的值作为参数传递。
3、 如果 Promise 的状态是 rejected，则调用 onRejected，并将 Promise 的 reason（拒绝原因）作为参数传递。
4、 `then` 方法必须返回一个新的 Promise 对象。
```

### 4. 错误传递：

```javascript
1、如果 onFulfilled 或 onRejected 返回一个值 x，且 x 是一个 Promise 对象，应该等待这个 Promise 对象的状态变为 fulfilled 或 rejected，并将其值传递给下一个 Promise。
```

### 5. 多次调用：

```javascript
1、 `then` 方法可以被同一个 Promise 对象调用多次。
2、 如果 Promise 的状态已经变为 fulfilled 或 rejected，新的 `then` 调用应该被加入微任务队列（类似于异步任务）。
```



##  Promise/A+ 的规范补充

```javascript
1、then 的参数 `onFulfilled` 和 `onRejected` 可以缺省，如果 `onFulfilled` 或者 `onRejected`不是函数，将其忽略，且依旧可以在下面的 then 中获取到之前返回的值；「规范 Promise/A+ 2.2.1、2.2.1.1、2.2.1.2」

2、promise 可以 then 多次，每次执行完 promise.then 方法后返回的都是一个“新的promise"；「规范 Promise/A+ 2.2.7」

3、如果 then 的返回值 x 是一个普通值，那么就会把这个结果作为参数，传递给下一个 then 的成功的回调中；

4、如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调中；「规范 Promise/A+ 2.2.7.2」

5、如果 then 的返回值 x 是一个 promise，那么会等这个 promise 执行完，promise 如果成功，就走下一个 then 的成功；如果失败，就走下一个 then 的失败；如果抛出异常，就走下一个 then 的失败；「规范 Promise/A+ 2.2.7.3、2.2.7.4」

6、如果 then 的返回值 x 和 promise 是同一个引用对象，造成循环引用，则抛出异常，把异常传递给下一个 then 的失败的回调中；「规范 Promise/A+ 2.3.1」

7、如果 then 的返回值 x 是一个 promise，且 x 同时调用 resolve 函数和 reject 函数，则第一次调用优先，其他所有调用被忽略；「规范 Promise/A+ 2.3.3.3.3」


```



## promise-class.js 是类的组件实现







## promise-fn.js 是函数式组件实现



## 测试工具及测试用例

首先，在 promise 实现的代码中，增加以下代码:

```javascript
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve,reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
  })
  return dfd;
}
module.exports = Promise
```

执行以下npm操作

```javascript
npm install -g promises-aplus-tests
promises-aplus-tests promise.js
```

