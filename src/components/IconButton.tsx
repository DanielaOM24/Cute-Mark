// components/IconButton.tsx
"use client";

import React from "react";
import styles from "./IconButton.module.css";

type IconButtonProps = {
    icon: React.ReactNode;
    onClick?: () => void;
    badge?: number;
    ariaLabel: string;
    className?: string;
};

export default function IconButton({ icon, onClick, badge, ariaLabel, className = "" }: IconButtonProps) {
    return (
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            className={`${styles.button} ${className}`}
        >
            {icon}
            {badge !== undefined && badge > 0 && (
                <span className={styles.badge}>
                    {badge}
                </span>
            )}
        </button>
    );
}
