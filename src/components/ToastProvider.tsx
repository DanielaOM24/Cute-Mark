// components/ToastProvider.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

type Toast = { id: string; message: string; type?: "info" | "success" | "error"; ttl?: number };

type ToastContextValue = { showToast: (message: string, type?: Toast["type"], ttl?: number) => void };

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: Toast["type"] = "info", ttl = 3000) => {
        const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
        setToasts((t) => [...t, { id, message, type, ttl }]);
        // auto remove handled in effect per toast
    }, []);

    useEffect(() => {
        if (toasts.length === 0) return;
        // manejar expiración de toasts
        const timers = toasts.map((toast) => {
            const timer = setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }, toast.ttl ?? 3000);
            return timer;
        });
        return () => timers.forEach((t) => clearTimeout(t));
    }, [toasts]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div style={{
                position: "fixed",
                right: 16,
                top: 16,
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                maxWidth: 320,
            }}>
                {toasts.map(t => (
                    <ToastItem key={t.id} toast={t} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast }: { toast: Toast }) {
    const bg = toast.type === "success" ? "rgba(34,197,94,0.12)" :
        toast.type === "error" ? "rgba(255,99,71,0.12)" :
            "rgba(59,130,246,0.08)";
    const border = toast.type === "success" ? "rgba(34,197,94,0.3)" :
        toast.type === "error" ? "rgba(255,99,71,0.35)" :
            "rgba(59,130,246,0.25)";

    return (
        <div style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: bg,
            border: `1px solid ${border}`,
            boxShadow: "0 6px 18px rgba(12,12,20,0.04)",
            color: "#0f172a",
            fontSize: 14,
        }}>
            {toast.message}
        </div>
    );
}

/** Hook */
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
