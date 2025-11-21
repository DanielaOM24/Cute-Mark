// services/axios.ts
import axios from "axios";

// Configuración base de axios
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "",
    headers: {
        "Content-Type": "application/json",
    },
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

export default apiClient;

