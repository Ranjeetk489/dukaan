import OrderCart from "@/components/block/page/cart/cart";
import CartItems from "@/components/block/page/cart/cartItems";
import { getCartItems } from "@/lib/directus/methods";
import prisma from "@/lib/prisma/client";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import { IoMdClose } from "react-icons/io";

type Props = {};
export default async function Page({}: Props) {
//   const cartData = await getCartItems();
//   console.log(cartData, "cartData")
    const data = await prisma.$queryRaw`SELECT * FROM cart`
    console.log(data, "data")


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
                {/* <div className="col-span-1">
                    <OrderCart cartData={cartData}/>
                </div> */}
            </div>
        </div>
  );
}
