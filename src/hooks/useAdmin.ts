// hooks/useAdmin.ts
"use client";

import { useSession } from "next-auth/react";

/**
 * Hook para verificar si el usuario actual es administrador
 * Usar en Client Components
 */
export function useAdmin() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";

    return {
        isAdmin,
        role: session?.user?.role || null,
        user: session?.user || null,
    };
}

