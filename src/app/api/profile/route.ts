import { NextApiRequest, NextApiResponse } from 'next';
import { responseHelper } from '@/lib/helpers';
import { directus } from '@/lib/utils';
import { readItems } from '@directus/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId, isPersonal, orderHistory, isAddress, storeInfo } = await req.body;

        if (!userId || req.method !== 'GET') {
            return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);
        }

        let responseData: any = {};

        if (isPersonal) {
            // Fetch user details
            const userDetails = await directus.request(readItems('users', {
                filter: {
                    id: {
                        _eq: userId
                    }
                },
                limit: 1
            }));
            responseData.userDetails = userDetails[0];

            if (orderHistory) {
                // Fetch orders for the user
                const userOrders = await directus.request(readItems('orders', {
                    filter: {
                        user_id: {
                            _eq: userId
                        }
                    }
                }));
                responseData.userOrders = userOrders;
            }

            if (isAddress) {
                // Fetch addresses for the user
                const userAddresses = await directus.request(readItems('addresses', {
                    filter: {
                        user_id: {
                            _eq: userId
                        }
                    }
                }));
                responseData.userAddresses = userAddresses;
            }

            if (storeInfo) {
                // Fetch store information from config file (you may need to adjust this part based on how your config is structured)
                responseData.storeInfo = {
                    storeName: process.env.STORE_NAME,
                    storeAddress: process.env.STORE_ADDRESS,
                    storeContact: process.env.STORE_CONTACT
                };
            }
        }

        return responseHelper({
            message: 'User profile details fetched successfully',
            statusCode: 200,
            data: responseData
        }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}
