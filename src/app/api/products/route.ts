// get y post

import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Products from "@/database/models/products";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

// Función para generar un productId único
// Busca el último productId en la base de datos y le suma 1
async function getNextProductId(): Promise<number> {
    try {
        // Buscar el producto con el productId más alto
        const lastProduct = await Products.findOne().sort({ productId: -1 });

        // Si hay productos, devolver el siguiente número
        // Si no hay productos, empezar desde 1
        return lastProduct ? lastProduct.productId + 1 : 1;
    } catch (error) {
        console.error("Error al obtener productId:", error);
        // Si hay error, empezar desde 1
        return 1;
    }
}

// POST: Crear un nuevo producto
export async function POST(request: NextRequest) {
    try {
        // 1. Conectar a la base de datos
        await connect();

        // 2. Obtener los datos del formulario (FormData)
        const formData = await request.formData();

        // 3. Extraer cada campo del formulario
        const name = formData.get("name") as string;
        const collection = formData.get("collection") as string;
        const color = formData.get("color") as string;
        const size = formData.get("size") as string;
        const price = parseFloat(formData.get("price") as string);
        const inStock = formData.get("inStock") === "true";
        const file = formData.get("file") as File | null;

        // 4. Validar que todos los campos requeridos estén presentes
        if (!name || !collection || !color || !size || !file) {
            return NextResponse.json(
                { ok: false, error: "Faltan campos requeridos" },
                { status: 400 }
            );
        }

        // 5. Validar que el precio sea un número válido
        if (isNaN(price) || price < 0) {
            return NextResponse.json(
                { ok: false, error: "El precio debe ser un número válido" },
                { status: 400 }
            );
        }

        // 6. Convertir el archivo a Buffer (bytes) para subirlo a Cloudinary
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // 7. Subir la imagen a Cloudinary y obtener la URL
        const imageUrl = await uploadImageToCloudinary(fileBuffer, "products");

        // 8. Obtener el siguiente productId disponible
        const productId = await getNextProductId();

        // 9. Crear el producto en la base de datos
        const newProduct = new Products({
            productId: productId,
            name: name,
            collection: collection,
            color: color,
            size: size,
            price: price,
            image: imageUrl, // URL de Cloudinary
            inStock: inStock,
        });

        // 10. Guardar en MongoDB
        const savedProduct = await newProduct.save();

        // 11. Devolver respuesta exitosa
        return NextResponse.json({
            ok: true,
            message: "Producto creado exitosamente",
            product: {
                _id: savedProduct._id.toString(),
                productId: savedProduct.productId,
                name: savedProduct.name,
                collection: savedProduct.collection,
                color: savedProduct.color,
                size: savedProduct.size,
                price: savedProduct.price,
                image: savedProduct.image,
                inStock: savedProduct.inStock,
            },
        });
    } catch (error: any) {
        console.error("Error al crear producto:", error);
        return NextResponse.json(
            {
                ok: false,
                error: error.message || "Error al crear el producto",
            },
            { status: 500 }
        );
    }
}

// GET: Obtener todos los productos
export async function GET() {
    try {
        // 1. Conectar a la base de datos
        await connect();

        // 2. Buscar todos los productos
        const products = await Products.find({}).sort({ createdAt: -1 });

        // 3. Convertir los productos a formato JSON compatible con ProductCard
        const productsJson = products.map((product) => {
            // Si es un producto nuevo con availableColors
            if (product.availableColors && product.availableColors.length > 0) {
                return {
                    _id: product._id.toString(),
                    productId: product.productId,
                    name: product.name,
                    collection: product.collection,
                    price: product.price,
                    description: product.description,
                    availableColors: product.availableColors,
                    availableSizes: product.availableSizes,
                    image: product.image || product.availableColors[0]?.imageUrl,
                    inStock: product.inStock,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                };
            }

            // Si es un producto antiguo (formato anterior)
            return {
                _id: product._id.toString(),
                productId: product.productId,
                name: product.name,
                collection: product.collection,
                color: product.color,
                size: product.size,
                price: product.price,
                image: product.image,
                inStock: product.inStock,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            };
        });

        return NextResponse.json({ products: productsJson });
    } catch (error: any) {
        console.error("Error al obtener productos:", error);
        return NextResponse.json(
            { error: "Error al obtener productos" },
            { status: 500 }
        );
    }
}


