import { responseHelper } from '@/lib/helpers';
import { isAuthenticatedAndUserData } from '@/lib/auth';
import prisma from '@/lib/prisma/client';
import config from '@/config';
import { directus } from '@/lib/utils';
import { createItems } from '@directus/sdk';

// TODO Get detail of order by order id
export async function GET(req: Request) {
    try {
        const auth = await isAuthenticatedAndUserData();
        const userId = 5;//auth.user?.id;

        if (!userId) {
            return responseHelper({ message: 'User not authenticated', statusCode: 401, data: {} }, 401);
        }

        const orders = await prisma.orders.findMany({
            where: {
                user_id: userId,
            },
        });

        return responseHelper({ message: 'Orders fetched successfully', statusCode: 200, data: orders }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}

export async function POST(req: Request) {
    try {
        
        const auth = await isAuthenticatedAndUserData();
        const userId = auth.user?.id;

        if (!userId) {
            return responseHelper({ message: 'User not authenticated', statusCode: 401, data: {} }, 401);
        }


        const detailedOrder: any[] = await prisma.$queryRaw`
        select c.user_id, c.product_id, c.cart_quantity, c.quantity_id as "cart_to_quantiy_ref",
        q.price as "price_per_unit", q.quantity as "product_quantity", q.price * c.cart_quantity as "amount",
        p.name as "product_name", p.description, 
        c.created_at, c.updated_at
        from cart as c
        join quantity as q on c.quantity_id = q.id
        join products as p on c.product_id = p.id
        where c.user_id = ${userId}
        `

        const totalAmount = detailedOrder.reduce((acc, curr) => acc + Number(curr.amount), 0);

        const newOrder = {
            user_id: userId,
            total_amount: totalAmount,
            status: config.order_status.ORDER_PLACED,
            order_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        const newOrderCreated = await prisma.orders.create({ data: newOrder });

        const orderItems = detailedOrder.map((item) => {
            return {
                order_id: newOrderCreated.id,
                product_id: item.product_id,
                product_name: item.product_name,
                product_quantity: item.product_quantity,
                quantity: item.cart_quantity,
                price_per_unit: item.price_per_unit,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
        })

        const orderItemsCreated = await directus.request(createItems('order_items', orderItems));

        await prisma.cart.deleteMany({ where: { user_id: userId } });

        return responseHelper({ message: 'Order placed successfully', statusCode: 200, data: orderItemsCreated }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}

export async function PATCH(req: Request) {
    try {
        const { orderId, userId, status } = await req.json();

        if (!userId || !status) {
            return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);
        }

        const order = await prisma.orders.findFirst({
            where: {
                user_id: userId,
                id: orderId,
            },
        });

        if (!order) {
            return responseHelper({ message: 'No order found', statusCode: 400, data: {} }, 400);
        }

        const currentStatus = order.status;
        const notAllowedOnCancelled = [config.order_status.OUT_FOR_DELIVERY, config.order_status.DELIVERED];
        const notAllowedOnOutForDelivery = [config.order_status.CANCELLED];
        const notAllowedOnDelivered = [config.order_status.CANCELLED, config.order_status.OUT_FOR_DELIVERY];

        if (currentStatus === config.order_status.CANCELLED && notAllowedOnCancelled.includes(status)) {
            return responseHelper({ message: 'Order is cancelled', statusCode: 400, data: {} }, 400);
        }

        if (currentStatus === config.order_status.OUT_FOR_DELIVERY && notAllowedOnOutForDelivery.includes(status)) {
            return responseHelper({ message: 'Order already out for delivery', statusCode: 400, data: {} }, 400);
        }

        if (currentStatus === config.order_status.DELIVERED && notAllowedOnDelivered.includes(status)) {
            return responseHelper({ message: 'Order already delivered', statusCode: 400, data: {} }, 400);
        }

        const response = await prisma.orders.update({
            where: {
                id: orderId,
            },
            data: {
                status: status,
            },
        });

        if (response) {
            return responseHelper({ message: 'Order status updated successfully', statusCode: 200, data: {} }, 200);
        }

        return responseHelper({ message: 'Order status update failed', statusCode: 400, data: {} }, 400);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Order Patch: Internal server error', statusCode: 500, data: {} }, 500);
    }
}

interface OrderItem {
    order_id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price_per_unit: number;
    created_at: string;
    updated_at: string;
}
