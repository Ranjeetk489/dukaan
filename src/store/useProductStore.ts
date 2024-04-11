import { Product } from '@/types/client/types';
import { create } from 'zustand';

interface ProductStore {
    products: Product[];
    cart: Product[];
    getProducts: () => Promise<Product[] | []>;
    addToCart: (product: Product) => void;
    removeFromCart: (product: Product) => void;
}

async function getProducts (): Promise<Product[] | []> {
    // @ts-ignore
    const products = await directus.request(readItems('products'));
    if (products.length) {
        return products as Product[];
    }
    return [];
}
export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    cart: [],
    getProducts,
    addToCart: (product: Product) => set((state) => ({ cart: [...state.cart, product] })),
    removeFromCart: (product: Product) => set((state) => ({ cart: state.cart.filter((p) => p.id !== product.id) })),
}));