export interface Product {
    id: number
    name: string
    price: string
    description: string
    stock_quantity: number
    category_id: number
    created_at: string
    updated_at: string
    image: string 
}

export type ResponseObject<T> = {
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
  