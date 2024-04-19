"use client"
import { NETWORK_STATES, fetchInsideTryCatch } from '@/lib/client/apiUtil';
import { Cart, CartItem, Product } from '@/types/client/types';
import { create } from 'zustand';

type NetworkState = typeof NETWORK_STATES[keyof typeof NETWORK_STATES];
interface ProductStore {
  products: Product[];
  cart: {
    data: Cart
    status: NetworkState
  }
  updateCart: (cartItems: Cart) => void
  updateProductQuantityInCart: (product: Product, quantity: number) => void
  updateProductQuantityLocal: (product: Product, quantity: number) => void
  // getCartItems: () => void  
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


const dummyProducts = [
  {
    id: 1,
    name: 'Daawat Super Basmati Rice (Fluffy Long Grains)',
    description: 'Cooked rice, reaching up to 20mm in length, maintains its integrity without breaking when stirred.\n' +
      'The most versatile rice that is easy to cook and are firm and fluffy.\n' +
      'Known for natural aging process that enhances its aroma.\n' +
      'Nurture your well-being with a health-conscious choice.\n' +
      'Experience Perfect Taste and Aromatic rice with the Original Basmati.',
    price: '204',
    quantity: "500 grams",
    stock_quantity: 50,
    category_id: 1,
    created_at: '2024-04-06T07:40:13',
    updated_at: '2024-04-06T13:18:00',
    image: '26bb01e1-5895-4ea2-b8b6-b8e95493e28e'
  },
  {
    id: 2,
    name: 'Daawat Sehat Mini Mogra Basmati Rice (Broken)',
    description: 'Short and aromatic\nAuthentic taste\nLight and fluffy in texture',
    price: '297',
    quantity: "500 grams",
    stock_quantity: 100,
    category_id: 1,
    created_at: '2024-04-06T07:42:38',
    updated_at: '2024-04-06T13:18:00',
    image: '5385f99e-503f-4981-92a6-de46f375ed78'
  },
  {
    id: 3,
    name: 'Tata Sampann Unpolished Masoor Dal',
    description: 'Tata Sampann Masoor Dal (Whole) is delicious in taste\n' +
      'No artificial polishing with water, oil or leather, thereby retaining their goodness and wholesome character',
    price: '72',
    quantity: "500 grams",
    stock_quantity: 50,
    category_id: 1,
    created_at: '2024-04-06T07:48:23',
    updated_at: '2024-04-06T13:18:00',
    image: '9868de5c-af75-49d8-bc02-c13f12a56a15'
  },
  {
    id: 4,
    name: 'Del Monte Tomato Ketchup',
    description: 'Made from a blend of juicy tomatoes and spices\n' +
      'Offers a mixed tangy-sweet taste',
    price: '79',
    quantity: "500 grams",
    stock_quantity: 50,
    category_id: 2,
    created_at: '2024-04-06T07:50:56',
    updated_at: '2024-04-06T13:20:54',
    image: '947d9afa-8def-470a-ac73-e875300e2cdb'
  },
  {
    id: 5,
    name: "Veeba Veg Mayonnaise - Chef's Special + Veeba Chef's Special Tomato Ketchup Combo",
    description: "Veeba Veg Mayonnaise - Chef's Special :- 6 months\n" +
      "Veeba Chef's Special Tomato Ketchup :- 9 months",
    price: '257',
    quantity: "500 grams",
    stock_quantity: 257,
    category_id: 2,
    created_at: '2024-04-06T07:52:55',
    updated_at: '2024-04-06T13:22:53',
    image: 'bc611f9f-f36e-47f7-a9a3-7ec12f5e7294'
  },
  {
    id: 6,
    name: 'Fortune Soya Health Refined Soyabean Oil',
    description: 'India’s No.1 Oil - Healthy Refined oil for your Family,\n' +
      'Fortified with the goodness of Vitamin A and Vitamin D,\n' +
      'Rich in Omega 3 – helps keep Heart healthy,\n' +
      'Contains PUFA – which helps in reducing cholesterol levels,\n' +
      'Helps maintain Strong Bones,\n' +
      'Adds extra Flavour to your favourite food.',
    price: '122',
    quantity: "500 grams",
    stock_quantity: 22,
    category_id: 3,
    created_at: '2024-04-06T07:55:08',
    updated_at: '2024-04-06T13:25:00',
    image: 'd107a712-e287-4aa0-bbc3-ac3fa6628005'
  },
  {
    id: 7,
    name: 'Mop',
    description: 'High-quality cleaning mop for household use',
    price: '1159',
    quantity: "500 grams",
    stock_quantity: 100,
    category_id: 4,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'b530031e-cde4-4ff5-aeea-353eb918393d'
  },
  {
    id: 8,
    name: 'Laundry Detergent',
    description: 'Powerful detergent for effective laundry cleaning. Tide Plus Double Power has STAIN MAGNETS which remove the toughest of stains to give you stainless whites.',
    price: '1014',
    quantity: "500 grams",
    stock_quantity: 200,
    category_id: 4,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'a60b55ae-67c0-4151-88d2-94f6bc3d622b'
  },
  {
    id: 9,
    name: 'Broom',
    description: 'Durable broom for sweeping floors',
    price: '313',
    quantity: "500 grams",
    stock_quantity: 150,
    category_id: 4,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'e60f55b8-bf10-4b02-a899-f3e7e619efaa'
  },
  {
    id: 10,
    name: 'Crystal Oxo-Degradable Garbage Bag (M, 19x21 Black) - Pack of 3',
    description: 'Large garbage bags for waste disposal',
    price: '150',
    quantity: "500 grams",
    stock_quantity: 300,
    category_id: 4,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: '7fbe8d31-ad22-4d21-81fe-232f7401ac8f'
  },
  {
    id: 11,
    name: 'Head & Shoulders Anti Dandruff Shampoo',
    description: 'Moisturizing shampoo for healthy hair',
    price: '502',
    quantity: "500 grams",
    stock_quantity: 120,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: '39afe2e8-63c5-476e-b0bd-bca56694138b'
  },
  {
    id: 12,
    name: 'Colgate Strong Teeth Anticavity Toothpaste (150 g)',
    description: 'Fluoride toothpaste for cavity protection',
    price: '92',
    quantity: "500 grams",
    stock_quantity: 250,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'f35db43d-ae88-4a2f-b1c4-9765d1bea315'
  },
  {
    id: 13,
    name: 'Nivea Body Milk Nourishing Lotion',
    description: 'Hydrating body lotion for soft skin',
    price: '110',
    quantity: "500 grams",
    stock_quantity: 180,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'eb11b40e-add4-4dce-8dde-981bddbf3d3c'
  },
  {
    id: 14,
    name: 'Dettol Skincare Hand Wash Refill',
    description: 'Gentle hand soap for effective cleansing',
    price: '91',
    quantity: "500 grams",
    stock_quantity: 200,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'ea7d848d-440a-443f-9eb4-01882c73076a'
  },
  {
    id: 15,
    name: 'Colgate Strong Teeth Anticavity Toothpaste (150 g)',
    description: 'Fluoride toothpaste for cavity protection',
    price: '92',
    quantity: "500 grams",
    stock_quantity: 250,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'f35db43d-ae88-4a2f-b1c4-9765d1bea315'
  },
  {
    id: 16,
    name: 'Nivea Body Milk Nourishing Lotion',
    description: 'Hydrating body lotion for soft skin',
    price: '110',
    quantity: "500 grams",
    stock_quantity: 180,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'eb11b40e-add4-4dce-8dde-981bddbf3d3c'
  },
  {
    id: 17,
    name: 'Dettol Skincare Hand Wash Refill',
    description: 'Gentle hand soap for effective cleansing',
    price: '91',
    quantity: "500 grams",
    stock_quantity: 200,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'ea7d848d-440a-443f-9eb4-01882c73076a'
  },
  {
    id: 18,
    name: 'Colgate Strong Teeth Anticavity Toothpaste (150 g)',
    description: 'Fluoride toothpaste for cavity protection',
    price: '92',
    quantity: "500 grams",
    stock_quantity: 250,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'f35db43d-ae88-4a2f-b1c4-9765d1bea315'
  },
  {
    id: 19,
    name: 'Nivea Body Milk Nourishing Lotion',
    description: 'Hydrating body lotion for soft skin',
    price: '110',
    quantity: "500 grams",
    stock_quantity: 180,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'eb11b40e-add4-4dce-8dde-981bddbf3d3c'
  },
  {
    id: 20,
    name: 'Dettol Skincare Hand Wash Refill',
    description: 'Gentle hand soap for effective cleansing',
    price: '91',
    quantity: "500 grams",
    stock_quantity: 200,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'ea7d848d-440a-443f-9eb4-01882c73076a'
  },
  {
    id: 21,
    name: 'Colgate Strong Teeth Anticavity Toothpaste (150 g)',
    description: 'Fluoride toothpaste for cavity protection',
    price: '92',
    quantity: "500 grams",
    stock_quantity: 250,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'f35db43d-ae88-4a2f-b1c4-9765d1bea315'
  },
  {
    id: 22,
    name: 'Nivea Body Milk Nourishing Lotion',
    description: 'Hydrating body lotion for soft skin',
    price: '110',
    quantity: "500 grams",
    stock_quantity: 180,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'eb11b40e-add4-4dce-8dde-981bddbf3d3c'
  },
  {
    id: 23,
    name: 'Dettol Skincare Hand Wash Refill',
    description: 'Gentle hand soap for effective cleansing',
    price: '91',
    quantity: "500 grams",
    stock_quantity: 200,
    category_id: 5,
    created_at: '2024-04-06T08:05:28',
    updated_at: '2024-04-06T08:05:28',
    image: 'ea7d848d-440a-443f-9eb4-01882c73076a'
  },
];

export const useProductStore = create<ProductStore>((set, get) => ({
  products: dummyProducts,
  cart: {
    data: [],
    status: NETWORK_STATES.IDLE
  },
  updateCart: (cartItems) => {
    set(state => ({ cart: { data: cartItems , status: NETWORK_STATES.IDLE} }))
  },
  updateProductQuantityLocal: (product, quantity) => {
    set(state => ({ cart: { data: {...state.cart.data, [product.id]: {product, quantity}}, status: NETWORK_STATES.IDLE } }))
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
