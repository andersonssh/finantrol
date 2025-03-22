<template>
  <div class="simulation-controls p-4 bg-blue-100 rounded-lg shadow-md mb-5">
    <div class="flex flex-col sm:flex-row justify-between items-center">
      <div class="flex items-center mb-3 sm:mb-0">
        <div class="toggle-container flex items-center">
          <label class="flex items-center cursor-pointer">
            <div class="mr-3 text-gray-700 font-medium">
              Modo de Simulação
            </div>
            <div class="relative">
              <input 
                type="checkbox" 
                class="sr-only" 
                :checked="isSimulationMode"
                @change="toggleSimulation"
              />
              <div class="block bg-gray-300 w-14 h-8 rounded-full"></div>
              <div 
                class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
                :class="{ 'transform translate-x-6 bg-green-400': isSimulationMode }"
              ></div>
            </div>
          </label>
        </div>
        <div v-if="isSimulationMode" class="ml-4 text-green-600 font-semibold">
          Ativo
        </div>
        <div v-else class="ml-4 text-gray-500 font-semibold">
          Inativo
        </div>
      </div>

      <div v-if="isSimulationMode" class="flex space-x-2 flex-wrap">
        <button 
          @click="reloadRealData" 
          class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors mb-2 sm:mb-0"
          title="Carregar dados reais"
        >
          <i class="fa-solid fa-database mr-2"></i>Sincronizar
        </button>
        <button 
          @click="clearSimulationData" 
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors mb-2 sm:mb-0"
          title="Limpar todos os registros"
        >
          <i class="fa-solid fa-trash-can mr-2"></i>Limpar
        </button>
        <button 
          @click="exportSimulation" 
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-2 sm:mb-0"
          title="Exportar simulação atual"
        >
          <i class="fa-solid fa-file-export mr-2"></i>Exportar
        </button>
        <label 
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer mb-2 sm:mb-0"
          title="Importar simulação"
        >
          <i class="fa-solid fa-file-import mr-2"></i>Importar
          <input 
            type="file" 
            accept=".json" 
            class="hidden" 
            @change="importSimulation"
          />
        </label>
      </div>
    </div>

    <div v-if="isSimulationMode" class="mt-3 text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
      <p class="font-semibold mb-1">Simule novos gastos ou entradas (não afeta os dados reais)</p>
      <p class="mt-1">SINCRONIZAR: copia os dados reais para o ambiente de simulação . LIMPAR: Apaga todos os registros da simulação. EXPORTAR: gera um arquivo com os dados da simulação. IMPORTAR: gera uma simulação apartir de um arquivo.</p>
    </div>
    
    <div v-if="showNotification" class="mt-2 p-2 rounded" :class="notificationClass">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import dataService from '../services/dataService';

export default {
  name: 'SimulationControls',
  data() {
    return {
      isSimulationMode: false,
      showNotification: false,
      notificationMessage: '',
      notificationClass: ''
    };
  },
  created() {
    this.isSimulationMode = dataService.isInSimulationMode();
  },
  methods: {
    async toggleSimulation() {
      this.isSimulationMode = await dataService.toggleSimulationMode();
      this.$emit('simulation-mode-changed', this.isSimulationMode);
    },
    async reloadRealData() {
      await dataService.reloadRealData();
      this.$emit('data-changed');
    },
    clearSimulationData() {
      dataService.clearSimulationData();
      this.$emit('data-changed');
      this.showInfoNotification('Todos os registros foram removidos');
    },
    exportSimulation() {
      dataService.exportSimulationData();
      this.showSuccessNotification('Simulação exportada com sucesso');
    },
    importSimulation(event: Event) {
      const fileInput = event.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      
      if (!file) {
        this.showErrorNotification('Nenhum arquivo selecionado');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        try {
          const success = dataService.importSimulationData(content);
          if (success) {
            this.$emit('data-changed');
            this.showSuccessNotification('Simulação importada com sucesso');
          } else {
            this.showErrorNotification('Erro ao importar simulação');
          }
        } catch (error) {
          this.showErrorNotification('Erro ao processar o arquivo');
          console.error('Erro ao importar simulação:', error);
        }
      };
      
      reader.onerror = () => {
        this.showErrorNotification('Erro ao ler o arquivo');
      };
      
      reader.readAsText(file);
      
      fileInput.value = '';
    },
    
    showSuccessNotification(message: string) {
      this.notificationMessage = message;
      this.notificationClass = 'bg-green-100 text-green-800 border border-green-300';
      this.showNotification = true;
      this.hideNotificationAfterDelay();
    },
    showErrorNotification(message: string) {
      this.notificationMessage = message;
      this.notificationClass = 'bg-red-100 text-red-800 border border-red-300';
      this.showNotification = true;
      this.hideNotificationAfterDelay();
    },
    showInfoNotification(message: string) {
      this.notificationMessage = message;
      this.notificationClass = 'bg-blue-100 text-blue-800 border border-blue-300';
      this.showNotification = true;
      this.hideNotificationAfterDelay();
    },
    hideNotificationAfterDelay() {
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.toggle-container input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #48bb78;
}
</style> 