// components/Hero.tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import styles from "./Hero.module.css";

type HeroProps = {
    imageUrl?: string;
};

export default function Hero({ imageUrl = "/hero-boutique.jpg" }: HeroProps) {
    const { t } = useLanguage();

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
                        {t('hero.title')}
                    </h1>

                    {/* Subtítulo */}
                    <p className={styles.subtitle}>
                        {t('hero.subtitle')}
                    </p>

                    {/* CTA Button */}
                    <Link href="/#products" className={styles.ctaButton}>
                        {t('hero.shopNow')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
