// app/page.tsx
import ProductCard from "@/components/ProductCard";
import Products from "@/database/models/products";
import connect from "@/lib/mongodb";


export default async function Page() {
    try {
        await connect();
    } catch (e) {
        return (
            <main style={{ padding: 20 }}>
                <h1>Catálogo</h1>
                <p style={{ color: "red" }}>Error conectando a la base de datos: {(e as Error).message}</p>
            </main>
        );
    }

    // Traemos productos desde Mongo (server-side)
    const products = await Products.find({}).sort({ productId: 1 }).lean();

    return (
        <main style={{ padding: 20 }}>
            <h1 style={{ fontSize: 24, marginBottom: 16 }}>Catálogo</h1>

            {products.length === 0 ? (
                <p>No hay productos aún.</p>
            ) : (
                <ul style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                    listStyle: "none",
                    padding: 0
                }}>
                    {products.map((p: any) => (
                        <li key={p._id?.toString?.() ?? p._id} style={{ listStyle: "none" }}>
                            <ProductCard product={{
                                _id: p._id?.toString?.() ?? p._id,
                                productId: p.productId,
                                name: p.name,
                                collection: p.collection,
                                color: p.color,
                                size: p.size,
                                price: p.price,
                                image: p.image,
                                inStock: p.inStock
                            }} />
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
