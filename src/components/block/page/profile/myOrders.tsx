import { useEffect, useState } from "react"
import OrderModal from "./orderModal"
import { Order } from "@/types/client/types"

type Props = {
    
}

const MyOrders = (props: Props) => {
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        getOrders();
    },[])
    const getOrders = async () => {
        const data: Order[] = [
            {
                id: 1,
                user_id: 1,
                order_date: "2022-01-01",
                total_amount: 100,
                status: "order_placed",
                order_items: [
                    {   
                        id: 1,
                        order_id: 1,
                        product_id: 1,
                        product_name: "Product 1",
                        quantity: 1,
                        price_per_unit: 100,
                        created_at: "2022-01-01",
                        updated_at: "2022-01-01"
                    },
                    {   
                        id: 2,
                        order_id: 1,
                        product_id: 2,
                        product_name: "Product 2",
                        quantity: 1,
                        price_per_unit: 100,
                        created_at: "2022-01-01",
                        updated_at: "2022-01-01"
                    },
                    {   
                        id: 3,
                        order_id: 1,
                        product_id: 3,
                        product_name: "Product 3",
                        quantity: 1,
                        price_per_unit: 100,
                        created_at: "2022-01-01",
                        updated_at: "2022-01-01"
                    }
                ],
                created_at: "2022-01-01",
                updated_at: "2022-01-01"
            },
            {
                id: 2,
                user_id: 1,
                order_date: "2022-01-01",
                total_amount: 100,
                status: "order_placed",
                order_items: [
                    {   
                        id: 5,
                        order_id: 1,
                        product_id: 1,
                        product_name: "Product 1",
                        quantity: 1,
                        price_per_unit: 100,
                        created_at: "2022-01-01",
                        updated_at: "2022-01-01"
                    }
                ],
                created_at: "2022-01-01",
                updated_at: "2022-01-01"
            }
        ]
        if (data) {
            setOrders(data)
        }
    }

    return (
        <>
        <div className="flex gap-4">
            Orders
        </div>
        <OrderModal 
        orders={orders}
        />
        </>
    )
}

export default MyOrders