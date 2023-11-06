<template>
    <div class="h-full pt-16 pb-24 pl-10 pr-10 overflow-y-auto bg-yellow-500">
        <div class="text-5xl text-center mt-10 mb-10">total: {{ exit }}</div>
        <Register
            :registerProp="register"
            @delete="deleteRegister(register)"
            @edit="editRegisterEvent(register)"
            v-for="register in registers"
            v-bind:key="register._id"
        />
    </div>
    <div class="absolute bottom-0 w-full bg-red-500 text-center">x</div>
    <RegisterModal @submit="registerModalSubmitHandler" @cancel="toggleRegisterModalIsOpen" :registerProp="registerOnModal" v-if="registerModalIsOpen"/>
</template>

<script lang="ts">
import Register from "../components/Cards/Register.vue";
import api from "../axios";
import RegisterModal from "../components/Modals/RegisterModal.vue";

export default {
    name: "Main",
    data() {
        return {
            registers: [],

            total: 100,
            entry: 200,
            exit: 100,
            registerModalIsOpen: false,
            registerOnModal: {}
        };
    },
    mounted() {
        this.getRegisters();
    },
    methods: {
        async getRegisters() {
            const response = await api.get("/registers");
            this.registers = response.data.data;
        },
        //update register
        async updateRegister(register) {
            const response = await api.put(`/registers/${register._id}`, register);
            this.getRegisters();
        },
        async postRegister(register){
            const response = await api.post("/registers", register)
            this.getRegisters();
        },
        async deleteRegister(register) {
            const response = await api.delete(`/registers/${register._id}`);
            this.getRegisters();
        },
        newRegisterEvent(){
            this.registerOnModal = {}
            this.toggleRegisterModalIsOpen()
        },
        editRegisterEvent(register){
            this.registerOnModal = register
            this.toggleRegisterModalIsOpen()
        },
        registerModalSubmitHandler(register){
            if(register._id){
                this.updateRegister(register)
            }else{
                this.postRegister(register)
            }
            this.getRegisters()
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
