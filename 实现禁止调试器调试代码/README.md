# 实现禁止调试器调试代码

1、首先，它检查了 location.hostname 是否包含特定的字符串（"127" 或 "localhost"），如果是的话，就不会进行后续的检测，允许调试。

2、如果不是上述情况，那么它会进一步检查 location.hostname 是否等于特定的域名（"vue-admin-beautiful.com" 或 "chu1204505056.gitee.io"），或者 noDebugger 变量为真。

3、如果满足上述条件，它会尝试在代码中插入一个 debugger 语句来阻止调试器。这个 debugger 语句会调用一个自执行的匿名函数，并在其中返回 false。通过这种方式，它会利用 constructor 函数调用 debugger 函数，然后用 call 方法来调用这个函数，这样就会触发调试器中断代码的执行。

4、最后，它用一个 setInterval 函数来不断调用这个匿名函数，以确保调试器无法调试代码。每隔 50 毫秒，它会重新执行一次。