import { NextApiRequest, NextApiResponse } from 'next';
import { responseHelper } from '@/lib/helpers';
import { directus } from '@/lib/utils';
import { readItems, updateItem, createItem, deleteItem } from '@directus/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id, address } = await req.body;
        
        // If ID is provided and method is GET, fetch the address
        if (id && req.method === 'GET') {
            //@ts-ignore
            const addressItem = await directus.request(readItems('addresses', {
                filter: {
                    id: {
                        _eq: id
                    }
                },
                limit: 1
            }));
            if (addressItem.length === 0) {
                return responseHelper({ message: 'Address not found', statusCode: 404, data: {} }, 404);
            }
            return responseHelper({ message: 'Address fetched successfully', statusCode: 200, data: addressItem[0] }, 200);
        } 
        // If ID is provided and method is DELETE, delete the address
        else if (id && req.method === 'DELETE') {
            await directus.request(deleteItem('addresses', id));
            return responseHelper({ message: 'Address deleted successfully', statusCode: 200, data: {} }, 200);
        } 
        // If ID is provided, update the address
        else if (id) {
            address.updated_at = new Date().toISOString();
            await directus.request(updateItem('addresses', id, { address }));
        } 
        // If ID is not provided, create a new address
        else {
            address.updated_at = new Date().toISOString();
            address.created_at = new Date().toISOString();
            await directus.request(createItem('addresses', { address }));
        }
        
        // Return success response for update or creation
        return responseHelper({ message: 'Address saved successfully', statusCode: 200, data: {} }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}
