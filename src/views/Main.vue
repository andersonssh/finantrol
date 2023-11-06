<template>
    <div class="h-full pt-16 pb-24 pl-10 pr-10 overflow-y-auto bg-yellow-500">
        <div class="text-5xl text-center mt-10 mb-10">total: {{ total }}</div>
        <Register
            :registerProp="register"
            @delete="deleteRegister(register)"
            @edit="editRegisterEvent(register)"
            v-for="register in registers"
            v-bind:key="JSON.stringify(register)"
        />
    </div>
    <div class="absolute bottom-0 w-full bg-red-500 text-center">
        ENTRADAS: {{ totalEntries }}
        <button @click="toggleRegisterModalIsOpen" class="rounded-full w-40 h-40 bg-yellow-50">
            criar novo registro
        </button>
        SAIDAS: {{ Math.abs(totalExits) }}
    </div>
    <RegisterModal @submit="registerModalSubmitHandler" @cancel="toggleRegisterModalIsOpen" :registerProp="registerOnModal" v-if="registerModalIsOpen"/>
</template>

<script lang="ts">
import Register from "../components/Cards/Register.vue";
import api from "../axios";
import RegisterModal from "../components/Modals/RegisterModal.vue";
import { Register as RegisterInterface, getTotal, getEntries, getExits } from '../register';

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
            this.toggleRegisterModalIsOpen()
        },
        editRegisterEvent(register: RegisterInterface){
            this.registerOnModal = register
            this.toggleRegisterModalIsOpen()
        },
        registerModalSubmitHandler(register: RegisterInterface){
            if(register._id){
                this.updateRegister(register)
            }else{
                this.postRegister(register)
            }
            this.toggleRegisterModalIsOpen()
        },
        toggleRegisterModalIsOpen(){
            this.registerModalIsOpen = !this.registerModalIsOpen
        }
    },
    components: {
        Register,
        RegisterModal,
    },
};
</script>
