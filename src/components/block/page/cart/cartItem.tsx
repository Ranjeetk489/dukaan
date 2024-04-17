"use client";
import config from "@/config";
import { CartItem } from "@/types/client/types";
import Image from "next/image";
import React from "react";
import AddSubtract from "../../common/addSubtract";
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
        updateProductQuantityLocal(props.item.product, count);
        debounceFn(
            () => updateProductQuantityInCart(props.item.product, count),
            500,
        );
    };

    const onCountUpdate = (action: "increment" | "decrement") => {
        switch (action) {
            case "increment":
                updateProductOptimistic(props.item.quantity + 1);
                break;
            case "decrement":
                updateProductOptimistic(props.item.quantity - 1);
                break;
        }
    };

    return (
        <div>
            <div
                key={props.item.product.id}
                className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Image
                        src={`${config.directusFileDomain}/${props.item.product.image}`}
                        alt={props.item.product.name}
                        width={100}
                        height={100}
                        className="border border-slate-500 rounded-md"
                    />
                    <div className="flex flex-col gap-1">
                        <p className="text-slate-800">{props.item.product.name}</p>
                        <p className="text-slate-600">
                            {props.item.product.stock_quantity}
                        </p>
                        <p className="font-medium text-slate-900">
                            ₹{props.item.product.price}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <AddSubtract
                        count={props.item.quantity}
                        onCountUpdate={onCountUpdate}
                    />
                </div>
            </div>
        </div>
    );
};

export default CartProduct;
