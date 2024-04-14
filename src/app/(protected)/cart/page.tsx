import { useProductStore } from "@/store/useProductStore";
import React from "react";

type Props = {};

export default function Page({}: Props) {
    const cart = useProductStore((state) => state.cart);
    return (
        <div className="">
            <div className="flex flex-col gap-8">
                <div className="flex overflow-x-auto gap-4 scroll no-scrollbar">
                    {cart.map((product, idx) => (
                        <div key={product.id} className="flex flex-col gap-4">
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
