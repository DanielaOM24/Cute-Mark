// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("MONGODB_URI no definida en .env.local");
}

// Opcional: evita warnings en Mongoose v7+ si usas queries flexibles
// mongoose.set("strictQuery", false);

declare global {
    // cache para evitar múltiples conexiones en desarrollo (hot reload)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var __mongoose_cache__: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.__mongoose_cache__ ?? (global.__mongoose_cache__ = { conn: null, promise: null });

export default async function connect() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI!)
            .then((m) => {
                return m;
            })
            .catch((err) => {
                // limpiar cache si falla la conexión para permitir reintentos
                cached.promise = null;
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
