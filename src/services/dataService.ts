import api from "../axios";
import { Register } from "../register";
import { useStorage } from "@vueuse/core";


let simulationData: Register[] = [];
let isSimulationMode = useStorage("isSimulationMode", false);

function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

export default {
  async toggleSimulationMode() {
    isSimulationMode.value = !isSimulationMode.value;
    
    if (isSimulationMode.value && simulationData.length === 0) {
      await this.initializeWithRealData();
    }
    
    return isSimulationMode.value;
  },
  
  isInSimulationMode() {
    return isSimulationMode.value;
  },
  
  async initializeWithRealData() {
    try {
      const originalMode = isSimulationMode.value;
      isSimulationMode.value = false;
    
      const realData = await this.getRegisters();
      
      isSimulationMode.value = originalMode;
      
      if (realData && Array.isArray(realData) && realData.length > 0) {
        simulationData = [...realData];
      } else {
        simulationData = [];
      }
      
      return [...simulationData];
    } catch (error) {
      console.error("Erro ao carregar dados reais para simulação:", error);
      simulationData = [];
      return [];
    }
  },
  
  clearSimulationData() {
    simulationData = [];
    return [...simulationData];
  },
  
  async reloadRealData() {
    if (isSimulationMode.value) {
      await this.initializeWithRealData();
      return [...simulationData];
    }
    return [];
  },
  
  exportSimulationData() {
    const dateStr = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const exportData = {
      name: `Simulação ${dateStr}`,
      createdAt: new Date().toISOString(),
      data: [...simulationData]
    };
    
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `finantrol-simulacao-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return exportData;
  },
  
  importSimulationData(jsonData: string): boolean {
    try {
      const importedData = JSON.parse(jsonData);
      
      if (!importedData.data || !Array.isArray(importedData.data)) {
        throw new Error('Formato de dados inválido');
      }
      
      for (const reg of importedData.data) {
        if (!reg.description || !reg.category || typeof reg.value !== 'number') {
          throw new Error('Dados de registro inválidos');
        }
        
        if (!reg._id) {
          reg._id = generateId();
        }
      }
      
      simulationData = [...importedData.data];
      
      if (!isSimulationMode.value) {
        isSimulationMode.value = true;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao importar dados de simulação:', error);
      return false;
    }
  },
  
  async getRegisters() {
    if (isSimulationMode.value) {
      return [...simulationData];
    } else {
      const user_token = useStorage("token", "").value;
      const response = await api.get("/registers", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user_token}`,
        },
      });
      return response.data.data;
    }
  },
  
  async createRegister(register: Omit<Register, "_id">) {
    if (isSimulationMode.value) {
      const newRegister = {
        ...register,
        _id: generateId(),
      };
      simulationData.push(newRegister);
      return newRegister;
    } else {
      const user_token = useStorage("token", "").value;
      const response = await api.post("/registers", register, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user_token}`,
        },
      });
      return response.data;
    }
  },
  
  async updateRegister(register: Register) {
    if (isSimulationMode.value) {
      const index = simulationData.findIndex(r => r._id === register._id);
      if (index !== -1) {
        simulationData[index] = { ...register };
        return register;
      }
      return null;
    } else {
      const user_token = useStorage("token", "").value;
      const response = await api.put(`/registers/${register._id}`, register, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user_token}`,
        },
      });
      return response.data;
    }
  },
  
  async deleteRegister(registerId: string) {
    if (isSimulationMode.value) {
      const index = simulationData.findIndex(r => r._id === registerId);
      if (index !== -1) {
        const deleted = simulationData.splice(index, 1)[0];
        return deleted;
      }
      return null;
    } else {
      const user_token = useStorage("token", "").value;
      const response = await api.delete(`/registers/${registerId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user_token}`,
        },
      });
      return response.data;
    }
  }
};