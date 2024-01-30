import "./assets/main.css";
import "./firebase";
import router from "./router";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { markRaw } from "vue";
const pinia = createPinia();

pinia.use(({ store }) => {
  store.router = markRaw(router); // Add the router instance using markRaw
});
import App from "./App.vue";

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");
