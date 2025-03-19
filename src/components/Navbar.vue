<template>
    <nav class="fixed top-0 w-full bg-gradient-to-r from-indigo-900 to-purple-800 z-20 shadow-lg">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
            <router-link to="/" class="flex items-center">
                <img
                    src="/assets/logo.svg"
                    class="h-9 mr-2"
                />
                <span class="self-center text-xl font-semibold whitespace-nowrap text-white"
                    >Finantrol</span
                >
            </router-link>
            
            <div v-if="isSimulationMode" class="absolute left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-b-lg shadow-md flex items-center">
                <i class="fa-solid fa-flask-vial sm:mr-2"></i>
                <span class="hidden sm:inline">MODO SIMULAÇÃO</span>
            </div>
            
            <div v-if="isLogged(currentUser)" class="flex items-center">
                <router-link to="/contact" class="mx-4 mt-1 text-gray-100 hover:text-white hover:underline transition-colors duration-200">
                    CONTATO
                </router-link>
                <div class="relative block -mb-2">
                    <Menu>
                        <MenuButton class="h-10 w-10 text-gray-200 hover:text-white transition-colors duration-200">
                            <UserCircleIcon class=""/>
                        </MenuButton>

                        <MenuItems class="flex flex-col absolute right-0 bg-indigo-50 w-40 rounded-md overflow-hidden shadow-lg">
                            <MenuItem v-slot="{ active }" class="p-2 border-b border-indigo-100">
                                <div :class='{ "bg-indigo-200": active }' class="px-2 py-1 rounded">
                                    {{ currentUser.name?.split(" ")[0] }}

                                </div>
                            </MenuItem>
                            <MenuItem v-slot="{ active }" class="p-2">
                                <div :class='{ "bg-indigo-200": active }' @click="$emit('logOut')" class="px-2 py-1 rounded hover:bg-indigo-500 hover:text-white transition-colors duration-200 cursor-pointer">
                                    SAIR
                                </div>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
            <div v-else>
                <div class="hidden sm:block w-auto text-gray-100">
                    <router-link to="/contact" class="mx-2 hover:text-white hover:underline transition-colors duration-200">
                        CONTATO
                    </router-link>
                    <router-link to="/login">
                        <button class="btn bg-blue-600 hover:bg-blue-700 mx-2 transition-colors duration-200">
                            ENTRAR
                        </button>
                    </router-link>

                    <router-link to="/login">
                        <button class="btn bg-purple-600 hover:bg-purple-700 mx-2 transition-colors duration-200">
                            CADASTRE-SE
                        </button>
                    </router-link>
                </div>
                <div class="relative sm:hidden block -mb-2">
                    <Menu>
                        <MenuButton class="h-10 w-10 text-gray-200 hover:text-white transition-colors duration-200">
                            <Bars3Icon />
                        </MenuButton>
                        <MenuItems class="flex flex-col absolute right-0 bg-indigo-50 w-40 rounded-md overflow-hidden shadow-lg">
                            <MenuItem v-slot="{ active }" class="p-2 border-b border-indigo-100">
                                <router-link to="/contact" :class='{ "bg-indigo-200": active }' class="block px-2 py-1 rounded hover:bg-indigo-500 hover:text-white transition-colors duration-200">
                                    CONTATO
                                </router-link>
                            </MenuItem>
                            <MenuItem v-slot="{ active }" class="p-2 border-b border-indigo-100">
                                <router-link to="/login" :class='{ "bg-indigo-200": active }' class="block px-2 py-1 rounded hover:bg-indigo-500 hover:text-white transition-colors duration-200">
                                    ENTRAR
                                </router-link>
                            </MenuItem>
                            <MenuItem v-slot="{ active }" class="p-2">
                                <router-link to="/login" :class='{ "bg-indigo-200": active }' class="block px-2 py-1 rounded hover:bg-indigo-500 hover:text-white transition-colors duration-200">
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
import dataService from '../services/dataService';

export default {
    name: "Navbar",
    data() {
        return {
            currentUser: useStorage("currentUser", {name: ""}),
        };
    },
    computed: {
        isSimulationMode() {
            return dataService.isInSimulationMode();
        }
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
