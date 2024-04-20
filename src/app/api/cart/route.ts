import { responseHelper } from '@/lib/helpers';
import { isAuthenticatedAndUserData } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const authData = await isAuthenticatedAndUserData();
     // if(!authData.isAuthenticated) {
    //     const baseUrl = new URL(req.url).origin
    //     return NextResponse.redirect(new URL("/auth/login", baseUrl));
    // }
    // const user_id = authData.user?.id
    let user_id = 5; // Sample user_id, replace it with actual user_id logic
    
    const cartItems:any = await prisma.$queryRaw`
      SELECT * FROM cart
      join products on cart.product_id = products.id
      join quantity on cart.quantity_id = quantity.id
      WHERE user_id = ${user_id}
    `;

    return responseHelper(
      {
        message: "Cart items fetched successfully",
        statusCode: 200,
        data: cartItems,
      },
      200,
    );

  } catch (error) {
    console.log(error);
    return responseHelper({ message: "Internal Server Error", statusCode: 500, data: {} }, 500);
  }
}

export async function POST(req: Request) {
  try {
    const { productId, quantityId, quantity } = await req.json();
    const authData = await isAuthenticatedAndUserData();
    const userId = authData?.user?.id;
  
    if (quantity === undefined) {
      return responseHelper(
        {
          message: "Please provide Product id and Quantity id",
          statusCode: 400,
          data: {},
        },
        200,
      );
    }
    
    let cartItem = await prisma.cart.findFirst({
      where: {
        user_id: userId,
        product_id: productId,
        quantity_id: quantityId,
      },
    });

    let apimessage = '';
    if (quantity === 0 && cartItem) {
      // If quantity is 0, remove the item from the cart
      await prisma.cart.delete({
        where: {
          id: cartItem.id,
        },
      });
      apimessage = 'Product count updated';
    } else if (cartItem && quantity) {
      // Update quantity for the item in the cart
      await prisma.cart.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: quantity,
        },
      });
      apimessage = 'Product count updated';
    } else if (productId && userId) {
      // Add a new product to the cart
      await prisma.cart.create({
        data: {
          user_id: userId,
          product_id: productId,
          quantity_id: quantityId,
          quantity: quantity || 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      apimessage = 'New product added to cart';
    }

    if (apimessage === '') {
      return responseHelper(
        { message: "Failed to update cart", statusCode: 400, data: {} },
        200,
      );
    }

    return responseHelper(
      { message: apimessage, statusCode: 200, data: {} },
      200,
    );
  } catch (error) {
    console.log(error);
    return responseHelper(
      { message: "CART::POST Internal Server Error", statusCode: 500, data: {} },
      500,
    );
  }
}
