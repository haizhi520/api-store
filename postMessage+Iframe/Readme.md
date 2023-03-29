## Postmessage + Iframe 的一个简单例子

​	**window.postMessage()** 方法可以安全地实现跨源通信。通常，对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议（通常为 https），端口号（443 为 https 的默认值），以及主机 (两个页面的模数 [`Document.domain`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/domain)设置为相同的值) 时，这两个脚本才能相互通信。 



### [语法]

```
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

`otherWindow`

其他窗口的一个引用，比如 iframe 的 contentWindow 属性、执行[window.open](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open)返回的窗口对象、或者是命名过或数值索引的[window.frames (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/Window/frames)。

`message`

将要发送到其他 window 的数据。它将会被[结构化克隆算法 (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)序列化。这意味着你可以不受什么限制的将数据对象安全的传送给目标窗口而无需自己序列化。[[1](https://developer.mozilla.org/zh-CN/docs/Web)]

`targetOrigin`

通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个 URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配 targetOrigin 提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。这个机制用来控制消息可以发送到哪些窗口；例如，当用 postMessage 传送密码时，这个参数就显得尤为重要，必须保证它的值与这条包含密码的信息的预期接受者的 origin 属性完全一致，来防止密码被恶意的第三方截获。**如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的 targetOrigin，而不是 \*。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。**

`transfer` 可选

是一串和 message 同时传递的 `Transferable` 对象。这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。





## Iframe

**HTML 内联框架元素 (<iframe>)** 表示嵌套的[browsing context](https://developer.mozilla.org/zh-CN/docs/Glossary/Browsing_context)。它能够将另一个 HTML 页面嵌入到当前页面中。 





本实例结合了iframe + postMessage 



## 使用方法

a文件夹启动一个http-server，b文件夹启动一个http-server，模拟跨域的情况

运行a.html打开F12可看到效果

a/b 为 iframe 发送效果

c为自己发自己效果

d/e 为d发送到e ，e接受数据的效果



## 问题

​	现在有两种情况写法：比如执行`window.open`返回的窗口对象、打开当前窗口的引用`window.opener`、iframe的contentWindow属性、命名过或数值索引的`window.frames` 

​	1.自己发自己

​	2.自己发别人

​	3.iframe的使用

​	如果你是a打开b ，想向b发送数据，是无法实现的，因为调用window.open()方法以后，远程 URL 不会被立即载入，载入过程是异步的。

​	







 











