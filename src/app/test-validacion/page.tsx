// app/test-validacion/page.tsx
// Página para probar validaciones con Yup
// URL: http://localhost:3000/test-validacion

"use client";

import { useState } from "react";
import { registroSchema, validar } from "@/lib/validations";
import { validacionAPI } from "@/services/axios";

export default function TestValidacionPage() {
    // Estados para el formulario
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [errores, setErrores] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    // Función que se ejecuta cuando el usuario escribe
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    // Función que se ejecuta cuando envía el formulario
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErrores([]);
        setMensaje("");

        // AQUÍ ES DONDE USAMOS YUP PARA VALIDAR
        const resultado = await validar(registroSchema, formData);

        if (resultado.valido) {
            try {
                // ✅ TODO ESTÁ BIEN - Enviar al backend
                const respuestaBackend = await validacionAPI.probar(resultado.datos);
                setMensaje("✅ Validación exitosa! Frontend y backend OK: " + JSON.stringify(respuestaBackend));
            } catch (error: any) {
                const errorMsg = error.response?.data?.mensaje || error.message;
                setMensaje("❌ Error en backend: " + errorMsg);
            }
        } else {
            // ❌ HAY ERRORES
            setErrores(resultado.errores);
            setMensaje("❌ Hay errores en el formulario");
        }

        setLoading(false);
    }

    return (
        <main style={{ padding: "40px", maxWidth: "500px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#3b2150" }}>
                🧪 Probar Validaciones con Yup
            </h1>

            <form onSubmit={handleSubmit}>
                {/* CAMPO: NOMBRE */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                        Nombre:
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                        }}
                        placeholder="Tu nombre completo"
                    />
                </div>

                {/* CAMPO: EMAIL */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                        Email:
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                        }}
                        placeholder="tu@email.com"
                    />
                </div>

                {/* CAMPO: CONTRASEÑA */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                        Contraseña:
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                        }}
                        placeholder="Mínimo 6 caracteres"
                    />
                </div>

                {/* BOTÓN ENVIAR */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "none",
                        background: loading ? "#ccc" : "linear-gradient(90deg, #FDE8EE, #F3E8FF)",
                        color: "#3b2150",
                        fontWeight: "700",
                        fontSize: "16px",
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? "Validando..." : "Validar Formulario"}
                </button>
            </form>

            {/* MOSTRAR ERRORES */}
            {errores.length > 0 && (
                <div style={{
                    marginTop: "20px",
                    padding: "16px",
                    borderRadius: "8px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                }}>
                    <h3 style={{ color: "#dc2626", marginBottom: "10px", fontSize: "16px" }}>
                        Errores encontrados:
                    </h3>
                    <ul style={{ color: "#dc2626", paddingLeft: "20px" }}>
                        {errores.map((error, index) => (
                            <li key={index}>
                                <strong>{error.campo}:</strong> {error.mensaje}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* MOSTRAR MENSAJE */}
            {mensaje && (
                <div style={{
                    marginTop: "20px",
                    padding: "16px",
                    borderRadius: "8px",
                    background: mensaje.includes("✅") ? "#f0fdf4" : "#fef2f2",
                    color: mensaje.includes("✅") ? "#16a34a" : "#dc2626",
                }}>
                    {mensaje}
                </div>
            )}
        </main>
    );
}
