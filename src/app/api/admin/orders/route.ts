import { responseHelper } from '@/lib/helpers';
import { isAuthenticatedAndUserData } from '@/lib/auth';
import prisma from '@/lib/prisma/client';
import config from '@/config';
import { Order } from '@/types/server/types';


export async function GET(req: Request) {
    try {


        const orders:any = await prisma.$queryRaw`
        SELECT
        o.id,
        o.user_id,
        TO_CHAR(o.order_date, 'DDth Mon YYYY') AS order_date,
        o.total_amount,
        o.status,
        o.created_at,
        o.updated_at,
        json_agg(oi.*) as products
    FROM
        orders o
    LEFT JOIN
        order_items oi ON o.id = oi.order_id
    GROUP BY
        o.id;`;
        // console.log(orders, "orders")
        return responseHelper({ message: 'Orders fetched successfully', statusCode: 200, data: orders }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}


export async function PATCH(req: Request) {
    try {
        const { orderId, status } = await req.json();

        if (!orderId || !status) {
            return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);
        }

        const order = await prisma.orders.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return responseHelper({ message: 'Order not found', statusCode: 404, data: {} }, 404);
        }

        const currentStatus: string = order.status as string;

        const notAllowedTransitions: Record<string, string[]> = {
            [config.order_status.CANCELLED]: [config.order_status.OUT_FOR_DELIVERY, config.order_status.DELIVERED],
            [config.order_status.OUT_FOR_DELIVERY]: [config.order_status.CANCELLED],
            [config.order_status.DELIVERED]: [config.order_status.CANCELLED, config.order_status.OUT_FOR_DELIVERY],
        };

        if (notAllowedTransitions[currentStatus]?.includes(status)) {
            return responseHelper({ message: `Invalid status transition from ${currentStatus} to ${status}`, statusCode: 400, data: {} }, 400);
        }

        const updatedOrder = await prisma.orders.update({
            where: { id: orderId },
            data: { status },
        });

        return responseHelper({ message: 'Order updated successfully', statusCode: 200, data: updatedOrder }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}

