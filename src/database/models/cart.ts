// database/models/cart.ts
import mongoose from "mongoose";

export interface ICartItem {
    productId: string;
    name: string;
    price: number;
    color?: string;
    size?: string;
    qty: number;
    image?: string;
}

export interface ICart extends mongoose.Document {
    userId: string; // ID del usuario (puede ser session ID si no está logueado)
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String },
    size: { type: String },
    qty: { type: Number, required: true, min: 1 },
    image: { type: String }
});

const CartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true // Para búsquedas rápidas
    },
    items: [CartItemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware para actualizar updatedAt
CartSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Índice compuesto para userId
CartSchema.index({ userId: 1 });

// Método para limpiar carritos antiguos (opcional)
CartSchema.statics.cleanOldCarts = function (daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return this.deleteMany({
        updatedAt: { $lt: cutoffDate },
        userId: { $regex: /^session_/ } // Solo limpiar carritos de sesión
    });
};

export const Cart = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
