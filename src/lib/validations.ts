
import * as yup from "yup";

//register

export const registroSchema = yup.object({
    name: yup
        .string()
        .required("El nombre es obligatorio")
        .min(2, "El nombre debe tener al menos 2 caracteres"),

    email: yup
        .string()
        .required("El email es obligatorio")
        .email("Debe ser un email válido"),

    password: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
});


//login
export const loginSchema = yup.object({
    email: yup
        .string()
        .required("El email es obligatorio")
        .email("Debe ser un email válido"),

    password: yup
        .string()
        .required("La contraseña es obligatoria"),
});

//product
export const productoSchema = yup.object({
    name: yup
        .string()
        .required("El nombre del producto es obligatorio")
        .min(3, "El nombre debe tener al menos 3 caracteres"),

    collection: yup
        .string()
        .required("La colección es obligatoria"),

    color: yup
        .string()
        .required("El color es obligatorio"),

    size: yup
        .string()
        .required("La talla es obligatoria")
        .oneOf(["XS", "S", "M", "L", "XL"], "Talla inválida"),  // Solo estas opciones

    price: yup
        .number()                           // Debe ser número
        .required("El precio es obligatorio")
        .positive("El precio debe ser mayor a 0")    // > 0
        .max(10000, "El precio no puede ser mayor a $10,000"),

    inStock: yup
        .boolean()                          // true o false
        .required("Debe especificar si está en stock"),
});
//contact
export const contactoSchema = yup.object({
    name: yup
        .string()
        .required("Tu nombre es obligatorio"),

    email: yup
        .string()
        .required("Tu email es obligatorio")
        .email("Debe ser un email válido"),

    message: yup
        .string()
        .required("El mensaje es obligatorio")
        .min(10, "El mensaje debe tener al menos 10 caracteres")
        .max(500, "El mensaje no puede tener más de 500 caracteres"),
});


//helper
export async function validar(schema: any, datos: any) {
    try {
        // Si todo está bien, devuelve los datos validados
        const datosValidados = await schema.validate(datos, { abortEarly: false });
        return {
            valido: true,
            datos: datosValidados,
            errores: []
        };
    } catch (error: any) {
        // Si hay errores, los devuelve en un formato fácil
        const errores = error.inner.map((err: any) => ({
            campo: err.path,
            mensaje: err.message
        }));
        return {
            valido: false,
            datos: null,
            errores: errores
        };
    }
}

