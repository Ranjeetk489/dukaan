import { responseHelper } from '@/lib/helpers';
import { isAuthenticatedAndUserData } from '@/lib/auth';
import prisma from '@/lib/prisma/client';


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
