// app/api/cart/item/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/database/models/cart";

// Función para obtener el ID del usuario (igual que en route.ts principal)
async function getUserId(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
        return `user_${session.user.email}`;
    }

    const sessionId = request.cookies.get('session-id')?.value;
    if (sessionId) {
        return `session_${sessionId}`;
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    return `session_${ip}_${Date.now()}`;
}

// DELETE - Eliminar un item específico del carrito
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const userId = await getUserId(request);
        const body = await request.json();

        const { productId, color, size } = body;

        if (!productId) {
            return NextResponse.json(
                { success: false, error: 'ProductId es requerido' },
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

        const itemIndex = cart.items.findIndex(item =>
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

        // Eliminar el item
        cart.items.splice(itemIndex, 1);
        await cart.save();

        return NextResponse.json({
            success: true,
            message: 'Producto eliminado del carrito',
            cart: {
                items: cart.items,
                totalItems: cart.items.reduce((sum, item) => sum + item.qty, 0),
                totalPrice: cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0)
            }
        });

    } catch (error) {
        console.error('Error removing item from cart:', error);
        return NextResponse.json(
            { success: false, error: 'Error al eliminar el producto del carrito' },
            { status: 500 }
        );
    }
}
