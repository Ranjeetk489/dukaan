"use server"
import { Cart, CartItem } from '@/types/client/types';
import { isAuthenticatedAndUserData } from '../auth';
import { directus } from '../utils';
import { readItems } from '@directus/sdk';
import { DirectusCartItem } from './types';

const getCartItems = async (): Promise<Cart> => {
    const auth = await isAuthenticatedAndUserData()
    if (auth.isAuthenticated && auth.user) {
        const userId = auth.user.id
        // @ts-expect-error
        const data: DirectusCartItem[] = await directus.request(
            // @ts-expect-error
            readItems('cart', {
                fields: ['quantity', 'product_id.*'],
                filter: {
                    user_id: {
                        _eq: userId
                    }
                }
            })
        );
        
        if(data.length) {
            const result: Cart = {}
            data.forEach((item) => {
                result[item.product_id.id] = {
                    product: item.product_id,
                    quantity: item.quantity
                }
            })
            return result
        }
    } 
    return {}
}


export { getCartItems }