// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function LoginPage() {
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
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            toast.error("Error al iniciar sesión");
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
            toast.error("Error al iniciar sesión con Google");
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #FDE8EE 0%, #FFF7E6 100%)",
            padding: "20px",
        }}>
            <div style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                width: "100%",
                maxWidth: "400px",
            }}>
                <h1 style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#3b2150",
                    marginBottom: "8px",
                    textAlign: "center",
                }}>
                    Iniciar Sesión
                </h1>
                <p style={{
                    color: "#6b7280",
                    textAlign: "center",
                    marginBottom: "32px",
                    fontSize: "14px",
                }}>
                    Ingresa a tu cuenta
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#3b2150",
                            marginBottom: "8px",
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: "10px",
                                border: "1px solid rgba(200, 200, 210, 0.6)",
                                fontSize: "15px",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "rgba(200, 160, 220, 0.8)"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(200, 200, 210, 0.6)"}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#3b2150",
                            marginBottom: "8px",
                        }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: "10px",
                                border: "1px solid rgba(200, 200, 210, 0.6)",
                                fontSize: "15px",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "rgba(200, 160, 220, 0.8)"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(200, 200, 210, 0.6)"}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: "10px",
                            border: "none",
                            background: "linear-gradient(90deg, rgba(255, 223, 230, 0.95), rgba(243, 232, 255, 0.95))",
                            color: "#3b2150",
                            fontWeight: "700",
                            fontSize: "16px",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1,
                            transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 14px rgba(200, 160, 220, 0.2)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </button>
                </form>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    margin: "20px 0",
                    color: "#9ca3af",
                    fontSize: "14px",
                }}>
                    <div style={{ flex: 1, height: "1px", background: "rgba(200, 200, 210, 0.6)" }} />
                    <span>o</span>
                    <div style={{ flex: 1, height: "1px", background: "rgba(200, 200, 210, 0.6)" }} />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(200, 200, 210, 0.6)",
                        background: "white",
                        color: "#3b2150",
                        fontWeight: "600",
                        fontSize: "16px",
                        cursor: loading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.currentTarget.style.background = "rgba(253, 232, 238, 0.3)";
                            e.currentTarget.style.borderColor = "rgba(236, 72, 153, 0.5)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.borderColor = "rgba(200, 200, 210, 0.6)";
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
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
                    Continuar con Google
                </button>

                <p style={{
                    textAlign: "center",
                    marginTop: "24px",
                    fontSize: "14px",
                    color: "#6b7280",
                }}>
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" style={{
                        color: "#3b2150",
                        fontWeight: "600",
                        textDecoration: "none",
                    }}>
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}

