// models/products.ts
import { Schema, model, models } from "mongoose";

// Schema para imágenes por color
const colorImageSchema = new Schema({
    colorCode: {
        type: String,
        required: true,
    },
    colorName: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    }
}, { _id: false });

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
        // Colores disponibles para este producto
        availableColors: [colorImageSchema],
        // Tallas disponibles
        availableSizes: [{
            type: String,
            required: true
        }],
        price: {
            type: Number,
            required: true,
        },
        // Imagen principal (por compatibilidad)
        image: {
            type: String,
            required: false,
        },
        inStock: {
            type: Boolean,
            required: true,
            default: true,
        },
        description: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

const Products = models.Products || model("Products", productsSchema);

export default Products;
