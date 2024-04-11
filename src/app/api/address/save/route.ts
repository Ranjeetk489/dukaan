import { responseHelper} from '@/lib/helpers';
import { directus } from '@/lib/utils';
import { readItems, updateItem, createItem } from '@directus/sdk';


export default async function POST(req: Request) {
    try {
        const { id, address } = await req.json();
        // Implement your save address logic here
        if(id){
            address.updated_at = new Date().toISOString();
            
            await directus.request(updateItem('addresses', id, {
                address
            }));
        }
        else{
            address.updated_at = new Date().toISOString();
            address.created_at = new Date().toISOString();
            await directus.request(createItem('addresses', {
                address
            }));
        }
        // Return success response
        // return responseHelper({ message: 'Address saved successfully', statusCode: 200 }, res);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 400 , data:{}}, 500);
    }
}
