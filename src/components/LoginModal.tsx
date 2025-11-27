// components/LoginModal.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useLanguage } from "@/app/context/LanguageContext";
import Modal from "./Modal";
import Link from "next/link";
import styles from "./LoginModal.module.css";

type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error(t('login.errors.invalidCredentials'));
            } else {
                toast.success(t('common.success'));
                onClose();
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            toast.error(t('login.errors.loginFailed'));
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignIn() {
        setLoading(true);
        try {
            await signIn("google", {
                callbackUrl: "/",
            });
        } catch (error) {
            toast.error(t('login.errors.loginFailed'));
            setLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('login.title')}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label}>
                        {t('login.email')}
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                        placeholder={t('login.emailPlaceholder')}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>
                        {t('login.password')}
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                        placeholder={t('login.passwordPlaceholder')}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={styles.submitBtn}
                >
                    {loading ? t('common.loading') : t('login.loginButton')}
                </button>

                <div className={styles.divider}>
                    <span>o</span>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className={styles.googleBtn}
                >
                    <svg className={styles.googleIcon} viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    {t('login.loginButton')} Google
                </button>

                <p className={styles.footer}>
                    {t('login.registerLink').split(' ').slice(0, -2).join(' ')}{" "}
                    <Link
                        href="/register"
                        onClick={onClose}
                        className={styles.link}
                    >
                        {t('login.registerLink').split(' ').slice(-2).join(' ')}
                    </Link>
                </p>
            </form>
        </Modal>
    );
}
