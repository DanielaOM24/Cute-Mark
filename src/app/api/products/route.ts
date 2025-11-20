// app/api/products/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Products from "@/database/models/products";


export async function GET() {
    try {
        // 1) Conectar a la base de datos (usa el cache de lib/mongodb)
        await connect();

        // 2) Traer productos desde la colección y ordenarlos por productId
        const products = await Products.find({}).sort({ productId: 1 }).lean();

        // 3) Normalizar _id a string para evitar problemas al serializar
        const safe = products.map((p: any) => ({
            ...p,
            _id: p._id?.toString?.() ?? p._id,
        }));

        // 4) Devolver JSON con NextResponse
        return NextResponse.json({ ok: true, products: safe });
    } catch (error) {
        console.error("GET /api/products error:", error);
        return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    }
}
