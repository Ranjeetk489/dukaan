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

export type ResponseObject = {
    response: {
        message: string,
        data: {},
        statusCode: number,
    }
}