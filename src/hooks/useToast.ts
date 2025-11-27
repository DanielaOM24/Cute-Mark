// hooks/useToast.ts
// Hook personalizado para notificaciones con react-toastify
import { toast, ToastOptions } from "react-toastify";

// Configuración por defecto para todos los toasts
const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

export function useToast() {
    return {
        // Toast de éxito (verde)
        success: (mensaje: string, opciones?: ToastOptions) => {
            toast.success(mensaje, { ...defaultOptions, ...opciones });
        },

        // Toast de error (rojo)
        error: (mensaje: string, opciones?: ToastOptions) => {
            toast.error(mensaje, { ...defaultOptions, ...opciones });
        },

        // Toast de información (azul)
        info: (mensaje: string, opciones?: ToastOptions) => {
            toast.info(mensaje, { ...defaultOptions, ...opciones });
        },

        // Toast de advertencia (amarillo)
        warning: (mensaje: string, opciones?: ToastOptions) => {
            toast.warn(mensaje, { ...defaultOptions, ...opciones });
        },

        // Toast personalizado
        custom: (mensaje: string, opciones?: ToastOptions) => {
            toast(mensaje, { ...defaultOptions, ...opciones });
        },

        // Funciones especiales para casos comunes
        loading: (mensaje: string = "Cargando...") => {
            return toast.loading(mensaje);
        },

        // Actualizar un toast existente (útil para loading → success/error)
        update: (toastId: any, mensaje: string, tipo: "success" | "error" | "info" | "warning") => {
            toast.update(toastId, {
                render: mensaje,
                type: tipo,
                isLoading: false,
                autoClose: 3000,
            });
        },

        // Cerrar todos los toasts
        dismissAll: () => {
            toast.dismiss();
        },
    };
}

// Funciones helper para casos específicos de tu app
export const appToasts = {
    // Toasts específicos para productos
    productoCreado: () => {
        toast.success("✅ Producto creado exitosamente", {
            ...defaultOptions,
            autoClose: 2000,
        });
    },

    productoAgregadoCarrito: () => {
        toast.success("🛒 Producto agregado al carrito", {
            ...defaultOptions,
            autoClose: 2000,
        });
    },

    // Toasts específicos para autenticación
    loginExitoso: () => {
        toast.success("👋 ¡Bienvenido!", {
            ...defaultOptions,
            autoClose: 2000,
        });
    },

    registroExitoso: () => {
        toast.success("🎉 ¡Registro exitoso! Redirigiendo...", {
            ...defaultOptions,
            autoClose: 2000,
        });
    },

    // Toasts específicos para errores comunes
    errorConexion: () => {
        toast.error("🌐 Error de conexión. Inténtalo de nuevo.", {
            ...defaultOptions,
            autoClose: 4000,
        });
    },

    errorValidacion: (campo: string) => {
        toast.error(`❌ Error en ${campo}`, {
            ...defaultOptions,
            autoClose: 3000,
        });
    },

    // Toast para carrito
    carritoVaciado: () => {
        toast.success("🗑️ Carrito vaciado", {
            ...defaultOptions,
            autoClose: 2000,
        });
    },

    productoEliminadoCarrito: () => {
        toast.success("❌ Producto eliminado del carrito", {
            ...defaultOptions,
            autoClose: 2000,
        });
    },
};


