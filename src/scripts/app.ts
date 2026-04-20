import { createApp } from "vue";
import * as composables from "@/scripts/composables";

import "@/css/style.css";
import App from "@/main/App.vue";

const app = createApp(App);

composables.compose.forEach((data) => {
  const key = `$${data.index}`;

  app.config.globalProperties[key] = Object.fromEntries(
    data.list.map((item) => [item.index, item.value]),
  );
});

app.mount("#app");
