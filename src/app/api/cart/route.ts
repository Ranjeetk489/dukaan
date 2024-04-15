import { NextApiRequest, NextApiResponse } from 'next';
import { responseHelper } from '@/lib/helpers';
import { directus } from '@/lib/utils';
import { readItems, updateItem, deleteItem, createItem} from '@directus/sdk';
import { ResponseObject } from "@/types/client/types";


export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userid");
    // const userId= 1;
    console.log("userId", userId)
    if (userId) {
      const cartItems = await directus.request(
        //@ts-ignore
        readItems("cart", {
          filter: {
            user_id: {
              _eq: userId,
            },
          },
        }),
      );
      return responseHelper(
        {
          message: "Cart items fetched successfully",
          statusCode: 200,
          data: cartItems,
        },
        200,
      );
    }
    return responseHelper(
      { message: "User not found", statusCode: 400, data: {} },
      200,
    );
  } catch (error) {
    console.log(error)
    return responseHelper({ message: "Internal Server Error", statusCode: 200, data: {} }, 200);
  }
}

export async function POST(req: Request) {
  try {
    const { userId, productId, quantity } = await req.json();
  if (!userId || quantity === undefined) {
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
        { message: "Internal Server Error", statusCode: 500, data: {} },
        500,
      );
  }
}