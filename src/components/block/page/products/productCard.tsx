"use client";
import Image from "next/image";
import { useState } from "react";
import { Card } from "../../../ui/card";
import config from "@/config";
import { Product } from "@/types/client/types";
import { useProductStore } from "@/store/useProductStore";
import useOptimistic from "@/lib/client/hooks/useOptimistic";
import AddSubtract from "./addSubtract";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


const ProductCard = ({ product }: { product: Product }) => {
    // console.log(product, "product")
    const { cart, updateProductQuantityInCart, updateProductQuantityLocal } = useProductStore();
    const { debounceFn } = useOptimistic()
    const quantityInCart = cart.data[product.id]?.added_quantity || 0
    const productPrice = product.quantities[0].price
    const updateProductOptimistic = (count: number) => {
        updateProductQuantityLocal(product,count,  product.quantities[0].id)
        debounceFn(() => updateProductQuantityInCart(product, product.quantities[0].id, count), 500)
    }

    const onCountUpdate = (action: 'increment' | 'decrement') => {
        const quantityInCart = cart.data[product.id]?.added_quantity || 0
        switch (action) {
            case 'increment':
                updateProductOptimistic(quantityInCart + 1)
                break;
            case 'decrement':
                updateProductOptimistic(quantityInCart - 1)
                break;
        }
    }

    return (
        <Card className="relative flex flex-col border-none shadow-none bg-none  justify-between p-0 gap-2 items-center max-h-[280px] max-w-[200px]">
            <div className="w-fit shadow-sm md:shadow-none border">
                {product.image ? (
                    <div className="relative flex items-center justify-center h-full min-w-[120px] min-h-[120px] md:min-w-[170px] md:min-h-[150px]">
                        <Image
                            src={`${config.directusFileDomain}/${product.image}`}
                            alt={product.name}
                            style={{
                                objectFit: "cover",
                            }}
                            className="h-full w-full"
                            width={180}
                            height={250}
                        />
                    </div>
                ) : (
                    <div>Product {product.name} has no image</div>
                )}
            </div>
            <div className=" w-full flex flex-col h-full justify-between px-1">
                <h3 className="text-xs font-semibold line-clamp-2 md:line-clamp-3 h-[40px]">{product.name}</h3>
                <Select open={false}>
                    <SelectTrigger className="w-full text-xs h-8">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex justify-between items-center w-full mt-1">
                    <p className="text-xs font-semibold">₹{productPrice}</p>
                    <AddSubtract count={quantityInCart} onCountUpdate={onCountUpdate} />
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;

