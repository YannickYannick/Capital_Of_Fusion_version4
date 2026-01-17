import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CartState {
    items: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (product) => {
                const items = get().items;
                const existingItem = items.find((i) => i.product_id === product.id);

                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            i.product_id === product.id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...items,
                            {
                                id: Math.random().toString(36).substr(2, 9),
                                product_id: product.id,
                                name: product.name,
                                price: parseFloat(product.price),
                                quantity: 1,
                                image: product.image,
                            },
                        ],
                    });
                }
            },
            removeFromCart: (productId) => {
                set({
                    items: get().items.filter((i) => i.product_id !== productId),
                });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.product_id === productId ? { ...i, quantity } : i
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            get total() {
                return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'bachatavibe-cart',
        }
    )
);
