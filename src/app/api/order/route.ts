import { NextApiRequest, NextApiResponse } from 'next';
import { responseHelper } from '@/lib/helpers';
import { directus } from '@/lib/utils';
import { createItem, deleteItem, readItems, updateItem } from '@directus/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId, cartId, status } = await req.body;

        // If userId, cartId, and status are provided and method is POST, place the order
        if (userId && cartId && status && req.method === 'POST') {
            // Fetch items from the cart
            const cartItems = await directus.request(readItems('cart_items', {
                filter: {
                    cart_id: {
                        _eq: cartId
                    }
                }
            }));

            // Calculate total amount from cart items
            const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

            // Create a new order
            const orderData = {
                user_id: userId,
                cart_id: cartId,
                order_date: new Date().toISOString(),
                total_amount: totalAmount,
                status: status,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            const order = await directus.request(createItem('orders', orderData));

            // Create order items from cart items
            for (const item of cartItems) {
                const orderItemData = {
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                };
                await directus.request(createItem('order_items', orderItemData));
            }

            // Empty the cart (call a separate function to handle this)
            await emptyCart(cartId);

            return responseHelper({ message: 'Order placed successfully', statusCode: 200, data: order }, 200);
        } 
        // If userId and orderId are provided and method is PATCH, cancel the order
        else if (userId && req.method === 'PATCH') {
            // Update the status of the order to 'cancelled'
            await directus.request(updateItem('orders', userId, { status: 'cancelled' }));
            return responseHelper({ message: 'Order cancelled successfully', statusCode: 200, data: {} }, 200);
        } 
        // If userId is provided and method is GET, fetch all orders for the user
        else if (userId && req.method === 'GET') {
            // Fetch all orders for the user
            const orders = await directus.request(readItems('orders', {
                filter: {
                    user_id: {
                        _eq: userId
                    }
                }
            }));
            return responseHelper({ message: 'Orders fetched successfully', statusCode: 200, data: orders }, 200);
        } 
        // Invalid request
        else {
            return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);
        }
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}

async function emptyCart(cartId: string) {
    // Code to empty the cart (delete all items associated with the cartId)
    await directus.request(deleteItem('cart_items', cartId ));
}
