// components/Pagination.tsx
"use client";

import React from "react";
import styles from "./Pagination.module.css";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Generar array de páginas a mostrar
    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Mostrar todas las páginas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Lógica para mostrar páginas con ellipsis
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push("ellipsis");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("ellipsis");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("ellipsis");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("ellipsis");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav
            className={styles.nav}
            aria-label="Paginación"
            role="navigation"
        >
            {/* Botón Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.button}
                aria-label="Página anterior"
            >
                Prev
            </button>

            {/* Números de página */}
            <div className={styles.pagesContainer}>
                {pageNumbers.map((page, index) => {
                    if (page === "ellipsis") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className={styles.ellipsis}
                                aria-hidden="true"
                            >
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`${styles.pageButton} ${isActive ? styles.pageButtonActive : ""}`}
                            aria-label={`Ir a página ${pageNum}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            {/* Botón Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.button}
                aria-label="Página siguiente"
            >
                Next
            </button>
        </nav>
    );
}
