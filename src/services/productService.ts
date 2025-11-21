// services/productService.ts
import axios from "axios";

// Interface para los datos del producto
export interface CreateProductData {
    name: string;
    collection: string;
    color: string;
    size: string;
    price: number;
    inStock: boolean;
    file: File | null;
    productId?: number; // Opcional, se generará automáticamente si no se proporciona
}

// Interface para la respuesta
export interface CreateProductResponse {
    ok: boolean;
    message?: string;
    product?: {
        _id: string;
        productId: number;
        name: string;
        collection: string;
        color: string;
        size: string;
        price: number;
        image: string;
        inStock: boolean;
    };
    error?: string;
}

// Función para crear producto con archivo
export const createProduct = async (
    productData: CreateProductData
): Promise<CreateProductResponse> => {
    try {
        // Crear FormData para enviar archivo
        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("collection", productData.collection);
        formData.append("color", productData.color);
        formData.append("size", productData.size);
        formData.append("price", productData.price.toString());
        formData.append("inStock", productData.inStock.toString());
        if (productData.productId) {
            formData.append("productId", productData.productId.toString());
        }
        if (productData.file) {
            formData.append("file", productData.file);
        }

        // Enviar con axios
        const response = await axios.post("/api/products", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }
        throw new Error("Error desconocido al crear producto");
    }
};

// Función para obtener todos los productos
export const getProducts = async () => {
    try {
        const response = await axios.get("/api/products");
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }
        throw new Error("Error desconocido al obtener productos");
    }
};

// Función para eliminar un producto
export const deleteProduct = async (productId: string) => {
    try {
        const response = await axios.delete(`/api/products/${productId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }
        throw new Error("Error desconocido al eliminar producto");
    }
};

