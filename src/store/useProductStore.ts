"use client"
import { NETWORK_STATES, fetchInsideTryCatch } from '@/lib/client/apiUtil';
import { Cart, Category, Product } from '@/types/client/types';
import { create } from 'zustand';

type NetworkState = typeof NETWORK_STATES[keyof typeof NETWORK_STATES];
interface ProductStore {
  products: Product[];
  cart: {
    data: Cart
    status: NetworkState
  },
  isCartSheetVisible: boolean,
  toggleCartSheet: (isOpen: boolean) => void
  updateCart: (cartItems: Cart) => void
  updateProductQuantityInCart: (product: Product, quantity: number) => void
  updateProductQuantityLocal: (product: Product, quantity: number) => void,
  
}


interface CategoryStore {
  categories: Category[],
  categoryProducts: {
    data: Product[],
    status: NetworkState
  },  
  updateCategories: (categories: Category[]) => void
  getProductsByCategory: (id: number) => void,
  updateCategoryProducts: (products: Product[]) => void
}


async function getProducts(): Promise<Product[] | []> {

  return []
}

async function addProductToCart(product: Product) {

  return product
}

async function getCartItems() {
  const cartItems = await fetchInsideTryCatch<Product[]>('api/cart', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  cart: {
    data: [],
    status: NETWORK_STATES.IDLE
  },
  isCartSheetVisible: false,
  toggleCartSheet: (isOpen) => {
    set(state => ({ isCartSheetVisible: isOpen }))
  },
  updateCart: (cartItems) => {
    set(state => ({ cart: { data: cartItems , status: NETWORK_STATES.IDLE} }))
  },
  updateProductQuantityLocal: (product, quantity) => {
    // set(state => ({ cart: { data: {...state.cart.data, [product.id]: {product, quantity}}, status: NETWORK_STATES.IDLE } }))
  },
  updateProductQuantityInCart: async (product, quantity) => {
    set(state => ({ cart: { data: state.cart.data, status: NETWORK_STATES.LOADING } }))
    const data = await fetchInsideTryCatch('api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: product.id, quantity: quantity })
    }, {
      retryDelay: 1000,
      maxRetries: 3
    }
    )
    if (data && data.response.statusCode !== 200) {
      const cartState = get().cart.data
      delete cartState[product.id]
      set(state => ({ cart: { data: cartState, status: NETWORK_STATES.ERROR } }))
    }
    set(state => ({ cart: { data: get().cart.data, status: NETWORK_STATES.SUCCESS } }))
  }
}))


async function getProductsByCategoryId(id:number): Promise<Product[]> {
  const result = await fetchInsideTryCatch<Product[]>(`api/product?categoryId=${id}`)
  if(result && result.response.statusCode === 200 && result.response.data) {
    return result.response.data
  }
  return []
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  categoryProducts: {
    data: [],
    status: NETWORK_STATES.IDLE
  },

  updateCategories: (categories) => {
    set(state => ({ categories }))
  },
  updateCategoryProducts: (products) => {
    set(state => ({ categoryProducts: { data: products, status: NETWORK_STATES.IDLE } }))
  },
  getProductsByCategory: async (id: number) => {
    set(state => ({ categoryProducts: {
      data: [],
      status: NETWORK_STATES.LOADING
    } }))
    const products = await getProductsByCategoryId(id)
    set(state => ({ categoryProducts: {
      data: products,
      status: NETWORK_STATES.IDLE
    } }))
  }
}))