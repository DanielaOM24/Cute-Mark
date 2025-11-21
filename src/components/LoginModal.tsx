// components/LoginModal.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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
                toast.error("Email o contraseña incorrectos");
            } else {
                toast.success("¡Bienvenido!");
                onClose();
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            toast.error("Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Iniciar Sesión">
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                        placeholder="tu@email.com"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>
                        Contraseña
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={styles.submitBtn}
                >
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>

                <p className={styles.footer}>
                    ¿No tienes cuenta?{" "}
                    <Link
                        href="/register"
                        onClick={onClose}
                        className={styles.link}
                    >
                        Regístrate aquí
                    </Link>
                </p>
            </form>
        </Modal>
    );
}
