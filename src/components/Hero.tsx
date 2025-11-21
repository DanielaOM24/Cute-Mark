// components/Hero.tsx
"use client";

import Link from "next/link";
import styles from "./Hero.module.css";

type HeroProps = {
    imageUrl?: string;
};

export default function Hero({ imageUrl = "/hero-boutique.jpg" }: HeroProps) {
    return (
        <section
            className={styles.section}
            style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : undefined}
        >
            {/* Overlay sutil para legibilidad */}
            <div className={styles.overlay} />

            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Título principal - estilo serif elegante */}
                    <h1 className={styles.title}>
                        autenticidad y belleza
                    </h1>

                    {/* Subtítulo */}
                    <p className={styles.subtitle}>
                        Diseños únicos para mujeres únicas.
                    </p>

                    {/* CTA Button */}
                    <Link href="/#products" className={styles.ctaButton}>
                        Compra ahora
                    </Link>
                </div>
            </div>
        </section>
    );
}
