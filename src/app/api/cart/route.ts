import { responseHelper } from '@/lib/helpers';
import { directus } from '@/lib/utils';
import { readItems, updateItem, deleteItem, createItem} from '@directus/sdk';
import { isAuthenticatedAndUserData } from '@/lib/auth';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const headers = req.headers.values()
    const authData = await isAuthenticatedAndUserData()
    if(!authData.isAuthenticated) {
        const baseUrl = new URL(req.url).origin
        return NextResponse.redirect(new URL("/auth/login", baseUrl));
    }
    const user_id = authData.user?.id
    const result = await directus.request(
      // @ts-expect-error
      readItems('cart', {
        fields: ['quantity', 'product_id.*'],
        filter: {
          user_id: {
            _eq: user_id,
          }
        }
      })
    );

    return responseHelper(
      {
        message: "Cart items fetched successfully",
        statusCode: 200,
        data: result,
      },
      200,
    );

  } catch (error) {
    console.log(error)
    return responseHelper({ message: "Internal Server Error", statusCode: 200, data: {} }, 200);
  }
}

export async function POST(req: Request) {
  try {
    const { productId, quantity } = await req.json();
    const authData = await isAuthenticatedAndUserData()
    const userId = authData?.user?.id
  
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
  const result = await directus.request(
    //@ts-ignore
    readItems("cart", {
      filter: {
        user_id: {
          _eq: userId,
        },
        product_id: {
            _eq: productId
        }
      },
    }),
  );
  
  let cartId:number = result[0] ? result[0].id : null;

  let apimessage = ''
  if (quantity === 0 && cartId) {
    // If quantity is 0, remove the item from the cart
    await directus.request(deleteItem("cart", cartId));
    apimessage = 'Product count updated'
  } 
  else 
  if(cartId && quantity){
    // Update quantity for the item in the cart
    await directus.request(
      updateItem("cart", cartId, { quantity: quantity }),
    );
    apimessage = 'Product count updated'
  }
  else 
  if(productId && userId){
    await directus.request(createItem("cart", {
        user_id: userId,
        product_id: productId,
        quantity: quantity || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }))
    apimessage = 'New product added to cart'

  }
  if(apimessage = '') {
    return responseHelper(
        { message: "Faied to update cart", statusCode: 400, data: {} },
        200,
      );
  }

  return responseHelper(
    { message: apimessage, statusCode: 200, data: {} },
    200,
  );
  } catch (error) {
    console.log(error)
    return responseHelper(
        { message: "CART::POST Internal Server Error", statusCode: 500, data: {} },
        500,
      );
  }
}
