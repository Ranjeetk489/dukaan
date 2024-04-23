"use client";
import config from "@/config";
import { CartItem } from "@/types/client/types";
import Image from "next/image";
import React from "react";
import AddSubtract from "../products/addSubtract";
import { useProductStore } from "@/store/useProductStore";
import useOptimistic from "@/lib/client/hooks/useOptimistic";

type Props = {
    item: CartItem;
};
const CartProduct = (props: Props) => {
    const { updateProductQuantityInCart, updateProductQuantityLocal } =
        useProductStore();
    const { debounceFn } = useOptimistic();

    const updateProductOptimistic = (count: number) => {
        updateProductQuantityLocal(props.item, count, props.item.quantity_id);
        debounceFn(
            () => updateProductQuantityInCart(props.item.product, count),
            500,
        );
    };

    const onCountUpdate = (action: "increment" | "decrement") => {
        switch (action) {
            case "increment":
                updateProductOptimistic(props.item.cart_quantity + 1);
                break;
            case "decrement":
                updateProductOptimistic(props.item.cart_quantity - 1);
                break;
        }
    };
    console.log(props.item.price)

    return (
        <div
            className="flex items-center justify-between">
            <div className="flex">
                <Image
                    src={`${config.directusFileDomain}/${props.item.image}`}
                    alt={props.item.name}
                    width={70}
                    height={70}
                    className="border border-slate-200 rounded-md object-contain max-w-[70px] max-h-[70px]"
                />
                <div className="flex flex-col ml-2 basis-2/3">
                    <p className="text-slate-800 mb-0 text-xs line-clamp-2">{props.item.name}</p>
                    <p className="text-slate-600 text-xs">{props.item.stock_quantity}</p>
                    <p className="font-medium text-slate-900 text-xs">
                        ₹{props.item.price}
                    </p>
                </div>
            </div>
            {/* <AddSubtract count={props.item.quantity} onCountUpdate={onCountUpdate} /> */}
        </div>
    );
};

export default CartProduct;
