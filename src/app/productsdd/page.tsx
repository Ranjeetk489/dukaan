import ProductCard from "@/components/block/productCard"
import { Card } from "@/components/ui/card"
import { directus } from "@/lib/utils"
import { readItems } from "@directus/sdk"
import Image from "next/image"


type Props = {}
type Product = {
    id: string
    name: string
    price: number
    description: string
    stock_quantity: number
    category_id: string
    created_at: string
    updated_at: string
    image: string
}

export default async function Page({}: Props) {
    async function getProducts (): Promise<Product[] | []> {
        // @ts-ignore
        const products = await directus.request(readItems('products'));
        if (products.length) {
            return products as Product[];
        }
        return [];
    }
    const products = await getProducts();

    return (
    <div className="flex overflow-x-auto">       
            {
                products.map((product, idx) => (
                    // eslint-disable-next-line react/jsx-key
                    <ProductCard product={product} key={idx}/>
                ))
            }
    </div>
    )
}

