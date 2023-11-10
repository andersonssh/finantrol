import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Main from "./views/Main.vue";
import Login from "./views/Login.vue";
import Contact from "./views/Contact.vue";
import "./style.css";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Main },
        { path: "/login", component: Login },
        { path: "/contact", component: Contact }
    ],
});

const app = createApp(App);

app.use(router);

app.mount("#app");
