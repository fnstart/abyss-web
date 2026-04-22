import { createApp } from "vue";
import { injectSpeedInsights } from "@vercel/speed-insights";
import * as composables from "@/scripts/composables";

import VueSmoothScroll from "vue3-smooth-scroll";

import "@/css/style.css";
import App from "@/main/App.vue";

injectSpeedInsights();

const app = createApp(App);

composables.compose.forEach((data) => {
  const key = `$${data.index}`;

  app.config.globalProperties[key] = Object.fromEntries(
    data.list.map((item) => [item.index, item.value]),
  );
});

app.use(VueSmoothScroll);
app.mount("#app");
