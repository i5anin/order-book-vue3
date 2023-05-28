import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/store.js";

// Создайте экземпляр хранилища Vuex
createApp(App).use(store).mount("#app");

// Создайте экземпляр приложения Vue и передайте хранилище в качестве опции
const app = createApp(App);
app.use(store);
app.mount("#app");
