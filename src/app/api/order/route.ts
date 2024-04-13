import { responseHelper } from '@/lib/helpers';
import { directus } from '@/lib/utils';
import { createItem, createItems, deleteItem, deleteItems, readItems, updateItem } from '@directus/sdk';
import config from '../../../config';


export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const userId = url.searchParams.get("userid");
        
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
        const totalAmount: number = cartItems.reduce((total, item) =>
            total + (Number(productDetails.find((product) =>
                product.id === item.product_id)?.price) * Number(item.quantity)), 0);

        const newOrder = {
            user_id: userId,
            total_amount: totalAmount,
            status: config.order_status.ORDER_PLACED,
            order_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
        const order = await directus.request(createItem('orders', newOrder));
        let orderId: number = order.id;

        const orderItemsList: OrderItem[] = []

        for (const item of cartItems) {
            const orderItemData: OrderItem = {
                order_id: orderId,
                product_id: item.product_id,
                product_name: productDetails.find((product) => product.id === item.product_id)?.name as string,
                quantity: item.quantity,
                price_per_unit: Number(productDetails.find((product) => product.id === item.product_id)?.price) as number,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            orderItemsList.push(orderItemData)
        }
        let orderPlaced = await directus.request(createItems('order_items', orderItemsList));

        // let response = await emptyCart(userId);
        // console.log(response, "response")

        return responseHelper({ message: 'Order placed successfully', statusCode: 200, data: order }, 200);

    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 400, data: {} }, 500);
    }
}

async function emptyCart(user_id: string) {
    let result = await directus.request(deleteItems('cart_items', {
        filter: {
            user_id: {
                _eq: user_id
            }
        }
    }));
    return result;
}


export async function PATCH(req: Request) {
    try {
        const { orderId, userId, status } = await req.json();
        let order_placed = config.order_status.ORDER_PLACED;
        let cancelled = config.order_status.CANCELLED;
        let out_for_delivery = config.order_status.OUT_FOR_DELIVERY;
        let delivered = config.order_status.DELIVERED;

        const allPossibleStatus = [cancelled, out_for_delivery, delivered]; // "order_placed" is by deafult when order is placed
        const notAllowedOnCancelled = [out_for_delivery, delivered, cancelled];
        const notAllowedOnOutForDelivery = [cancelled, out_for_delivery];
        const notAllowedOnDelivered = [cancelled, delivered];
        console.log(allPossibleStatus, allPossibleStatus.includes(status), status)
        if (!userId || !status || allPossibleStatus.includes(status) === false) {
            return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);
        }
        // check orders table has that user's order
        const orders = await directus.request(readItems('orders', {
            filter: {
                user_id: {
                    _eq: userId
                },
                id: {
                    _eq: orderId
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
      
       
        const currentStatus = orders[0].status;
        
        if (currentStatus === cancelled && notAllowedOnCancelled.includes(status)) {
            return responseHelper({ message: 'Order is cancelled', statusCode: 400, data: {} }, 400);
        }

        if (currentStatus === out_for_delivery && notAllowedOnOutForDelivery.includes(status)) {
            return responseHelper({ message: 'Order already out for delivery', statusCode: 400, data: {} }, 400);
        }

        if (currentStatus === delivered && notAllowedOnDelivered.includes(status)) {
            return responseHelper({ message: 'Order already delivered', statusCode: 400, data: {} }, 400);
        }

        let response = await directus.request(updateItem('orders', orderId, { status }));
        if(response) {
            return responseHelper({ message: 'Order status updated successfully', statusCode: 200, data: {} }, 200);
        }
        return responseHelper({ message: 'Order status updated failed', statusCode: 400, data: {} }, 200);
    
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Order Patch: Internal server error', statusCode: 500, data: {} }, 500);
    }
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