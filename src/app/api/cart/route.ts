import { responseHelper } from '@/lib/helpers';
import { isAuthenticatedAndUserData } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/client';


export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const authData = await isAuthenticatedAndUserData();
    if (!authData || !authData.isAuthenticated) {
      const baseUrl = new URL(req.url).origin;
      return NextResponse.redirect(new URL("/auth/login", baseUrl));
    }
    const userId = authData?.user?.id;
    const result = await prisma.cart.findMany({
      where: {
        user_id: userId,
      },
      include: {
        products: true,
        quantity: true,
      },
    });

    return responseHelper({
      message: "Cart items fetched successfully",
      statusCode: 200,
      data: result,
    }, 200);
  } catch (error) {
    console.error(error);
    return responseHelper({ message: "CART::GET Internal Server Error", statusCode: 500, data: {} }, 500);
  }
}

export async function POST(req: Request) {
  try {
    const { productId, quantityId, quantity } = await req.json();
    const authData = await isAuthenticatedAndUserData();
    const userId = authData?.user?.id;
    let message = '';
    if (!userId || !productId || quantity === undefined) {
      return responseHelper({
        message: "Please provide Product id and Quantity id",
        statusCode: 400,
        data: {},
      }, 200);
    }

    const cartItem = await prisma.cart.findFirst({
      where: {
        user_id: userId,
        product_id: productId,
        quantity_id: quantityId,
      },
    });

    if (quantity === 0 && cartItem) {
      await prisma.cart.delete({
        where: {
          id: cartItem.id,
        },
      });
      const message = 'Product count updated';
    } else if (cartItem && quantity) {
      await prisma.cart.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity,
        },
      });
      message = 'Product count updated';
    } else if (productId && userId) {
      await prisma.cart.create({
        data: {
          user_id: userId,
          product_id: productId,
          quantity_id: quantityId,
          quantity: quantity || 1,
        },
      });
      message = 'New product added to cart';
    } else {
      message = 'Failed to update cart';
    }

    return responseHelper({
      message,
      statusCode: 200,
      data: {},
    }, 200);
  } catch (error) {
    console.error(error);
    return responseHelper({
      message: "CART::POST Internal Server Error",
      statusCode: 500,
      data: {},
    }, 500);
  }
}
