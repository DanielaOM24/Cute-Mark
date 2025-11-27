// app/test-email/page.tsx
// Página para probar el envío de emails
// URL: http://localhost:3000/test-email

"use client";

import { useState } from "react";
import { generateOrderConfirmationTemplate } from "@/lib/emailTemplates";
import { emailAPI } from "@/services/axios";

export default function TestEmailPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState<string | null>(null);
    const [tipoEmail, setTipoEmail] = useState<"simple" | "pedido">("simple");

    async function enviarEmail() {
        setLoading(true);
        setResultado(null);

        try {
            let emailData;

            if (tipoEmail === "simple") {
                // Email simple de prueba
                emailData = {
                    email: email,
                    asunto: "🧪 Prueba de Email",
                    title: "¡Hola!",
                    message: "Este es un email de prueba desde Cute Mark. Si lo recibes, ¡todo funciona correctamente!",
                    buttonText: "Ir a la Tienda",
                    buttonLink: "http://localhost:3000",
                    footerText: "Gracias por probar nuestro sistema de emails.",
                };
            } else {
                // Email de confirmación de pedido
                const pedidoEjemplo = {
                    orderNumber: "CM-" + Date.now(),
                    customerName: "Juan Pérez",
                    items: [
                        { name: "Camiseta Rosa", quantity: 2, price: 299.99 },
                        { name: "Falda Azul", quantity: 1, price: 450.00 },
                        { name: "Blusa Blanca", quantity: 1, price: 320.50 }
                    ],
                    total: 1370.48
                };

                const htmlContent = generateOrderConfirmationTemplate(pedidoEjemplo);

                emailData = {
                    email: email,
                    asunto: `✅ Confirmación de Pedido #${pedidoEjemplo.orderNumber}`,
                    mensajeHtml: htmlContent, // Usar el HTML generado directamente
                };
            }

            // Llamar a la API con axios
            const data = await emailAPI.enviar(emailData);
            setResultado(`✅ Email enviado exitosamente a: ${email}`);
        } catch (error: any) {
            const errorMsg = error.response?.data?.res || error.response?.data?.error || error.message;
            setResultado(`❌ Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={{ padding: "40px", maxWidth: "500px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#3b2150" }}>
                🧪 Probar Envío de Email
            </h1>

            {/* Selector de tipo de email */}
            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                    Tipo de email:
                </label>
                <select
                    value={tipoEmail}
                    onChange={(e) => setTipoEmail(e.target.value as "simple" | "pedido")}
                    style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        fontSize: "16px",
                        marginBottom: "16px",
                    }}
                >
                    <option value="simple">📧 Email Simple de Prueba</option>
                    <option value="pedido">🛍️ Confirmación de Pedido</option>
                </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                    Email de destino:
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        fontSize: "16px",
                    }}
                />
            </div>

            <button
                onClick={enviarEmail}
                disabled={loading || !email}
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
                {loading
                    ? "Enviando..."
                    : tipoEmail === "simple"
                        ? "Enviar Email Simple"
                        : "Enviar Confirmación de Pedido"
                }
            </button>

            {/* Información sobre lo que se va a enviar */}
            <div style={{
                marginTop: "16px",
                padding: "12px",
                background: "#f0f9ff",
                borderRadius: "8px",
                border: "1px solid #e0f2fe"
            }}>
                <p style={{ margin: "0", fontSize: "14px", color: "#0369a1" }}>
                    {tipoEmail === "simple"
                        ? "📧 Se enviará un email simple de prueba"
                        : "🛍️ Se enviará un email de confirmación con pedido de ejemplo (3 productos, total $1,370.48)"
                    }
                </p>
            </div>

            {resultado && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "16px",
                        borderRadius: "8px",
                        background: resultado.includes("✅") ? "#d4edda" : "#f8d7da",
                        color: resultado.includes("✅") ? "#155724" : "#721c24",
                    }}
                >
                    {resultado}
                </div>
            )}
        </main>
    );
}

