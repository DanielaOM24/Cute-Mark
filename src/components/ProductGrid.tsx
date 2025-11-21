// components/ProductGrid.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ProductCard, { Product } from "./ProductCard";
import Pagination from "./Pagination";
import { useAdmin } from "@/hooks/useAdmin";
import styles from "./ProductGrid.module.css";

type ProductGridProps = {
    products: Product[];
    itemsPerPage?: number;
};

export default function ProductGrid({ products, itemsPerPage = 8 }: ProductGridProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const { isAdmin, role, user } = useAdmin();

    // Debug temporal - eliminar después
    if (typeof window !== "undefined") {
        console.log("🔍 Debug ProductGrid:", { isAdmin, role, user });
    }

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return products.slice(startIndex, endIndex);
    }, [products, currentPage, itemsPerPage]);

    function handlePageChange(page: number) {
        setCurrentPage(page);
        // Scroll suave hacia arriba
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (products.length === 0) {
        return (
            <div className={styles.empty}>
                <p className={styles.emptyText}>No hay productos disponibles.</p>
            </div>
        );
    }

    return (
        <div id="products" className={styles.container}>
            {/* Título de sección con botón de agregar (solo admin) */}
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Nuestros productos
                </h2>
                {isAdmin && (
                    <Link href="/form-img" className={styles.addButton}>
                        <svg className={styles.addIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Nuevo Producto</span>
                    </Link>
                )}
            </div>

            {/* Grid de productos */}
            <div className={styles.grid}>
                {paginatedProducts.map((product) => (
                    <ProductCard key={product._id || product.productId} product={product} />
                ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}
