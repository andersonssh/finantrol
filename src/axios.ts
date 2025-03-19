import axios from "axios";
import { useStorage } from "@vueuse/core";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(config => {
    const token = useStorage("token", "").value;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            const tokenStorage = useStorage("token", "");
            const currentUserStorage = useStorage("currentUser", {});
            
            tokenStorage.value = "";
            currentUserStorage.value = {};
            
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
