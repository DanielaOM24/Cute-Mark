// components/ProductCard.tsx
"use client";

import React, { useState } from "react";
import styles from "./ProductCard.module.css";
import { useToast } from "@/components/ToastProvider";
import { useCart } from "@/app/context/CartContext";

export type Product = {
    _id?: string;
    productId?: number;
    name?: string;
    collection?: string;
    color?: string;
    size?: string;
    price?: number;
    image?: string;
    inStock?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
    const palette = ["#FDE8EE", "#F3E8FF", "#FFF7E6", "#E8FFF2", "#E8F7FF"];
    const sizes = ["XS", "S", "M", "L", "XL"];

    const [selectedColor, setSelectedColor] = useState<string>(product.color ?? palette[0]);
    const [selectedSize, setSelectedSize] = useState<string | null>(product.size ?? null);
    const [adding, setAdding] = useState(false);

    const { addItem } = useCart();
    const { showToast } = useToast();

    const imageSrc = product.image ?? "/images/placeholder.png";

    function validateSelection() {
        // Si en tu negocio la talla es obligatoria, validamos
        if (!selectedSize) {
            showToast("Por favor selecciona una talla antes de agregar al carrito.", "error");
            return false;
        }
        return true;
    }

    function handleAdd() {
        if (!validateSelection()) return;
        if (!product || !product.productId) {
            showToast("Producto inválido.", "error");
            return;
        }

        setAdding(true);
        try {
            addItem({
                _id: product._id,
                productId: product.productId,
                name: product.name ?? "Producto",
                price: product.price ?? 0,
                color: selectedColor,
                size: selectedSize,
                image: product.image,
                qty: 1,
            });

            showToast("Producto agregado al carrito ✅", "success");
        } catch (err) {
            console.error("Error agregando al carrito:", err);
            showToast("No se pudo agregar al carrito.", "error");
        } finally {
            // pequeño delay visual
            setTimeout(() => setAdding(false), 300);
        }
    }

    return (
        <article className={styles.card} aria-labelledby={`title-${product._id}`}>
            <div className={styles.media}>
                <img src={imageSrc} alt={product.name} className={styles.image} />
            </div>

            <div className={styles.body}>
                <div className={styles.header}>
                    <h3 id={`title-${product._id}`} className={styles.title}>{product.name}</h3>
                    <span className={styles.price}>${(product.price ?? 0).toFixed(2)}</span>
                </div>

                <p className={styles.meta}>
                    {product.collection} · <span className={styles.muted}>{product.color} · {product.size}</span>
                </p>

                <div className={styles.section}>
                    <label className={styles.label}>Color</label>
                    <div className={styles.palette}>
                        {palette.map((hex) => (
                            <button
                                key={hex}
                                type="button"
                                aria-label={hex}
                                className={`${styles.swatch} ${selectedColor === hex ? styles.swatchSelected : ""}`}
                                style={{ backgroundColor: hex }}
                                onClick={() => setSelectedColor(hex)}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <label className={styles.label}>Talla</label>
                    <div className={styles.sizes}>
                        {sizes.map((s) => (
                            <button
                                key={s}
                                type="button"
                                className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeSelected : ""}`}
                                onClick={() => setSelectedSize(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.addBtn}
                        onClick={handleAdd}
                        disabled={adding || !product.inStock}
                        aria-disabled={!product.inStock}
                        title={!product.inStock ? "Sin stock" : "Agregar al carrito"}
                    >
                        {product.inStock ? (adding ? "Agregando..." : "Agregar al carrito") : "Sin stock"}
                    </button>
                </div>
            </div>
        </article>
    );
}
