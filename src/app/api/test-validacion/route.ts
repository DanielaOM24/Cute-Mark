// api/test-validacion/route.ts
// Ejemplo de validación en el BACKEND con Yup

import { NextRequest, NextResponse } from "next/server";
import { registroSchema, validar } from "@/lib/validations";

export async function POST(request: NextRequest) {
    try {
        // 1. Obtener los datos que envió el frontend
        const datos = await request.json();
        console.log("Datos recibidos:", datos);

        // 2. VALIDAR CON YUP (igual que en el frontend)
        const resultado = await validar(registroSchema, datos);

        // 3. Si hay errores, devolverlos
        if (!resultado.valido) {
            return NextResponse.json(
                {
                    ok: false,
                    mensaje: "Datos inválidos",
                    errores: resultado.errores
                },
                { status: 400 }  // Bad Request
            );
        }

        // 4. Si todo está bien, procesar los datos
        const datosValidados = resultado.datos;

        // AQUÍ harías lo que necesites: guardar en BD, enviar email, etc.
        console.log("✅ Datos válidos:", datosValidados);

        // 5. Devolver respuesta exitosa
        return NextResponse.json({
            ok: true,
            mensaje: "Datos válidos recibidos en el backend",
            datos: datosValidados,
        });

    } catch (error: any) {
        console.error("Error en validación backend:", error);
        return NextResponse.json(
            {
                ok: false,
                mensaje: "Error interno del servidor",
                error: error.message
            },
            { status: 500 }
        );
    }
}

