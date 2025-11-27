// services/axios.ts
import axios from "axios";

// Configuración base de axios
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 segundos de timeout
});

// Interceptor para agregar tokens si es necesario
apiClient.interceptors.request.use(
    (config) => {
        // Aquí puedes agregar lógica para tokens de autenticación si es necesario
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Error de respuesta del servidor
            return Promise.reject(error);
        } else if (error.request) {
            // Error de red
            return Promise.reject(new Error("Error de conexión"));
        } else {
            // Otro error
            return Promise.reject(error);
        }
    }
);

// Funciones helper para APIs comunes
export const emailAPI = {
    enviar: async (datos: any) => {
        const response = await apiClient.post("/api/send-email", datos);
        return response.data;
    }
};

export const authAPI = {
    registro: async (datos: any) => {
        const response = await apiClient.post("/api/register", datos);
        return response.data;
    }
};

export const validacionAPI = {
    probar: async (datos: any) => {
        const response = await apiClient.post("/api/test-validacion", datos);
        return response.data;
    }
};

export default apiClient;

