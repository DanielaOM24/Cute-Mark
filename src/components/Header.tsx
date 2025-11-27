// components/Header.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useState } from "react";
import IconButton from "./IconButton";
import LoginModal from "./LoginModal";
import HamburgerMenu from "./HamburgerMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./Header.module.css";

export default function Header() {
    const { data: session } = useSession();
    const { getTotalItems } = useCart();
    const { t } = useLanguage();
    const totalItems = getTotalItems();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    return (
        <>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    {/* Logo - estilo script/serif */}
                    <Link href="/" className={styles.logo}>
                        Cute Mark
                    </Link>

                    {/* Navegación derecha */}
                    <div className={styles.navRight}>
                        {/* Selector de idioma */}
                        <LanguageSwitcher />

                        {/* Carrito */}
                        <Link href="/cart" style={{ textDecoration: "none" }}>
                            <IconButton
                                icon={
                                    <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                }
                                badge={totalItems}
                                ariaLabel={t('header.cart')}
                            />
                        </Link>

                        {/* Perfil/Login */}
                        {session ? (
                            <div className={styles.userSection}>
                                <Link href="/profile" className={styles.userLink}>
                                    {session.user?.name || t('header.profile')}
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className={styles.logoutBtn}
                                >
                                    {t('header.logout')}
                                </button>
                            </div>
                        ) : (
                            <IconButton
                                icon={
                                    <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                }
                                onClick={() => setIsLoginModalOpen(true)}
                                ariaLabel={t('header.login')}
                            />
                        )}

                        {/* Menú hamburguesa (solo mobile) */}
                        <HamburgerMenu />
                    </div>
                </nav>
            </header>

            {/* Modal de login */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </>
    );
}
