import { NextApiRequest, NextApiResponse } from 'next';
import { responseHelper } from '@/lib/helpers';
import { directus } from '@/lib/utils';
import { createItem, createItems, deleteItem, readItems, updateItem } from '@directus/sdk';


export async function GET(req: Request) {
    try {
        // userId will come in params
        const { userId } = await req.json();
        // Fetch all orders for the user
        const orders = await directus.request(readItems('orders', {
            filter: {
                user_id: {
                    _eq: userId
                }
            }
        }));
        return responseHelper({ message: 'Orders fetched successfully', statusCode: 200, data: orders }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}


export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        let listOfProductId: number[] = [];

        const cartItems = await directus.request(readItems('cart', {
            filter: {
                user_id: {
                    _eq: userId
                }
            }
        }));
        console.log(cartItems, "cartItems")

        cartItems.forEach((item) => {
            listOfProductId.push(item.product_id);
        })

        const productDetails = await directus.request(readItems('products', {
            filter: {
                id: {
                    _in: listOfProductId
                }
            }
        }))
        console.log(productDetails, "productDetails")
        // Calculate total amount from cart items
        const totalAmount: number = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        const newOrder = {
            user_id: userId,
            total_amount: totalAmount,
            status: "order_placed",
            order_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
        const order = await directus.request(createItem('orders', newOrder));
        console.log("Order: ", order);
        let orderId: number = order.id;

        const orderItemsList: OrderItem[] = []

        for (const item of cartItems) {
            const orderItemData: OrderItem = {
                order_id: orderId,
                product_id: item.product_id,
                product_name: productDetails.find((product) => product.id === item.product_id)?.name as string,
                quantity: item.quantity,
                price_per_unit: item.price,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            orderItemsList.push(orderItemData)
        }
        let orderPlaced = await directus.request(createItems('order_items', orderItemsList));
        console.log("Order Placed: ", orderPlaced);

        // await emptyCart(userId);

        return responseHelper({ message: 'Order placed successfully', statusCode: 200, data: order }, 200);

    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 400, data: {} }, 500);
    }
}

export async function PATCH(req: Request) {
    try {
        const { userId, status } = await req.json();
        const allPossibleStatus = ["cancelled", "out_for_delivery", "delivered"]; // "order_placed" is by deafult when order is placed
        const notAllowedOnOrderPlaced = ["cancelled", "out_for_delivery", "delivered"];
        const notAllowedOnCancelled = ["cancelled", "out_for_delivery"];
        const notAllowedOnOutForDelivery = ["cancelled"];
        const notAllowedOnDelivered = ["cancelled"];

        if (!userId || !status || allPossibleStatus.includes(status) === false) {
            return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);
        }
        // check orders table has that user's order
        const orders = await directus.request(readItems('orders', {
            filter: {
                user_id: {
                    _eq: userId
                }
            }
        }))
        if (orders.length === 0) {
            return responseHelper({ message: 'No order found', statusCode: 400, data: {} }, 400);
        }
        /*
        If order status is 'order_placed' then it can be updated to 'cancelled', out_for_delivery', 'delivered', 'cancelled'
        If order status is 'cancelled' then it can be updated to 'cancelled', out_for_delivery', 'delivered'
        If order status is 'out_for_delivery' then it can be updated to 'cancelled' : respone : Order out for delivery can't be cancelled
        If order status is 'delivered' then it can be updated to 'cancelled'
        */


        if (notAllowedOnOrderPlaced.includes(status) && orders[0].status !== "order_placed") {
            return responseHelper({ message: 'Order already placed', statusCode: 400, data: {} }, 400);
        }

        if (notAllowedOnCancelled.includes(status) && orders[0].status === "cancelled") {
            return responseHelper({ message: 'Order out for delivery can\'t be cancelled', statusCode: 400, data: {} }, 400);
        }

        if (notAllowedOnOutForDelivery.includes(status) && orders[0].status === "out_for_delivery") {
            return responseHelper({ message: 'Order already out for delivery', statusCode: 400, data: {} }, 400);
        }

        if (notAllowedOnOutForDelivery.includes(status) && orders[0].status === "delivered") {
            return responseHelper({ message: 'Order already delivered', statusCode: 400, data: {} }, 400);
        }


        let response = await directus.request(updateItem('orders', userId, { status }));
        if(response) {
            return responseHelper({ message: 'Order status updated successfully', statusCode: 200, data: {} }, 200);
        }
        return responseHelper({ message: 'Order status updated failed', statusCode: 400, data: {} }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Order Patch: Internal server error', statusCode: 500, data: {} }, 500);
    }
}



async function emptyCart(cartId: string) {
    let result = await directus.request(deleteItem('cart_items', cartId));
    return result;
}

interface OrderItem {
    order_id: number,
    product_id: number,
    product_name: string,
    quantity: number,
    price_per_unit: number,
    created_at: string,
    updated_at: string
}