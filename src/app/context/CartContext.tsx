// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

/** Tipos */
export type CartItem = {
    id: string; // unique key: productId + color + size (generado aqui)
    _id?: string; // id mongo
    productId?: number;
    name: string;
    price: number;
    color?: string;
    size?: string;
    qty: number;
    image?: string;
};

type CartContextValue = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "id" | "qty"> & { qty?: number }) => void;
    removeItem: (id: string) => void;
    updateQty: (id: string, qty: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
};

/** Context */
const CartContext = createContext<CartContextValue | undefined>(undefined);

/** Helper: unique key generator por producto+color+size */
function makeKey(productId?: number, color?: string, size?: string) {
    return `${productId ?? "noid"}::${color ?? "noc"}::${size ?? "nos"}`;
}

/** Provider */
export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // cargar carrito desde localStorage al montar
    useEffect(() => {
        try {
            const raw = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
            if (raw) {
                setItems(JSON.parse(raw));
            }
        } catch (e) {
            console.error("Error loading cart from localStorage", e);
        }
    }, []);

    // persistir cada vez que items cambian
    useEffect(() => {
        try {
            localStorage.setItem("cart", JSON.stringify(items));
        } catch (e) {
            console.error("Error saving cart to localStorage", e);
        }
    }, [items]);

    function addItem(payload: Omit<CartItem, "id" | "qty"> & { qty?: number }) {
        const qty = payload.qty ?? 1;
        const key = makeKey(payload.productId, payload.color, payload.size);
        setItems((prev) => {
            const foundIndex = prev.findIndex((it) => it.id === key);
            if (foundIndex > -1) {
                // sumar cantidad
                const copy = [...prev];
                copy[foundIndex] = { ...copy[foundIndex], qty: copy[foundIndex].qty + qty };
                return copy;
            }
            // nuevo item
            const newItem: CartItem = {
                id: key,
                _id: payload._id,
                productId: payload.productId,
                name: payload.name,
                price: payload.price,
                color: payload.color,
                size: payload.size,
                qty,
                image: payload.image,
            };
            return [...prev, newItem];
        });
    }

    function removeItem(id: string) {
        setItems((prev) => prev.filter((it) => it.id !== id));
    }

    function updateQty(id: string, qty: number) {
        if (qty <= 0) {
            removeItem(id);
            return;
        }
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty } : it)));
    }

    function clearCart() {
        setItems([]);
    }

    function getTotalItems() {
        return items.reduce((s, it) => s + it.qty, 0);
    }

    function getTotalPrice() {
        return items.reduce((s, it) => s + it.qty * (Number(it.price) || 0), 0);
    }

    const value: CartContextValue = {
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        getTotalItems,
        getTotalPrice,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Hook para consumir */
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return ctx;
}
