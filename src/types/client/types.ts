export interface Product {
    id: number
    name: string
    price: string
    description: string
    category_id: number
    created_at: string
    updated_at: string
    image: string
    quantity: Quantity
}

export interface Quantity {
    id: number
    quantity: number
    price: number
    is_stock_available: number
    stock_quantity: number
    created_at: string
    updated_at: string
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


export interface CartItem {
    product: Product;
    quantity: number;
}
  
export  interface Cart {
    [productId: number]: CartItem;
}

export interface Category {
    id: number;
    name: string; 
}