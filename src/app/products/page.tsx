import { Card } from "@/components/ui/card"
import { directus } from "@/lib/utils"
import { readItems } from "@directus/sdk"


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
        const products = await directus.request(readItems('products'));
        if (products.length) {
            return products as Product[];
        }
        return [];
    }
    const products = await getProducts();

    return (
    <div>
        <Card>
            {products.map((product) => {
                return <Card key={product.id}>
                    <p>{product.name}</p>
                    <p>{product.price}</p>
                    <p>{product.stock_quantity}</p>
                    <p>{product.description}</p>
                    </Card>
            })}
        </Card>
    </div>
    )
}