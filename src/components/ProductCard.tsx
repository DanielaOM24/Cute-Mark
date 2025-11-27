// components/ProductCard.tsx
"use client";

import React, { useState } from "react";
import styles from "./ProductCard.module.css";
import { useCart } from "@/app/context/CartContext";
import { appToasts } from "@/hooks/useToast";

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
    // Nuevos campos para múltiples colores
    availableColors?: Array<{
        colorCode: string;
        colorName: string;
        imageUrl: string;
    }>;
    availableSizes?: string[];
    description?: string;
};

export default function ProductCard({ product }: { product: Product }) {
    // Definir colores con nombres y códigos hex (paleta completa)
    const allColorOptions = [
        { name: "Rosa", hex: "#ffaabb", colorCode: "rosa" },
        { name: "Marfil", hex: "#e2dacc", colorCode: "marfil" },
        { name: "Morado", hex: "#CCCCFF", colorCode: "morado" },
        { name: "Amarillo", hex: "#fff2cc", colorCode: "amarillo" },
        { name: "Verde", hex: "#234F1E", colorCode: "verde" },
        { name: "Azul", hex: "#81bee7", colorCode: "azul" },
        { name: "Rojo", hex: "#f50b0b", colorCode: "rojo" },
        { name: "Vino", hex: "#441010", colorCode: "vino" },
        { name: "Negro", hex: "#000000", colorCode: "negro" },
    ];

    // Usar las tallas del producto o las por defecto
    const sizes = product.availableSizes && product.availableSizes.length > 0
        ? product.availableSizes
        : ["XS", "S", "M", "L", "XL"];

    // Obtener colores disponibles del producto
    const availableProductColors = product.availableColors || [];

    // Crear array de colores con información completa
    const productColors = availableProductColors.map(availableColor => {
        const colorInfo = allColorOptions.find(c => c.colorCode === availableColor.colorCode);
        return {
            name: availableColor.colorName,
            hex: colorInfo?.hex || '#cccccc',
            colorCode: availableColor.colorCode,
            imageUrl: availableColor.imageUrl
        };
    });

    // Inicializar con el primer color disponible del producto
    const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string; colorCode: string; imageUrl?: string }>(
        productColors.length > 0 ? productColors[0] : { ...allColorOptions[0], imageUrl: undefined }
    );
    const [selectedSize, setSelectedSize] = useState<string | null>(product.size ?? null);
    const [adding, setAdding] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    const { addItem } = useCart();

    // Función para obtener la imagen del color seleccionado
    const getImageSrc = () => {
        // Si el color seleccionado tiene imageUrl (del nuevo sistema)
        if ('imageUrl' in selectedColor && selectedColor.imageUrl) {
            return selectedColor.imageUrl;
        }

        // Si el producto tiene availableColors, buscar por colorCode
        if (product.availableColors && product.availableColors.length > 0) {
            const colorImage = product.availableColors.find(ac => ac.colorCode === selectedColor.colorCode);
            if (colorImage && colorImage.imageUrl) {
                return colorImage.imageUrl;
            }
            // Si no encuentra el color, usar la primera imagen disponible
            return product.availableColors[0].imageUrl;
        }

        // Fallback al sistema anterior para compatibilidad
        if (product.image) {
            const baseImage = product.image.replace(/(rosa|morado|amarillo|verde|azul|marfil|rojo|vino|negro)/gi, selectedColor.colorCode);
            return baseImage;
        }

        // Imagen por defecto
        return `/images/camiseta-${selectedColor.colorCode}.jpg`;
    };

    const imageSrc = getImageSrc();

    // Función para manejar el cambio de color con efecto de carga
    const handleColorChange = (color: { name: string; hex: string; colorCode: string; imageUrl?: string }) => {
        if (color.colorCode !== selectedColor.colorCode) {
            setImageLoading(true);
            setSelectedColor(color);
            // Simular tiempo de carga de imagen
            setTimeout(() => setImageLoading(false), 300);
        }
    };

    function validateSelection() {
        // Si en tu negocio la talla es obligatoria, validamos
        if (!selectedSize) {
            appToasts.errorValidacion("talla");
            return false;
        }
        return true;
    }

    async function handleAdd() {
        if (!validateSelection()) return;
        if (!product || !product.productId) {
            appToasts.errorValidacion("producto");
            return;
        }

        setAdding(true);
        try {
            await addItem({
                productId: product.productId.toString(),
                name: product.name ?? "Producto",
                price: product.price ?? 0,
                color: selectedColor.name,
                size: selectedSize ?? undefined,
                image: imageSrc, // Usar la imagen del color seleccionado
                qty: 1,
            });

            // El toast ya se muestra en el CartContext
        } catch (err) {
            console.error("Error agregando al carrito:", err);
            appToasts.errorConexion();
        } finally {
            // pequeño delay visual
            setTimeout(() => setAdding(false), 300);
        }
    }

    return (
        <article className={styles.card} aria-labelledby={`title-${product._id}`}>
            <div className={styles.media}>
                {imageLoading && (
                    <div className={styles.imageLoader}>
                        <div className={styles.spinner}></div>
                    </div>
                )}
                <img
                    src={imageSrc}
                    alt={`${product.name} - ${selectedColor.name}`}
                    className={`${styles.image} ${imageLoading ? styles.imageLoading : ''}`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                />
            </div>

            <div className={styles.body}>
                <div className={styles.header}>
                    <h3 id={`title-${product._id}`} className={styles.title}>{product.name}</h3>
                    <span className={styles.price}>${(product.price ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <p className={styles.meta}>
                    {product.collection} · <span className={styles.muted}>{selectedColor.name} · {selectedSize || "Seleccionar talla"}</span>
                </p>

                <div className={styles.section}>
                    <label className={styles.label}>Color</label>
                    <div className={styles.palette}>
                        {/* Mostrar solo los colores disponibles del producto */}
                        {productColors.length > 0 ? (
                            productColors.map((color) => (
                                <button
                                    key={color.colorCode}
                                    type="button"
                                    aria-label={color.name}
                                    title={color.name}
                                    className={`${styles.swatch} ${selectedColor.colorCode === color.colorCode ? styles.swatchSelected : ""}`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => handleColorChange(color)}
                                />
                            ))
                        ) : (
                            // Fallback si no hay colores específicos (productos antiguos)
                            allColorOptions.slice(0, 3).map((color) => (
                                <button
                                    key={color.colorCode}
                                    type="button"
                                    aria-label={color.name}
                                    title={color.name}
                                    className={`${styles.swatch} ${selectedColor.colorCode === color.colorCode ? styles.swatchSelected : ""}`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => handleColorChange({ ...color, imageUrl: undefined })}
                                />
                            ))
                        )}
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
