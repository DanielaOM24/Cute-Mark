// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connect from "@/lib/mongodb";
import Products from "@/database/models/Products";

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
    try {
        // Verificar autenticación de admin
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        await connect();

        const body = await request.json();
        console.log('📦 Datos recibidos:', body);

        const {
            name,
            collection,
            price,
            description,
            availableColors,
            availableSizes
        } = body;

        // Validaciones básicas
        if (!name || !collection || !price || !availableColors || !availableSizes) {
            return NextResponse.json(
                { success: false, error: 'Faltan datos requeridos' },
                { status: 400 }
            );
        }

        if (availableColors.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Debe tener al menos un color' },
                { status: 400 }
            );
        }

        if (availableSizes.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Debe tener al menos una talla' },
                { status: 400 }
            );
        }

        // Generar productId único
        const lastProduct = await Products.findOne().sort({ productId: -1 });
        const productId = lastProduct ? lastProduct.productId + 1 : 1;

        // Crear producto
        const newProduct = new Products({
            productId,
            name,
            collection,
            price,
            description,
            availableColors,
            availableSizes,
            image: availableColors[0]?.imageUrl || '', // Imagen principal (primer color)
            inStock: true,
        });

        await newProduct.save();

        return NextResponse.json({
            success: true,
            message: 'Producto creado exitosamente',
            product: newProduct,
        });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { success: false, error: 'Error al crear producto' },
            { status: 500 }
        );
    }
}

// GET - Obtener todos los productos
export async function GET() {
    try {
        await connect();

        const products = await Products.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            products,
        });

    } catch (error) {
        console.error('Error getting products:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener productos' },
            { status: 500 }
        );
    }
}
