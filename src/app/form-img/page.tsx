// app/form-img/page.tsx
"use client";

import React, { useState } from "react";
import { createProduct, CreateProductData } from "@/services/productService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import styles from "./FormImg.module.css";

// Colores disponibles (misma paleta que ProductCard)
const colorOptions = [
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

const sizeOptions = ["XS", "S", "M", "L", "XL"];

interface ColorImage {
    colorCode: string;
    colorName: string;
    imageUrl: string;
    file?: File;
    uploading?: boolean;
}

export default function FormImg() {
    const router = useRouter();

    // Datos básicos del producto
    const [productData, setProductData] = useState({
        name: "",
        collection: "",
        price: 0,
        description: "",
        inStock: true,
    });

    // Tallas seleccionadas
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    // Imágenes por color
    const [colorImages, setColorImages] = useState<ColorImage[]>([]);

    const [loading, setLoading] = useState(false);

    // Agregar color con imagen
    const addColorImage = (colorOption: typeof colorOptions[0]) => {
        if (colorImages.find(ci => ci.colorCode === colorOption.colorCode)) {
            toast.error('Este color ya está agregado');
            return;
        }

        setColorImages(prev => [...prev, {
            colorCode: colorOption.colorCode,
            colorName: colorOption.name,
            imageUrl: '',
        }]);
    };

    // Remover color
    const removeColorImage = (colorCode: string) => {
        setColorImages(prev => prev.filter(ci => ci.colorCode !== colorCode));
    };

    // Manejar subida de imagen
    const handleImageUpload = async (colorCode: string, file: File) => {
        // Marcar como subiendo
        setColorImages(prev => prev.map(ci =>
            ci.colorCode === colorCode
                ? { ...ci, uploading: true }
                : ci
        ));

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');

        try {
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success && data.imageUrl) {
                setColorImages(prev => prev.map(ci =>
                    ci.colorCode === colorCode
                        ? { ...ci, imageUrl: data.imageUrl, file, uploading: false }
                        : ci
                ));
                toast.success(`Imagen subida para ${colorCode}`);
            } else {
                setColorImages(prev => prev.map(ci =>
                    ci.colorCode === colorCode
                        ? { ...ci, uploading: false }
                        : ci
                ));
                toast.error(data.error || 'Error al subir la imagen');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setColorImages(prev => prev.map(ci =>
                ci.colorCode === colorCode
                    ? { ...ci, uploading: false }
                    : ci
            ));
            toast.error('Error al subir la imagen');
        }
    };

    // Manejar cambio de tallas
    const handleSizeToggle = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        if (colorImages.length === 0) {
            toast.error('Debes agregar al menos un color con imagen');
            return;
        }

        if (selectedSizes.length === 0) {
            toast.error('Debes seleccionar al menos una talla');
            return;
        }

        // Verificar que todas las imágenes estén subidas
        const imagesNotUploaded = colorImages.filter(ci => !ci.imageUrl || ci.uploading);
        if (imagesNotUploaded.length > 0) {
            toast.error(`Faltan imágenes por subir: ${imagesNotUploaded.map(ci => ci.colorName).join(', ')}`);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...productData,
                    availableColors: colorImages.map(ci => ({
                        colorCode: ci.colorCode,
                        colorName: ci.colorName,
                        imageUrl: ci.imageUrl,
                    })),
                    availableSizes: selectedSizes,
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Producto creado exitosamente ✅');
                // Limpiar formulario
                setProductData({
                    name: "",
                    collection: "",
                    price: 0,
                    description: "",
                    inStock: true,
                });
                setSelectedSizes([]);
                setColorImages([]);

                setTimeout(() => {
                    router.push("/");
                }, 1500);
            } else {
                toast.error(result.error || 'Error al crear producto');
            }
        } catch (error: any) {
            console.error('Error:', error);
            toast.error('Error al crear producto');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
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
                    {/* Información básica */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Información Básica</h2>

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
                                    value={productData.name}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Ej: Camiseta Básica"
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
                                    value={productData.collection}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Ej: Casual"
                                />
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
                                    value={productData.price}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="description" className={styles.label}>
                                    Descripción (Opcional)
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={productData.description}
                                    onChange={handleInputChange}
                                    className={styles.textarea}
                                    rows={3}
                                    placeholder="Descripción del producto..."
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
                                    value={productData.inStock.toString()}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                >
                                    <option value="true">En Stock</option>
                                    <option value="false">Sin Stock</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tallas disponibles */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Tallas Disponibles</h2>
                        <div className={styles.sizeGrid}>
                            {sizeOptions.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    className={`${styles.sizeBtn} ${selectedSizes.includes(size) ? styles.sizeSelected : ''
                                        }`}
                                    onClick={() => handleSizeToggle(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colores e imágenes */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Colores e Imágenes</h2>

                        {/* Selector de colores */}
                        <div className={styles.colorSelector}>
                            <h3 className={styles.subsectionTitle}>Agregar Color:</h3>
                            <div className={styles.colorGrid}>
                                {colorOptions.map(color => (
                                    <button
                                        key={color.colorCode}
                                        type="button"
                                        className={styles.colorOption}
                                        style={{ backgroundColor: color.hex }}
                                        onClick={() => addColorImage(color)}
                                        title={color.name}
                                        disabled={colorImages.some(ci => ci.colorCode === color.colorCode)}
                                    >
                                        {color.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Imágenes por color */}
                        <div className={styles.colorImages}>
                            {colorImages.map(colorImage => (
                                <div key={colorImage.colorCode} className={styles.colorImageCard}>
                                    <div className={styles.colorHeader}>
                                        <div
                                            className={styles.colorSwatch}
                                            style={{
                                                backgroundColor: colorOptions.find(c => c.colorCode === colorImage.colorCode)?.hex
                                            }}
                                        />
                                        <h4>{colorImage.colorName}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeColorImage(colorImage.colorCode)}
                                            className={styles.removeBtn}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className={styles.imageUpload}>
                                        {colorImage.uploading ? (
                                            <div className={styles.uploadingState}>
                                                <div className={styles.spinner}></div>
                                                <p>Subiendo imagen...</p>
                                            </div>
                                        ) : colorImage.imageUrl ? (
                                            <div className={styles.imagePreview}>
                                                <img src={colorImage.imageUrl} alt={colorImage.colorName} />
                                                <div className={styles.imageActions}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setColorImages(prev =>
                                                            prev.map(ci =>
                                                                ci.colorCode === colorImage.colorCode
                                                                    ? { ...ci, imageUrl: '', file: undefined }
                                                                    : ci
                                                            )
                                                        )}
                                                        className={styles.changeImageBtn}
                                                    >
                                                        Cambiar Imagen
                                                    </button>
                                                    <span className={styles.successText}>✓ Imagen subida</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={styles.uploadArea}>
                                                <div className={styles.uploadIcon}>📷</div>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            handleImageUpload(colorImage.colorCode, file);
                                                        }
                                                    }}
                                                    className={styles.fileInput}
                                                    id={`file-${colorImage.colorCode}`}
                                                />
                                                <label htmlFor={`file-${colorImage.colorCode}`} className={styles.uploadLabel}>
                                                    <strong>Subir imagen para {colorImage.colorName}</strong>
                                                    <span>Arrastra una imagen aquí o haz clic para seleccionar</span>
                                                    <small>JPG, PNG, WEBP (máx. 5MB)</small>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

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

