// services/cartService.ts

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    color?: string;
    size?: string;
    qty: number;
    image?: string;
}

export interface CartResponse {
    success: boolean;
    cart?: {
        items: CartItem[];
        totalItems: number;
        totalPrice: number;
    };
    message?: string;
    error?: string;
}

class CartService {
    private baseUrl = '/api/cart';

    // Generar un session ID único para usuarios no logueados
    private getOrCreateSessionId(): string {
        if (typeof window === 'undefined') return '';

        let sessionId = document.cookie
            .split('; ')
            .find(row => row.startsWith('session-id='))
            ?.split('=')[1];

        if (!sessionId) {
            sessionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            // Expira en 30 días
            const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
            document.cookie = `session-id=${sessionId}; expires=${expires}; path=/`;
        }

        return sessionId;
    }

    // Obtener carrito
    async getCart(): Promise<CartResponse> {
        try {
            this.getOrCreateSessionId(); // Asegurar que existe session ID

            const response = await fetch(this.baseUrl, {
                method: 'GET',
                credentials: 'include', // Incluir cookies
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting cart:', error);
            return {
                success: false,
                error: 'Error al obtener el carrito'
            };
        }
    }

    // Agregar item al carrito
    async addItem(item: Omit<CartItem, 'qty'> & { qty?: number }): Promise<CartResponse> {
        try {
            this.getOrCreateSessionId();

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...item,
                    qty: item.qty || 1
                }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            return {
                success: false,
                error: 'Error al agregar el producto al carrito'
            };
        }
    }

    // Actualizar cantidad de un item
    async updateItemQuantity(
        productId: string,
        qty: number,
        color?: string,
        size?: string
    ): Promise<CartResponse> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    productId,
                    color,
                    size,
                    qty
                }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating cart item:', error);
            return {
                success: false,
                error: 'Error al actualizar el producto'
            };
        }
    }

    // Eliminar item del carrito
    async removeItem(productId: string, color?: string, size?: string): Promise<CartResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    productId,
                    color,
                    size
                }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error removing cart item:', error);
            return {
                success: false,
                error: 'Error al eliminar el producto del carrito'
            };
        }
    }

    // Vaciar carrito
    async clearCart(): Promise<CartResponse> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return {
                success: false,
                error: 'Error al vaciar el carrito'
            };
        }
    }
}

export const cartService = new CartService();
