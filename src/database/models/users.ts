// models/users.ts
import { Schema, model, models } from "mongoose";

const usersSchema = new Schema(
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
            required: false, // No requerido para usuarios de Google
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

// Esta línea es MUY importante en Next.js
// Evita problemas con Hot Reload que crean modelos repetidos.
const Users = models.Users || model("Users", usersSchema);

export default Users;

