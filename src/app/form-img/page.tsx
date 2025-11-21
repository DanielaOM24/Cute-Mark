// app/form-img/page.tsx
"use client";

import React, { useState } from "react";
import { createProduct, CreateProductData } from "@/services/productService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import styles from "./FormImg.module.css";

export default function FormImg() {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateProductData>({
        name: "",
        collection: "",
        color: "",
        size: "",
        price: 0,
        inStock: true,
        file: null,
    });
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await createProduct(formData);

            if (response.ok) {
                toast.success("Producto creado exitosamente ✅");
                // Limpiar formulario
                setFormData({
                    name: "",
                    collection: "",
                    color: "",
                    size: "",
                    price: 0,
                    inStock: true,
                    file: null,
                });
                setPreviewUrl("");
                // Opcional: redirigir después de un momento
                setTimeout(() => {
                    router.push("/");
                }, 1500);
            } else {
                toast.error(response.error || "Error al crear producto");
            }
        } catch (error: any) {
            console.error("Error completo:", error);
            const errorMessage = error.response?.data?.error || error.message || "Error al crear producto";
            console.error("Mensaje de error:", errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) {
            setFormData({ ...formData, file: null });
            setPreviewUrl("");
            return;
        }

        // Validar tipo de archivo
        if (!selectedFile.type.startsWith("image/")) {
            toast.error("Por favor selecciona una imagen");
            return;
        }

        // Validar tamaño (max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("La imagen debe ser menor a 5MB");
            return;
        }

        setFormData({ ...formData, file: selectedFile });

        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]:
                name === "price"
                    ? parseFloat(value) || 0
                    : name === "inStock"
                        ? value === "true"
                        : value,
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Agregar Producto</h1>
                    <p className={styles.subtitle}>
                        Completa el formulario para agregar un nuevo producto
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.fields}>
                        <div className={styles.field}>
                            <label htmlFor="name" className={styles.label}>
                                Nombre del Producto *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Ej: Camiseta Rosa"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="collection" className={styles.label}>
                                Colección *
                            </label>
                            <input
                                id="collection"
                                name="collection"
                                type="text"
                                required
                                value={formData.collection}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Ej: Verano 2024"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="color" className={styles.label}>
                                Color *
                            </label>
                            <input
                                id="color"
                                name="color"
                                type="text"
                                required
                                value={formData.color}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Ej: Rosa"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="size" className={styles.label}>
                                Talla *
                            </label>
                            <select
                                id="size"
                                name="size"
                                required
                                value={formData.size}
                                onChange={handleInputChange}
                                className={styles.input}
                            >
                                <option value="">Selecciona una talla</option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="price" className={styles.label}>
                                Precio *
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="0.00"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="inStock" className={styles.label}>
                                Estado de Stock *
                            </label>
                            <select
                                id="inStock"
                                name="inStock"
                                required
                                value={formData.inStock.toString()}
                                onChange={handleInputChange}
                                className={styles.input}
                            >
                                <option value="true">En Stock</option>
                                <option value="false">Sin Stock</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="file" className={styles.label}>
                                Imagen del Producto *
                            </label>
                            <input
                                id="file"
                                name="file"
                                type="file"
                                required
                                accept="image/*"
                                onChange={handleFileChange}
                                className={styles.fileInput}
                            />
                            <p className={styles.fileHint}>
                                Formatos aceptados: JPG, PNG, WEBP (máx. 5MB)
                            </p>
                        </div>
                    </div>

                    {/* Preview de imagen */}
                    {previewUrl && (
                        <div className={styles.preview}>
                            <p className={styles.previewLabel}>Vista previa:</p>
                            <div className={styles.previewImage}>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className={styles.image}
                                />
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitBtn}
                        >
                            {loading ? "Creando producto..." : "Crear Producto"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className={styles.cancelBtn}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

