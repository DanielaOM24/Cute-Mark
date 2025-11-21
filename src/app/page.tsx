// app/page.tsx
import ProductGrid from "@/components/ProductGrid";
import Hero from "@/components/Hero";
import Products from "@/database/models/products";
import connect from "@/lib/mongodb";

export default async function Page() {
    try {
        await connect();
    } catch (e) {
        return (
            <main style={{ minHeight: "100vh", padding: "32px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#dc2626" }}>Error</h1>
                <p style={{ color: "#ef4444", marginTop: "8px" }}>
                    Error conectando a la base de datos: {(e as Error).message}
                </p>
            </main>
        );
    }

    // Traemos productos desde Mongo (server-side)
    const products = await Products.find({}).sort({ productId: 1 }).lean();

    // Convertir a formato Product
    const formattedProducts = products.map((p: any) => ({
        _id: p._id?.toString?.() ?? p._id,
        productId: p.productId,
        name: p.name,
        collection: p.collection,
        color: p.color,
        size: p.size,
        price: p.price,
        image: p.image,
        inStock: p.inStock,
    }));

    return (
        <main style={{ minHeight: "100vh" }}>
            {/* Hero Section */}
            <Hero />

            {/* Productos con Grid y Paginación */}
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}>
                <ProductGrid products={formattedProducts} itemsPerPage={8} />
            </div>
        </main>
    );
}
