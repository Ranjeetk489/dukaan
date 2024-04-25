import OrderCart from "@/components/block/page/cart/cart";
import { getCartData } from "@/lib/prisma";
import { CartItemQuantity } from "@/types/client/types";
import { Cart, CartItem } from "@/types/server/types";
import React from "react";
import { IoMdClose } from "react-icons/io";

export function formatCartData(apiData: CartItem[]): Cart {
    const formattedCart: Cart = {};
    
    apiData.forEach((item) => {
        const {
        product_id,
        name,
        description,
        category_id,
        created_at,
        updated_at,
        image,
        quantity_id,
        quantity,
        price,
        is_stock_available,
        stock_quantity,
        cart_quantity,
      } = item;
  
      if (!formattedCart[product_id]) {
        formattedCart[product_id] = {
          id: product_id,
          name,
          description,
          category_id,
          created_at,
          updated_at,
          image,
          quantity_id,
          quantities: [],
        };
      }
  
      const cartItemQuantity: CartItemQuantity = {
        id: quantity_id,
        product_id,
        quantity,
        price,
        is_stock_available,
        count: cart_quantity,
        stock_quantity: stock_quantity,
        created_at,
        updated_at: updated_at || '',
        added_quantity: cart_quantity,
      };
      
  
      formattedCart[product_id].quantities.push(cartItemQuantity);
    });
    return formattedCart;
  }
  
type Props = {};
export default async function Page({}: Props) {
    const data = await getCartData()
    // const cart = formatCartData(data)

    console.log(data, "cartData1234")
    const cartIds: Array<number> = data.map((item) => item.cart_id);
    const set = new Set(cartIds)
    
    return (
        <div className="m-auto grid grid-cols-1">
            <div className="col-span-1 py-4 border-b border-slate-200 shadow-sm">
                <div className="flex justify-between items-center container">
                    <p className="font-semibold">My Cart</p>
                    <IoMdClose className="w-4 h-4" />
                </div>
            </div>
            <div className="container">
                <div className="col-span-1 mt-2 px-2 py-3 rounded-lg bg-blue-200 text-blue-600">
                    Store is open
                </div>
                <div className="col-span-1">
                    <OrderCart cartData={data}/>
                </div>
            </div>
        </div>
  );
}
