// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Cart, ICartItem } from "@/database/models/cart";
import connect from "@/lib/mongodb";

// Función para obtener el ID del usuario (logueado o sesión)
async function getUserId(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
        return `user_${session.user.email}`;
    }

    // Si no está logueado, usar sessionId de las cookies o crear uno temporal
    const sessionId = request.cookies.get('session-id')?.value;
    if (sessionId) {
        return `session_${sessionId}`;
    }

    // Generar un ID temporal basado en IP y timestamp
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    return `session_${ip}_${Date.now()}`;
}

// GET - Obtener carrito
export async function GET(request: NextRequest) {
    try {
        await connect();

        const userId = await getUserId(request);

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
            await cart.save();
        }

        return NextResponse.json({
            success: true,
            cart: {
                items: cart.items,
                totalItems: cart.items.reduce((sum: number, item: ICartItem) => sum + item.qty, 0),
                totalPrice: cart.items.reduce((sum: number, item: ICartItem) => sum + (item.price * item.qty), 0)
            }
        });

    } catch (error) {
        console.error('Error getting cart:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener el carrito' },
            { status: 500 }
        );
    }
}

// POST - Agregar item al carrito
export async function POST(request: NextRequest) {
    try {
        await connect();

        const userId = await getUserId(request);
        const body = await request.json();

        const { productId, name, price, color, size, qty = 1, image } = body;

        if (!productId || !name || !price) {
            return NextResponse.json(
                { success: false, error: 'Faltan datos requeridos' },
                { status: 400 }
            );
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Buscar si el item ya existe (mismo producto, color y talla)
        const existingItemIndex = cart.items.findIndex((item: ICartItem) =>
            item.productId === productId &&
            item.color === color &&
            item.size === size
        );

        if (existingItemIndex > -1) {
            // Actualizar cantidad
            cart.items[existingItemIndex].qty += qty;
        } else {
            // Agregar nuevo item
            const newItem: ICartItem = {
                productId,
                name,
                price,
                color,
                size,
                qty,
                image
            };
            cart.items.push(newItem);
        }

        await cart.save();

        return NextResponse.json({
            success: true,
            message: 'Producto agregado al carrito',
            cart: {
                items: cart.items,
                totalItems: cart.items.reduce((sum: number, item: ICartItem) => sum + item.qty, 0),
                totalPrice: cart.items.reduce((sum: number, item: ICartItem) => sum + (item.price * item.qty), 0)
            }
        });

    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json(
            { success: false, error: 'Error al agregar al carrito' },
            { status: 500 }
        );
    }
}

// PUT - Actualizar cantidad de un item
export async function PUT(request: NextRequest) {
    try {
        await connect();

        const userId = await getUserId(request);
        const body = await request.json();

        const { productId, color, size, qty } = body;

        if (!productId || qty === undefined) {
            return NextResponse.json(
                { success: false, error: 'Faltan datos requeridos' },
                { status: 400 }
            );
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return NextResponse.json(
                { success: false, error: 'Carrito no encontrado' },
                { status: 404 }
            );
        }

        const itemIndex = cart.items.findIndex((item: ICartItem) =>
            item.productId === productId &&
            item.color === color &&
            item.size === size
        );

        if (itemIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Producto no encontrado en el carrito' },
                { status: 404 }
            );
        }

        if (qty <= 0) {
            // Eliminar item
            cart.items.splice(itemIndex, 1);
        } else {
            // Actualizar cantidad
            cart.items[itemIndex].qty = qty;
        }

        await cart.save();

        return NextResponse.json({
            success: true,
            message: qty <= 0 ? 'Producto eliminado del carrito' : 'Cantidad actualizada',
            cart: {
                items: cart.items,
                totalItems: cart.items.reduce((sum: number, item: ICartItem) => sum + item.qty, 0),
                totalPrice: cart.items.reduce((sum: number, item: ICartItem) => sum + (item.price * item.qty), 0)
            }
        });

    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json(
            { success: false, error: 'Error al actualizar el carrito' },
            { status: 500 }
        );
    }
}

// DELETE - Vaciar carrito
export async function DELETE(request: NextRequest) {
    try {
        await connect();

        const userId = await getUserId(request);

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return NextResponse.json(
                { success: false, error: 'Carrito no encontrado' },
                { status: 404 }
            );
        }

        cart.items = [];
        await cart.save();

        return NextResponse.json({
            success: true,
            message: 'Carrito vaciado',
            cart: {
                items: [],
                totalItems: 0,
                totalPrice: 0
            }
        });

    } catch (error) {
        console.error('Error clearing cart:', error);
        return NextResponse.json(
            { success: false, error: 'Error al vaciar el carrito' },
            { status: 500 }
        );
    }
}
