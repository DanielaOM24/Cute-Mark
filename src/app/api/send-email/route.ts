// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateEmailTemplate } from "@/lib/emailTemplates";

interface EmailPayload {
    email: string;
    mensajeHtml?: string;
    asunto: string;
    title?: string;
    message?: string;
    buttonText?: string;
    buttonLink?: string;
    footerText?: string;
}

export async function POST(request: Request) {
    try {
        const payload: EmailPayload = await request.json();
        const { email, mensajeHtml, asunto, title, message, buttonText, buttonLink, footerText } = payload;

        if (!email || !asunto) {
            return NextResponse.json(
                { res: "Faltan campos requeridos (email y asunto)" },
                { status: 400 }
            );
        }

        const userMail = process.env.MAIL_USER;
        const passMail = process.env.MAIL_PASS;

        if (!userMail || !passMail) {
            return NextResponse.json(
                { res: "Configuración de correo incompleta" },
                { status: 500 }
            );
        }

        // Si se proporciona mensajeHtml, usarlo directamente
        // Si no, generar template bonito con los otros parámetros
        let htmlContent: string;
        if (mensajeHtml) {
            htmlContent = mensajeHtml;
        } else if (title && message) {
            htmlContent = generateEmailTemplate({
                title,
                message,
                buttonText,
                buttonLink,
                footerText,
            });
        } else {
            return NextResponse.json(
                { res: "Debe proporcionar mensajeHtml o (title y message)" },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: userMail,
                pass: passMail,
            },
        });

        await transporter.sendMail({
            from: `"Cute Mark" <${userMail}>`,
            to: email,
            subject: asunto,
            html: htmlContent,
        });

        return NextResponse.json(
            { res: "Mensaje enviado con éxito" },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Error al enviar correo:", error);

        if (error instanceof Error) {
            return NextResponse.json(
                { res: "Error al enviar el mensaje", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { res: "Error desconocido al enviar el mensaje" },
            { status: 500 }
        );
    }
}

