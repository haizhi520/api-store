// 检测是否在特定条件下禁止调试器调试代码
if (
  location.hostname.includes("127") ||
  location.hostname.includes("localhost") ||
  (("vue-admin-beautiful.com" === location.hostname ||
    "chu1204505056.gitee.io" === location.hostname ||
    noDebugger) &&
    (() => {
      try {
        // 演示地址禁止调试，如需调试代码请联系公司购买
        if (
          "vue-admin-beautiful.com" !== location.hostname &&
          "chu1204505056.gitee.io" !== location.hostname
        ) {
          console.error("演示地址禁止调试，如需调试代码请联系公司购买！");
        }

        // 在代码中插入一个 debugger 语句来阻止调试器
        setInterval(() => {
          (function () {
            return !1;
          })
            .constructor("debugger")
            .call();
        }, 50);
      } catch (e) {}
    })())
) {
  // 在特定条件下禁止调试器调试代码
}
