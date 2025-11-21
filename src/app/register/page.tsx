// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!data.ok) {
                toast.error(data.error || "Error al registrar");
            } else {
                toast.success("¡Registro exitoso! Redirigiendo al login...");
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            }
        } catch (error) {
            toast.error("Error al registrar usuario");
        } finally {
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
                    Crear Cuenta
                </h1>
                <p style={{
                    color: "#6b7280",
                    textAlign: "center",
                    marginBottom: "32px",
                    fontSize: "14px",
                }}>
                    Regístrate para comenzar
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
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            minLength={6}
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
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <p style={{
                    textAlign: "center",
                    marginTop: "24px",
                    fontSize: "14px",
                    color: "#6b7280",
                }}>
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" style={{
                        color: "#3b2150",
                        fontWeight: "600",
                        textDecoration: "none",
                    }}>
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}

