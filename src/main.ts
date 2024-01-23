import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import vue3GoogleLogin from "vue3-google-login";
import App from "./App.vue";
import Main from "./views/Main.vue";
import Login from "./views/Login.vue";
import Contact from "./views/Contact.vue";
import { useStorage } from "@vueuse/core";
import "./style.css";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { 
            path: "/",
            component: Main,
            beforeEnter: (__, ___, next) => {
                const currentUser = useStorage("currentUser", {}).value;
                if (Object.keys(currentUser).length > 0) {
                    next();
                } else {
                    next("/login");
                }
            }
        },
        { path: "/login", component: Login },
        { path: "/contact", component: Contact }
    ]
});

const app = createApp(App);

app.use(router);
app.use(vue3GoogleLogin, {
    clientId: "901323490185-a8891gatq3ugl3hl4eq3qgn9ukia2lue.apps.googleusercontent.com"
})
app.mount("#app");
