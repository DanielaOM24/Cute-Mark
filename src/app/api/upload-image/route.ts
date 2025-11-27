// app/api/upload-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
    try {
        // Obtener los datos del formulario
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const folder = formData.get("folder") as string || "products";

        // Validar que se haya enviado un archivo
        if (!file) {
            return NextResponse.json(
                { success: false, error: "No se encontró archivo" },
                { status: 400 }
            );
        }

        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { success: false, error: "El archivo debe ser una imagen" },
                { status: 400 }
            );
        }

        // Validar tamaño del archivo (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB en bytes
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: "La imagen no puede ser mayor a 5MB" },
                { status: 400 }
            );
        }

        // Convertir el archivo a Buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Subir la imagen a Cloudinary
        const imageUrl = await uploadImageToCloudinary(fileBuffer, folder);

        // Devolver la URL de la imagen
        return NextResponse.json({
            success: true,
            imageUrl: imageUrl,
            message: "Imagen subida exitosamente"
        });

    } catch (error: any) {
        console.error("Error al subir imagen:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Error al subir la imagen"
            },
            { status: 500 }
        );
    }
}
