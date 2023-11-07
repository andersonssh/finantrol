<template>
    <nav class="fixed top-0 w-full bg-gradient-to-r from-[#38ef7d] to-[#11998e] z-20">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="#" class="flex items-center">
                <img
                    src="../assets/logo.svg"
                    class="h-10 mr-3"
                    alt="Flowbite Logo"
                />
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
                    >Finantrol</span
                >
            </a>
            <div class="hidden w-full md:block md:w-auto" id="navbar-dropdown">
                DIREITA
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
export default {
    name: "Navbar",
    data() {
        return {};
    },
};
</script>
