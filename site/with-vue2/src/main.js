import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
new Vue({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  render: (h) => h(App),
}).$mount("#app");
