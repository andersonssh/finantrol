<template>
    <div class="h-full pb-24 pl-10 pr-10 overflow-y-auto">
        <div class="text-2xl md:text-4xl text-center mt-5 mb-5">
            <div>
                    TOTAL
            </div>
            <div>
                {{ total }}
            </div>
        </div>
        <div class="flex flex-row flex-wrap justify-center">
            <Register
                :registerProp="register"
                @delete="deleteRegister(register)"
                @edit="editRegisterEvent(register)"
                v-for="register in getSortedRegisters(registers)"
                v-bind:key="JSON.stringify(register)"
                class="m-2 sm:m-3 md:m-4 w-[400px] sm:w-[350px]"
            />
        </div>
        
    </div>
    <div class="absolute bottom-0 w-full text-center flex flex-row justify-center items-center bg-gradient-to-r from-[#38ef7d] to-[#11998e] z-20">
        <div class="mr-10">
            <div class="text-lg sm:text-2xl md:text-4xl text-green-900">
                ENTRADAS
            </div>
            <span class="text-lg sm:text-2xl md:text-4xl">
                {{ totalEntries }}
            </span>
        </div>
        
        <button @click="newRegisterEvent" class="rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-600 mx-4 my-4 btn-animated">
            <i class="fa-solid fa-plus text-white text-5xl"></i>
        </button>
        <div class="ml-10">
            <div class="text-lg sm:text-2xl md:text-4xl text-red-600">
                SAÍDAS
            </div>
            <span class="text-lg sm:text-2xl md:text-4xl">
                {{ totalExits }}
            </span>
        </div>
    </div>
    <RegisterModal @submit="registerModalSubmitHandler" @cancel="registerModalCancelHandler" :registerProp="registerOnModal" v-if="registerModalIsOpen"/>
</template>

<script lang="ts">
import Register from "../components/Cards/Register.vue";
import api from "../axios";
import RegisterModal from "../components/Modals/RegisterModal.vue";
import { Register as RegisterInterface, getTotal, getEntries, getExits, getSortedRegisters } from '../register';

export default {
    name: "Main",
    data() {
        return {
            registers: [],

            total: 0,
            totalEntries: 0,
            totalExits: 0,
            registerModalIsOpen: false,
            registerOnModal: {}
        };
    },
    mounted() {
        this.getRegisters();
    },
    methods: {
        getRegisters() {
            api.get("/registers").then((response) => {
                this.registers = response.data.data;
                this.total = getTotal(this.registers)
                this.totalEntries = getTotal(getEntries(this.registers))
                this.totalExits = getTotal(getExits(this.registers))
            });

        },
        //update register
        updateRegister(register: RegisterInterface) {
            api.put(`/registers/${register._id}`, register).then((_) => {
                this.getRegisters();
            });
        },
        postRegister(register: RegisterInterface){
            api.post(`/registers`, register).then((_) => {
                this.getRegisters();
            });
        },
        deleteRegister(register: RegisterInterface) {
            api.delete(`/registers/${register._id}`).then((_) => {
                this.getRegisters();
            });
        },
        newRegisterEvent(){
            this.registerOnModal = {}
            this.registerModalIsOpen = true
        },
        editRegisterEvent(register: RegisterInterface){
            this.registerOnModal = register
            this.registerModalIsOpen = true
        },
        registerModalSubmitHandler(register: RegisterInterface){
            if(register._id){
                this.updateRegister(register)
            }else{
                this.postRegister(register)
            }
            this.registerOnModal = {}
            this.registerModalIsOpen = false
        },
        registerModalCancelHandler(){
            this.registerOnModal = {}
            this.registerModalIsOpen = false
        },
        getSortedRegisters
    },
    components: {
        Register,
        RegisterModal,
    },
};
</script>
