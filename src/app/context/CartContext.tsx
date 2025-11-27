// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { cartService, CartItem as ServiceCartItem } from "@/services/cartService";
import { toast } from "react-toastify";

/** Tipos */
export type CartItem = {
    id: string; // unique key: productId + color + size (generado aqui)
    productId: string;
    name: string;
    price: number;
    color?: string;
    size?: string;
    qty: number;
    image?: string;
};

type CartContextValue = {
    items: CartItem[];
    loading: boolean;
    addItem: (item: Omit<CartItem, "id" | "qty"> & { qty?: number }) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    updateQty: (id: string, qty: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    refreshCart: () => Promise<void>;
};

/** Context */
const CartContext = createContext<CartContextValue | undefined>(undefined);

/** Helper: unique key generator por producto+color+size */
function makeKey(productId: string, color?: string, size?: string) {
    return `${productId}::${color ?? "noc"}::${size ?? "nos"}`;
}

/** Helper: convertir ServiceCartItem a CartItem */
function serviceItemToCartItem(item: ServiceCartItem): CartItem {
    return {
        id: makeKey(item.productId, item.color, item.size),
        productId: item.productId,
        name: item.name,
        price: item.price,
        color: item.color,
        size: item.size,
        qty: item.qty,
        image: item.image,
    };
}

/** Provider */
export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Cargar carrito desde el servidor al montar
    useEffect(() => {
        refreshCart();
    }, []);

    // Función para refrescar el carrito desde el servidor
    const refreshCart = async () => {
        setLoading(true);
        try {
            const response = await cartService.getCart();
            if (response.success && response.cart) {
                const cartItems = response.cart.items.map(serviceItemToCartItem);
                setItems(cartItems);
            }
        } catch (error) {
            console.error("Error loading cart:", error);
            toast.error("Error al cargar el carrito");
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (payload: Omit<CartItem, "id" | "qty"> & { qty?: number }) => {
        setLoading(true);
        try {
            const response = await cartService.addItem({
                productId: payload.productId,
                name: payload.name,
                price: payload.price,
                color: payload.color,
                size: payload.size,
                qty: payload.qty ?? 1,
                image: payload.image,
            });

            if (response.success && response.cart) {
                const cartItems = response.cart.items.map(serviceItemToCartItem);
                setItems(cartItems);
                toast.success(response.message || "Producto agregado al carrito");
            } else {
                toast.error(response.error || "Error al agregar al carrito");
            }
        } catch (error) {
            console.error("Error adding item:", error);
            toast.error("Error al agregar al carrito");
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (id: string) => {
        const item = items.find(it => it.id === id);
        if (!item) return;

        setLoading(true);
        try {
            const response = await cartService.removeItem(
                item.productId,
                item.color,
                item.size
            );

            if (response.success && response.cart) {
                const cartItems = response.cart.items.map(serviceItemToCartItem);
                setItems(cartItems);
                toast.success(response.message || "Producto eliminado del carrito");
            } else {
                toast.error(response.error || "Error al eliminar del carrito");
            }
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Error al eliminar del carrito");
        } finally {
            setLoading(false);
        }
    };

    const updateQty = async (id: string, qty: number) => {
        const item = items.find(it => it.id === id);
        if (!item) return;

        setLoading(true);
        try {
            const response = await cartService.updateItemQuantity(
                item.productId,
                qty,
                item.color,
                item.size
            );

            if (response.success && response.cart) {
                const cartItems = response.cart.items.map(serviceItemToCartItem);
                setItems(cartItems);
                if (qty <= 0) {
                    toast.success("Producto eliminado del carrito");
                }
            } else {
                toast.error(response.error || "Error al actualizar cantidad");
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error("Error al actualizar cantidad");
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        setLoading(true);
        try {
            const response = await cartService.clearCart();

            if (response.success) {
                setItems([]);
                toast.success(response.message || "Carrito vaciado");
            } else {
                toast.error(response.error || "Error al vaciar carrito");
            }
        } catch (error) {
            console.error("Error clearing cart:", error);
            toast.error("Error al vaciar carrito");
        } finally {
            setLoading(false);
        }
    };

    function getTotalItems() {
        return items.reduce((s, it) => s + it.qty, 0);
    }

    function getTotalPrice() {
        return items.reduce((s, it) => s + it.qty * (Number(it.price) || 0), 0);
    }

    const value: CartContextValue = {
        items,
        loading,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        getTotalItems,
        getTotalPrice,
        refreshCart,
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
