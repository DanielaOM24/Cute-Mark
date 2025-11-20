// components/ClientProviders.tsx
"use client";

import React from "react";
import { CartProvider } from "@/app/context/CartContext";
import { ToastProvider } from "./ToastProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    // Aquí añades más providers si los necesitas (ThemeProvider, AuthProvider, etc.)
    return (
        <CartProvider>
            <ToastProvider>{children}</ToastProvider>
        </CartProvider>
    );
}
