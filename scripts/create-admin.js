// scripts/create-admin.js
// Script para crear un usuario administrador directamente
// Uso: node scripts/create-admin.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI no definida en .env.local");
    process.exit(1);
}

const usersSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: false,
            default: "",
        },
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin"],
        },
    },
    { timestamps: true }
);

const Users = mongoose.models.Users || mongoose.model("Users", usersSchema);

async function createAdmin() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Conectado a MongoDB");

        // Datos del administrador (puedes cambiarlos)
        const adminEmail = process.argv[2] || "admin@cutemark.com";
        const adminPassword = process.argv[3] || "admin123";
        const adminName = process.argv[4] || "Administrador";

        console.log(`\n📝 Creando administrador:`);
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Nombre: ${adminName}`);

        // Verificar si ya existe
        const existingUser = await Users.findOne({ email: adminEmail.toLowerCase() });

        if (existingUser) {
            // Actualizar a admin
            existingUser.role = "admin";
            if (adminPassword) {
                existingUser.password = await bcrypt.hash(adminPassword, 10);
            }
            await existingUser.save();
            console.log("✅ Usuario actualizado a administrador");
        } else {
            // Crear nuevo admin
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const newAdmin = await Users.create({
                email: adminEmail.toLowerCase(),
                password: hashedPassword,
                name: adminName,
                role: "admin",
            });
            console.log("✅ Administrador creado exitosamente");
        }

        console.log("\n🎉 ¡Listo! Puedes iniciar sesión con:");
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

createAdmin();

