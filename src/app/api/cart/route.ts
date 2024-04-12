import { NextApiRequest, NextApiResponse } from 'next';
import { responseHelper } from '@/lib/helpers';
import { directus } from '@/lib/utils';
import { readItems, updateItem, deleteItem } from '@directus/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { cartId, items } = await req.body;

        // If cartId is provided and method is GET, fetch all items in the cart
        if (cartId && req.method === 'GET') {
            const cartItems = await directus.request(readItems('cart_items', {
                filter: {
                    cart_id: {
                        _eq: cartId
                    }
                }
            }));
            return responseHelper({ message: 'Cart items fetched successfully', statusCode: 200, data: cartItems }, 200);
        } 
        // If cartId and items are provided and method is POST, update the items in the cart
        else if (cartId && items && req.method === 'POST') {
            // Update quantities for existing items in the cart
            for (const item of items) {
                if (item.quantity === 0) {
                    // If quantity is 0, remove the item from the cart
                    await directus.request(deleteItem('cart_items', item.id));
                } else {
                    // Update quantity for the item in the cart
                    await directus.request(updateItem('cart_items', item.id, { quantity: item.quantity }));
                }
            }
            return responseHelper({ message: 'Cart updated successfully', statusCode: 200, data: {} }, 200);
        } 
        // If cartId is provided and method is DELETE, empty the cart
        else if (cartId && req.method === 'DELETE') {
            // Delete all items from the cart
            await directus.request(deleteItem('cart_items', cartId ));
            return responseHelper({ message: 'Cart emptied successfully', statusCode: 200, data: {} }, 200);
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
