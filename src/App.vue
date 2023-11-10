<template>
    <div class="h-screen">
        <Navbar :isLogged="isLogged" :username="username" @exit="exit"/>
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

export default {
    name: "App",
    data() {
        return {
            username: "Seila",
            isLogged: true,
        };
    },
    components: {
        Navbar,
    },
    methods: {
        exit() {
            this.isLogged = false;
            this.$router.push("/login");
        },
    },
}
</script>
