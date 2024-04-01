import axios from "axios";

// para import.meta.env.VITE_API_URL funcionar,
// é necessário adicionar o "VITE_" no início da variável de ambiente
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export default api;
