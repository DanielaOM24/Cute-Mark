// components/ClientProviders.tsx
"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/app/context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <CartProvider>
                {children}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </CartProvider>
        </SessionProvider>
    );
}
