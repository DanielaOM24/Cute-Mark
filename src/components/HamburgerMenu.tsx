// components/HamburgerMenu.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./HamburgerMenu.module.css";

type HamburgerMenuProps = {
    links?: Array<{ href: string; label: string }>;
};

export default function HamburgerMenu({ links = [] }: HamburgerMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Cerrar con ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen]);

    // Prevenir scroll cuando está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const defaultLinks = [
        { href: "/", label: "Inicio" },
        { href: "/", label: "Productos" },
        { href: "/cart", label: "Carrito" },
        ...links,
    ];

    return (
        <>
            {/* Botón hamburguesa */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.button}
                aria-label="Abrir menú"
                aria-expanded={isOpen}
            >
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Panel lateral */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className={styles.overlay}
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Panel */}
                    <aside
                        className={styles.panel}
                        role="navigation"
                        aria-label="Menú de navegación"
                    >
                        <div className={styles.panelContent}>
                            {/* Header del panel */}
                            <div className={styles.panelHeader}>
                                <h2 className={styles.panelTitle}>Menú</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={styles.closeBtn}
                                    aria-label="Cerrar menú"
                                >
                                    <svg className={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Links */}
                            <nav className={styles.nav}>
                                {defaultLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={styles.navLink}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>
                </>
            )}
        </>
    );
}
