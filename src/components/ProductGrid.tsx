// components/ProductGrid.tsx
"use client";

import { useState, useMemo } from "react";
import ProductCard, { Product } from "./ProductCard";
import Pagination from "./Pagination";
import styles from "./ProductGrid.module.css";

type ProductGridProps = {
    products: Product[];
    itemsPerPage?: number;
};

export default function ProductGrid({ products, itemsPerPage = 8 }: ProductGridProps) {
    const [currentPage, setCurrentPage] = useState(1);

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
            {/* Título de sección */}
            <h2 className={styles.title}>
                Nuestros productos
            </h2>

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
