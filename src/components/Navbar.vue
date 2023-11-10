<template>
    <nav class="fixed top-0 w-full bg-gradient-to-r from-[#38ef7d] to-[#11998e] z-20">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <router-link to="/" class="flex items-center">
                <img
                    src="../assets/logo.svg"
                    class="h-10 mr-3"
                    alt="Flowbite Logo"
                />
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
                    >Finantrol</span
                >
            </router-link>
            <div class="hidden w-full md:block md:w-auto text-gray-100">
                <router-link to="/contact" class="mx-2">
                    CONTATO
                </router-link>
                <router-link to="/login">
                    <button class="btn bg-blue-600 mx-2">
                        ENTRAR
                    </button>
                </router-link>

                <router-link to="/login">
                    <button class="btn bg-yellow-500 mx-2">
                        CADASTRE-SE
                    </button>
                </router-link>
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
