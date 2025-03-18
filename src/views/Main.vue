<template>
    <div class="h-full pb-24 pl-10 pr-10 overflow-y-auto">
        <SimulationControls @simulation-mode-changed="getRegisters" @data-changed="getRegisters" />
        
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
        
        <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 shadow-lg max-w-md text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p class="text-lg font-semibold">Processando dados...</p>
                <p class="text-sm text-gray-600 mt-2">Aguarde enquanto carregamos seus registros</p>
            </div>
        </div>
        
    </div>
    <div class="fixed bottom-0 w-full text-center flex flex-row justify-center items-center bg-gradient-to-r from-[#38ef7d] to-[#11998e] z-20">
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
import RegisterModal from "../components/Modals/RegisterModal.vue";
import SimulationControls from "../components/SimulationControls.vue";
import dataService from "../services/dataService";
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
            registerOnModal: {},
            isLoading: false
        };
    },
    mounted() {
        this.getRegisters();
    },
    methods: {
        async getRegisters() {
            try {
                this.isLoading = true;
                this.registers = await dataService.getRegisters();
                this.updateTotals();
            } catch (error) {
                console.error("Erro ao carregar registros:", error);
            } finally {
                this.isLoading = false;
            }
        },
        
        updateTotals() {
            this.total = getTotal(this.registers);
            this.totalEntries = getTotal(getEntries(this.registers));
            this.totalExits = getTotal(getExits(this.registers));
        },
        
        async updateRegister(register: RegisterInterface) {
            try {
                this.isLoading = true;
                await dataService.updateRegister(register);
                await this.getRegisters();
            } catch (error) {
                console.error("Erro ao atualizar registro:", error);
            } finally {
                this.isLoading = false;
            }
        },
        
        async postRegister(register: Omit<RegisterInterface, "_id">) {
            try {
                this.isLoading = true;
                await dataService.createRegister(register);
                await this.getRegisters();
            } catch (error) {
                console.error("Erro ao criar registro:", error);
            } finally {
                this.isLoading = false;
            }
        },
        
        async deleteRegister(register: RegisterInterface) {
            try {
                this.isLoading = true;
                await dataService.deleteRegister(register._id);
                await this.getRegisters();
            } catch (error) {
                console.error("Erro ao excluir registro:", error);
            } finally {
                this.isLoading = false;
            }
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
        SimulationControls,
    },
};
</script>
