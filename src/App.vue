<template>
    <div class="h-screen">
        <Navbar @logOut="logOut"/>
        <div class="h-full pt-[68px]">
            <router-view >
            </router-view>
        </div>
        

    </div>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<script lang="ts">
import Navbar from "./components/Navbar.vue";
import { useStorage } from "@vueuse/core";

export default {
    name: "App",
    data() {
        return {
            currentUser: useStorage("currentUser", {}),
            token: useStorage("token", ""),
        };
    },
    components: {
        Navbar
    },
    methods: {
        logOut() {
            this.currentUser = {}
            this.token = ""
        },
    },
    watch: {
        currentUser: {
            handler(__, ___) {
                if (Object.keys(this.currentUser).length > 0){
                    return
                }
                this.$router.push("/login");
            }
        },
    },
}
</script>
