// app/api/admin/create-admin/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Users from "@/database/models/users";
import bcrypt from "bcryptjs";

/**
 * Endpoint para crear un usuario administrador
 * IMPORTANTE: En producción, protege esta ruta o elimínala
 *
 * Uso: POST /api/admin/create-admin
 * Body: { email, password, name }
 */
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
            // Si existe, actualizar a admin
            existingUser.role = "admin";
            if (password) {
                existingUser.password = await bcrypt.hash(password, 10);
            }
            await existingUser.save();

            return NextResponse.json({
                ok: true,
                message: "Usuario actualizado a administrador",
                user: {
                    id: existingUser._id.toString(),
                    email: existingUser.email,
                    name: existingUser.name,
                    role: existingUser.role,
                },
            });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario administrador
        const newAdmin = await Users.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            role: "admin",
        });

        return NextResponse.json({
            ok: true,
            message: "Administrador creado exitosamente",
            user: {
                id: newAdmin._id.toString(),
                email: newAdmin.email,
                name: newAdmin.name,
                role: newAdmin.role,
            },
        });
    } catch (error) {
        console.error("Error creando administrador:", error);
        return NextResponse.json(
            { ok: false, error: "Error al crear administrador" },
            { status: 500 }
        );
    }
}

