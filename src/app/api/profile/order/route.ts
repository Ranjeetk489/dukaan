import { isAuthenticatedAndUserData } from "@/lib/auth";
import { responseHelper } from "@/lib/helpers";
import prisma from "@/lib/prisma/client";

export async function GET(req: Request) {
    try {
        const auth = await isAuthenticatedAndUserData();
        const userId = auth.user?.id;

        // Join order and order_items tables and order items will come as array of objects in orders column
        const getAllOrdersByUserId = await prisma.orders.findMany({
            where: {
                user_id: userId
            },
            include: {
                order_items: true
            }
        })

        if (!getAllOrdersByUserId) {
            return responseHelper({ message: 'Orders not found', statusCode: 404, data: {} }, 404);
        }

        return responseHelper({ message: 'Orders fetched successfully', statusCode: 200, data: getAllOrdersByUserId }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}