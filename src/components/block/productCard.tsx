"use client";
import Image from "next/image";
import { useState } from "react";
import { Card } from "../ui/card";
import config from "@/config";
import { Button } from "../ui/button";
import { Product } from "@/types/client/types";
import { useProductStore } from "@/store/useProductStore";


const ProductCard = ({ product }: { product: Product }) => {
    
    return (
        <Card className="flex flex-col items-center p-4 gap-4 justify-between min-w-[200px]">
            <div className="basis-1/2">
                {product.image ? (
                    <div className="w-[170px] h-[150px] relative">
                        <Image
                            src={`${config.directusFileDomain}/${product.image}`}
                            alt={product.name}
                            layout="fill"
                        />
                    </div>
                ) : (
                    false
                )}
            </div>
            <div className="basis-1/2 w-full flex flex-col justify-between">
                <h3 className="text-xs font-semibold">{product.name}</h3>
                <div className="flex justify-between items-center w-full">
                    <p className="text-xs font-semibold">₹{product.price}</p>
                    <AddSubtract product={product} />
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;

const AddSubtract = ({product}: {product: Product}) => {
    const {addToCart , removeOneItemFromCart, cart} = useProductStore()
    const itemCountInCart = cart.filter(item => item.id === product.id).length
    return (
        <div className="flex items-center">
            {itemCountInCart ? (
                <Button
                    variant={"outline"}
                    className="text-primary w-[66px] bg-[#318616] hover:bg-[#318616] hover:text-white flex gap-2 text-white font-medium items-center">
                    <p onClick={() => removeOneItemFromCart(product.id)}>-</p>
                    <p className="min-w-4">{itemCountInCart}</p>
                    <p onClick={() => addToCart(product)}>+</p>
                </Button>
            ) : (
                <Button onClick={() => addToCart(product)} variant={"outline"} className="bg-[#f7fff9] w-[66px] hover:bg-[#f7fff9] hover:text-[#318616] text-[#318616] border px-6 border-[#318616]">Add</Button>
            )}
        </div>
    );
};
