const mycomponent = Vue.component("CustomElSelect", {
  props: ["value"],
  data() {
    return {
      internalValue: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.internalValue = newVal;
    },
  },
  render(h) {
    return h(
      "el-select",
      {
        props: { value: this.internalValue },
        on: {
          input: (value) => {
            this.internalValue = value;
            this.$emit("input", value);
          },
        },
      },
      [
        h("el-option", { props: { label: "SDK", value: "SDK" } }),
        h("el-option", {
          props: { label: "GB28181-2016", value: "GB28181-2016" },
        }),
      ]
    );
  },
});

export default mycomponent;