<template>
    <div class="h-screen">
        <Navbar @logOut="logOut"/>
        <div class="h-full pt-[60px]">
            <router-view>
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

.privacy-mode {
    filter: blur(20px);
    -webkit-filter: blur(20px);
    opacity: 0.1;
    pointer-events: none;
    transition: all 0.3s ease;
    position: relative;
}

.privacy-mode::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9999;
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
            isHidden: false,
        };
    },
    components: {
        Navbar
    },
    methods: {
        logOut() {
            this.currentUser = {}
            this.token = ""
        }
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
