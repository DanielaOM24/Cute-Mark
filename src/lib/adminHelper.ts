// lib/adminHelper.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Verifica si el usuario actual es administrador
 * Usar en Server Components o API Routes
 */
export async function isAdmin(): Promise<boolean> {
    try {
        const session = await getServerSession(authOptions);
        return session?.user?.role === "admin";
    } catch (error) {
        console.error("Error verificando rol admin:", error);
        return false;
    }
}

/**
 * Obtiene el rol del usuario actual
 */
export async function getUserRole(): Promise<string | null> {
    try {
        const session = await getServerSession(authOptions);
        return session?.user?.role || null;
    } catch (error) {
        console.error("Error obteniendo rol:", error);
        return null;
    }
}

