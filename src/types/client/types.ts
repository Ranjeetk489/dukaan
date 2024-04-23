export interface ProductFromDB {
    id: number
    name: string
    description: string
    category_id: number
    created_at: string
    updated_at: string
    image: string
    quantity_id: number
}


export interface Product extends ProductFromDB {
    quantities: Quantity[]
}


export interface Quantity {
    id: number
    product_id: number
    quantity: string
    price: string
    is_stock_available: number
    count: number
    stock_quantity: number
    created_at: string
    updated_at: string
}

export interface CartItem extends ProductFromDB, Quantity{
    cart_id: number;
    cart_quantity: number;
}

export type ResponseObject = {
    response: {
        message: string,
        data: {};
        statusCode: number,
    }
}

export type ApiResponseObject<T> = {
    response: {
        message: string,
        data: T | null;
        statusCode: number,
    }
}

export interface CartItemQuantity extends Quantity {
    added_quantity: number
}

// export interface CartProduct extends Product {
//     quantities: CartItemQuantity[]
// }

export  interface Cart {
    [productId: number]: Product;
}

export interface Category {
    id: number;
    name: string; 
}