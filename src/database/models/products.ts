// models/products.ts
import { Schema, model, models } from "mongoose";

const productsSchema = new Schema(
    {
        productId: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        collection: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        inStock: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true }
);

// Esta línea es MUY importante en Next.js
// Evita problemas con Hot Reload que crean modelos repetidos.
const Products = models.Products || model("Products", productsSchema);

export default Products;
