<template>
    <div class="bg-gray-200 h-full overflow-hidden flex items-center justify-center">
        <div class="bg-white w-10/12 sm:w-[550px] shadow-3xl">
            <div
                class="bg-gray-800 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 md:p-8"
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFF">
                    <path
                        d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"
                    />
                </svg>
            </div>
            <div class="h-32 flex justify-center pt-16 pb-6 px-12">
                <div class="hover:cursor-pointer">
                    <GoogleLogin :callback="googleLoginCallback"/>
                </div>
            </div>
            <div class="relative mt-10 h-px bg-gray-300">
                <div class="absolute left-0 top-0 flex justify-center w-full -m-2">
                    <span class="bg-white px-4 text-xs text-gray-500 uppercase"
                        >ou entre com seu email</span
                    >
                </div>
            </div>
            <div class="p-12 md:p-24">
                <div class="flex items-center text-lg mb-6 md:mb-8">
                    <svg class="absolute ml-3" width="24" viewBox="0 0 24 24">
                        <path
                            d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z"
                        />
                    </svg>
                    <input
                        type="text"
                        id="email"
                        class="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full"
                        placeholder="Email"
                    />
                </div>
                <div class="flex items-center text-lg mb-6 md:mb-8">
                    <svg class="absolute ml-3" viewBox="0 0 24 24" width="24">
                        <path
                            d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z"
                        />
                    </svg>
                    <input
                        type="password"
                        id="password"
                        class="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full"
                        placeholder="Senha"
                    />
                </div>
                <button class="btn-green font-medium p-2 md:p-4 text-white uppercase w-full disabled:cursor-not-allowed" disabled>
                    Login
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GoogleLogin } from 'vue3-google-login';
import api from "../axios";
import { useStorage } from "@vueuse/core";

api.get("/").then(() => {
    console.log("API is working")
}).catch(() => {
    console.log("API is not working")
})

export default {
    data() {
        return {
            token: useStorage("token", ""),
            currentUser: useStorage("currentUser", {})
        };
    },
    emits: ["googleLogin"],
    components: {
        GoogleLogin
    },
    methods: {
        googleLoginCallback(googleResponse: Object) {
            api.post("/google_login", googleResponse).then((response) => {
                this.token = response.data.token;
                this.currentUser = response.data.user;
                this.$router.push("/");
            }).catch(() => {
                alert("Erro ao fazer login com o Google")
            })
        }
    },
};
</script>
