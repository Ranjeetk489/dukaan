export interface ProductFromDB {
    id: number
    name: string
    description: string
    category_id: number
    created_at?: string
    updated_at?: string
    image: string
    quantity_id?: number
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
    count?: number
    stocked_quantity: number
    created_at?: string
    updated_at?: string
}

export interface CartItem extends ProductFromDB, Quantity {
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

export interface Cart {
    [productId: number]: Product;
}

export interface Category {
    id: number;
    name: string;
}


export interface NewProduct {
    id?: number;
    name: string;
    description: string;
    image: string;
    category_id: string;
    quantities: QuantityInAddProduct[];
    created_at: string;
    updated_at: string;
}

export interface QuantityInAddProduct {
    id?: number;
    product_id?: number;
    is_stock_available?: number;
    quantity: string;
    price: string;
    stocked_quantity: string;
}

export interface AdminDashboardOrders {
    id: number;
    user_id: number;
    order_date: string;
    total_amount: number;
    status: "order_placed" | "out_for_delivery" | "cancelled" | "delivered";
    created_at: string,
    updated_at: string,
    products: ProductFromDB[]
}