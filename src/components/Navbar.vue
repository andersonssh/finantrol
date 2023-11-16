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
            <div v-if="isLogged(currentUser)" class="flex items-center">
                <router-link to="/contact" class="mx-4 mt-1 text-gray-200">
                    CONTATO
                </router-link>
                <div class="relative block -mb-2">
                    <Menu>
                        <MenuButton class="h-10 w-10 text-gray-200">
                            <UserCircleIcon class=""/>
                        </MenuButton>

                        <MenuItems class="flex flex-col absolute right-0 bg-slate-200 w-40">
                            <MenuItem v-slot="{ active }" class="p-2 bg-gray-50 border">
                                <div :class='{ "bg-blue-500": active }' @click="$emit('logOut')">
                                    {{ currentUser.name?.split(" ")[0] }}

                                </div>
                            </MenuItem>
                            <MenuItem v-slot="{ active }" class="p-2 bg-gray-50 border hover:bg-[#11998e] hover:text-white hover:cursor-pointer transition duration-200">
                                <div :class='{ "bg-blue-500": active }' @click="$emit('logOut')">
                                    SAIR
                                </div>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
            <div v-else>
                <div class="hidden sm:block w-auto text-gray-100">
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
                <div class="relative sm:hidden block -mb-2">
                    <Menu>
                        <MenuButton class="h-10 w-10 text-gray-200">
                            <Bars3Icon />
                        </MenuButton>
                        <MenuItems class="flex flex-col absolute right-0 bg-slate-200 w-40">
                            <MenuItem v-slot="{ active }" class="p-2 bg-gray-50 border hover:bg-[#11998e] hover:text-white hover:cursor-pointer transition duration-200">
                                <router-link to="/contact" :class='{ "bg-blue-500": active }'>
                                    CONTATO
                                </router-link>
                            </MenuItem>
                            <MenuItem v-slot="{ active }" class="p-2 bg-gray-50 border hover:bg-[#11998e] hover:text-white hover:cursor-pointer transition duration-200">
                                <router-link to="/login" :class='{ "bg-blue-500": active }' >
                                    ENTRAR
                                </router-link>
                            </MenuItem>
                            <MenuItem v-slot="{ active }" class="p-2 bg-gray-50 border hover:bg-[#11998e] hover:text-white hover:cursor-pointer transition duration-200">
                                <router-link to="/login" :class='{ "bg-blue-500": active }'>
                                    CADASTRAR-SE
                                </router-link>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
        </div>
    </nav> 
    
</template>

<script lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { Bars3Icon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { useStorage } from '@vueuse/core';

export default {
    name: "Navbar",
    data() {
        return {
            currentUser: useStorage("currentUser", {}),
        };
    },
    emits: ["logOut"],
    components: {
        Menu, MenuButton, MenuItems, MenuItem, Bars3Icon, UserCircleIcon
    },
    methods: {
        isLogged(user: Object){
            return Object.keys(user || {}).length > 0
        }
    }

};
</script>
