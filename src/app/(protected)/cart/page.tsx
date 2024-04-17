import CartItems from "@/components/block/page/cart/cartItems";
import { fetchInsideTryCatch } from "@/lib/client/apiUtil";
import { CartItem } from "@/types/client/types";
import React from "react";
import { IoMdClose } from "react-icons/io";

type Props = {

};

export  default async function Page({}: Props) {
    const data = await fetchInsideTryCatch<CartItem[]>('api/cart', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: "no-store"
    })
    const cartData = (data && data.response.data) ? data.response.data : []
    
    console.log(cartData, "data12345")

    return (
        <div className="m-auto grid grid-cols-1">
            <div className="flex justify-between items-center col-span-1">
                <p>My Cart</p>
                <IoMdClose className="w-4 h-4" />
            </div>
            <div className="col-span-1 mt-2 px-2 py-3 rounded-lg bg-blue-200 text-blue-600">
                Store is open
            </div>
            {/* <div className="col-span-1">
                <CartItems cartData={cartData} />
            </div> */}
        </div>
    )
}
