// components/Modal.tsx
"use client";

import React, { useEffect } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
};

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
    // Cerrar con ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Prevenir scroll del body cuando está abierto
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

    if (!isOpen) return null;

    return (
        <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
        >
            {/* Overlay */}
            <div
                className={styles.backdrop}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div className={styles.content}>
                {/* Header */}
                {title && (
                    <div className={styles.header}>
                        <h2 id="modal-title" className={styles.title}>
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className={styles.closeBtn}
                            aria-label="Cerrar modal"
                        >
                            <svg className={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </div>
    );
}
