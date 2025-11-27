// components/ClientProviders.tsx
"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/app/context/CartContext";
import { LanguageProvider } from "@/app/context/LanguageContext";
import AppContent from "./AppContent";
import ToastProvider from "./ToastProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LanguageProvider>
                <CartProvider>
                    <AppContent>
                        {children}
                    </AppContent>
                    <ToastProvider />
                </CartProvider>
            </LanguageProvider>
        </SessionProvider>
    );
}
