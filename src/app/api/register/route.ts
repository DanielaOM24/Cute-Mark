// app/api/register/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Users from "@/database/models/users";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { ok: false, error: "Todos los campos son requeridos" },
                { status: 400 }
            );
        }

        await connect();

        // Verificar si el usuario ya existe
        const existingUser = await Users.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { ok: false, error: "El email ya está registrado" },
                { status: 400 }
            );
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = await Users.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
        });

        return NextResponse.json({
            ok: true,
            user: {
                id: newUser._id.toString(),
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error) {
        console.error("Error en registro:", error);
        return NextResponse.json(
            { ok: false, error: "Error al registrar usuario" },
            { status: 500 }
        );
    }
}

