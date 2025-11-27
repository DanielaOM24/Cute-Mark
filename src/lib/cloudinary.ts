// lib/cloudinary.ts
// Este archivo configura Cloudinary para subir imágenes
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary con las credenciales del archivo .env.local
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Función para subir una imagen a Cloudinary
 * @param fileBuffer - El archivo convertido a buffer (bytes)
 * @param folder - Carpeta donde guardar en Cloudinary (opcional)
 * @returns La URL de la imagen subida
 */
export async function uploadImageToCloudinary(
    fileBuffer: Buffer,
    folder: string = "products"
): Promise<string> {
    return new Promise((resolve, reject) => {
        // Convertir el buffer a un formato que Cloudinary entienda
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder, // Guarda en la carpeta "products" en Cloudinary
                resource_type: "image", // Tipo de recurso: imagen
            },
            (error, result) => {
                if (error) {
                    console.error("Error al subir a Cloudinary:", error);
                    reject(error);
                } else if (result) {
                    // Si todo sale bien, devolvemos la URL de la imagen
                    resolve(result.secure_url);
                } else {
                    reject(new Error("No se obtuvo resultado de Cloudinary"));
                }
            }
        );

        // Enviar el buffer al stream de Cloudinary
        uploadStream.end(fileBuffer);
    });
}


