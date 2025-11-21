// app/cart/page.tsx
"use client";

import { useCart } from "@/app/context/CartContext";
import { toast } from "react-toastify";
import Link from "next/link";

export default function CartPage() {
    const { items, removeItem, updateQty, clearCart, getTotalPrice } = useCart();
    const total = getTotalPrice();

    function handleRemove(id: string) {
        removeItem(id);
        toast.success("Producto eliminado del carrito");
    }

    function handleUpdateQty(id: string, newQty: number) {
        if (newQty <= 0) {
            handleRemove(id);
        } else {
            updateQty(id, newQty);
        }
    }

    function handleClearCart() {
        clearCart();
        toast.success("Carrito vaciado");
    }

    if (items.length === 0) {
        return (
            <main style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#3b2150", marginBottom: "24px" }}>
                    Carrito de Compras
                </h1>
                <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "20px",
                    boxShadow: "0 6px 18px rgba(20, 20, 30, 0.04)",
                }}>
                    <p style={{ fontSize: "18px", color: "#6b7280", marginBottom: "24px" }}>
                        Tu carrito está vacío
                    </p>
                    <Link href="/" style={{
                        display: "inline-block",
                        padding: "12px 24px",
                        borderRadius: "10px",
                        background: "linear-gradient(90deg, rgba(255, 223, 230, 0.95), rgba(243, 232, 255, 0.95))",
                        color: "#3b2150",
                        textDecoration: "none",
                        fontWeight: "700",
                        fontSize: "16px",
                    }}>
                        Ver Productos
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#3b2150" }}>
                    Carrito de Compras
                </h1>
                <button
                    onClick={handleClearCart}
                    style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "1px solid rgba(200, 200, 210, 0.6)",
                        background: "transparent",
                        color: "#3b2150",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}
                >
                    Vaciar Carrito
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "14px",
                            padding: "20px",
                            boxShadow: "0 6px 18px rgba(20, 20, 30, 0.04)",
                            display: "flex",
                            gap: "20px",
                            alignItems: "center",
                        }}
                    >
                        {item.image && (
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                    background: "#f5f5f5",
                                }}
                            />
                        )}
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#3b2150", marginBottom: "8px" }}>
                                {item.name}
                            </h3>
                            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                                {item.color && `Color: ${item.color}`}
                                {item.size && ` · Talla: ${item.size}`}
                            </p>
                            <p style={{ fontSize: "16px", fontWeight: "700", color: "#3b2150" }}>
                                ${(item.price * item.qty).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <button
                                onClick={() => handleUpdateQty(item.id, item.qty - 1)}
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(200, 200, 210, 0.6)",
                                    background: "transparent",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                }}
                            >
                                -
                            </button>
                            <span style={{ fontSize: "16px", fontWeight: "600", minWidth: "30px", textAlign: "center" }}>
                                {item.qty}
                            </span>
                            <button
                                onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(200, 200, 210, 0.6)",
                                    background: "transparent",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                }}
                            >
                                +
                            </button>
                            <button
                                onClick={() => handleRemove(item.id)}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(255, 99, 71, 0.3)",
                                    background: "rgba(255, 99, 71, 0.1)",
                                    color: "#dc2626",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    marginLeft: "12px",
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 6px 18px rgba(20, 20, 30, 0.04)",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "600", color: "#3b2150" }}>
                        Total:
                    </span>
                    <span style={{ fontSize: "24px", fontWeight: "700", color: "#3b2150" }}>
                        ${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <button
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "none",
                        background: "linear-gradient(90deg, rgba(255, 223, 230, 0.95), rgba(243, 232, 255, 0.95))",
                        color: "#3b2150",
                        fontWeight: "700",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    Proceder al Pago
                </button>
            </div>
        </main>
    );
}

