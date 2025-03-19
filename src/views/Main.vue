<template>
    <div class="h-full pb-52 sm:pb-38 pl-10 pr-10 overflow-y-auto" ref="mainContainer">
        <SimulationControls @simulation-mode-changed="getRegisters" @data-changed="getRegisters" />
        
        <div class="flex flex-row flex-wrap justify-center">
            <Register
                :registerProp="register"
                @delete="deleteRegister(register)"
                @edit="editRegisterEvent(register)"
                @payment-status-changed="handlePaymentStatusChanged"
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
        
        <div 
            v-if="showFloatingTotal" 
            class="fixed top-[68px] left-0 right-0 bg-gradient-to-r from-indigo-900 to-purple-800 p-2 shadow-lg text-center z-10 animate-fadeIn"
        >
            <div class="text-white text-base font-medium">TOTAL</div>
            <div class="text-xl sm:text-2xl font-bold text-white">{{ total }}</div>
        </div>
    </div>
    <div class="fixed bottom-0 w-full text-center bg-gradient-to-r from-indigo-900 to-purple-800 shadow-lg z-20">
        <div class="bg-indigo-800 bg-opacity-70 py-1 px-2 border-t border-indigo-600">
            <div class="text-white text-base sm:text-lg font-medium">TOTAL</div>
            <div class="text-xl sm:text-2xl md:text-3xl font-bold text-white">{{ total }}</div>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-1 py-1 px-2">
            <div class="bg-indigo-800 bg-opacity-50 rounded-lg py-1 px-2 text-white">
                <div class="text-sm sm:text-base md:text-lg font-medium text-green-400">
                    ENTRADAS
                </div>
                <div class="text-base sm:text-xl md:text-2xl font-bold">
                    {{ totalEntries }}
                </div>
            </div>
            
            <div class="bg-indigo-800 bg-opacity-50 rounded-lg py-1 px-2 text-white">
                <div class="text-sm sm:text-base md:text-lg font-medium text-red-400">
                    SAÍDAS
                </div>
                <div class="text-base sm:text-xl md:text-2xl font-bold">
                    {{ totalExits }}
                </div>
            </div>
            
            <div class="bg-indigo-800 bg-opacity-50 rounded-lg py-1 px-2 text-white">
                <div class="text-sm sm:text-base md:text-lg font-medium text-yellow-400">
                    PAGO
                </div>
                <div class="text-base sm:text-xl md:text-2xl font-bold">
                    {{ totalPaid }}
                </div>
            </div>
            
            <div class="bg-indigo-800 bg-opacity-50 rounded-lg py-1 px-2 text-white">
                <div class="text-sm sm:text-base md:text-lg font-medium text-blue-400">
                    A PAGAR
                </div>
                <div class="text-base sm:text-xl md:text-2xl font-bold">
                    {{ totalUnpaid }}
                </div>
            </div>
        </div>
        
        <button @click="newRegisterEvent" class="rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl mx-auto fixed -bottom-1 left-1/2 transform -translate-x-1/2 z-30 border-2 border-indigo-200">
            <i class="fa-solid fa-file-circle-plus text-white text-3xl sm:text-4xl"></i>
        </button>
    </div>
    <RegisterModal @submit="registerModalSubmitHandler" @cancel="registerModalCancelHandler" :registerProp="registerOnModal" v-if="registerModalIsOpen"/>
</template>

<script lang="ts">
import Register from "../components/Cards/Register.vue";
import RegisterModal from "../components/Modals/RegisterModal.vue";
import SimulationControls from "../components/SimulationControls.vue";
import dataService from "../services/dataService";
import { Register as RegisterInterface, getTotal, getEntries, getExits, getSortedRegisters, getRegisterValue } from '../register';

export default {
    name: "Main",
    data() {
        return {
            registers: [] as RegisterInterface[],
            total: 0,
            totalEntries: 0,
            totalExits: 0,
            totalPaid: 0,
            totalUnpaid: 0,
            registerModalIsOpen: false,
            registerOnModal: {} as Partial<RegisterInterface>,
            isLoading: false,
            showFloatingTotal: false
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
        
        handlePaymentStatusChanged(updatedRegister: RegisterInterface) {
            const index = this.registers.findIndex(r => r._id === updatedRegister._id);
            if (index !== -1) {
                this.registers[index].isPaid = updatedRegister.isPaid;
                
                this.updateTotals();
            }
        },
        
        updateTotals() {
            this.total = getTotal(this.registers);
            this.totalEntries = getTotal(getEntries(this.registers));
            this.totalExits = getTotal(getExits(this.registers));
            
            const exits = getExits(this.registers);
            const paidExits = exits.filter(reg => reg.isPaid);
            const unpaidExits = exits.filter(reg => !reg.isPaid);
            
            this.totalPaid = Number(Math.abs(paidExits.reduce((acc, reg) => acc + getRegisterValue(reg), 0)).toFixed(2));
            this.totalUnpaid = Number(Math.abs(unpaidExits.reduce((acc, reg) => acc + getRegisterValue(reg), 0)).toFixed(2));
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
            this.registerOnModal = {} as Partial<RegisterInterface>;
            this.registerModalIsOpen = true;
        },
        
        editRegisterEvent(register: RegisterInterface){
            this.registerOnModal = register;
            this.registerModalIsOpen = true;
        },
        
        registerModalSubmitHandler(register: RegisterInterface){
            if(register._id){
                this.updateRegister(register);
            } else {
                this.postRegister(register);
            }
            this.registerOnModal = {} as Partial<RegisterInterface>;
            this.registerModalIsOpen = false;
        },
        
        registerModalCancelHandler(){
            this.registerOnModal = {} as Partial<RegisterInterface>;
            this.registerModalIsOpen = false;
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

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 0.95;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out forwards;
}
</style>
