"use client";
import Image from "next/image";
import { useState } from "react";
import { Card } from "../ui/card";
import config from "@/config";
import { Button } from "../ui/button";
import { Product } from "@/types/client/types";
import { useProductStore } from "@/store/useProductStore";


const ProductCard = ({ product }: { product: Product }) => {
    
    if (!product) {
        throw new Error('ProductCard received a falsy product value');
    }

    return (
        <Card className="relative flex flex-col border-none shadow-none bg-none  justify-between p-0 gap-2 md:p-4 items-stretch max-h-[280px]">
            <div className="w-fit shadow-sm md:shadow-none border">
                {product.image ? (
                    <div className="relative flex items-center justify-center h-full min-w-[120px] min-h-[120px] md:min-w-[170px] md:min-h-[150px]">
                        <Image
                            src={`${config.directusFileDomain}/${product.image}`}
                            alt={product.name}
                            style={{
                                objectFit: "cover",
                            }}
                            className="h-full"
                            width={180}
                            height={250}
                        />
                    </div>
                ) : (
                    <div>Product {product.name} has no image</div>
                )}
            </div>
            <div className=" w-full flex flex-col h-full justify-between">
                <h3 className="text-xs font-semibold line-clamp-2 md:line-clamp-3">{product.name}</h3>
                <div className="flex justify-between items-center w-full mt-1">
                    <p className="text-xs font-semibold">₹{product.price || 0}</p>
                    <AddSubtract product={product} />
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;

const AddSubtract = ({product}: {product: Product}) => {
    const {addToCart , removeOneItemFromCart, cart} = useProductStore()
    const itemCountInCart = cart.data.filter(item => item.id === product.id).length
    return (
        <div className="flex items-center">
            {itemCountInCart ? (
                <Button
                    variant={"outline"}
                    className="text-primary py-1 md:py-2 px-2  w-[60px] md:w-[72px] md:px-3 uppercase  bg-[#318616] hover:bg-[#318616] hover:text-white flex gap-2 text-white font-medium items-center">
                    <p onClick={() => removeOneItemFromCart(product.id)}>-</p>
                    <p className="min-w-4">{itemCountInCart}</p>
                    <p onClick={() => addToCart(product)}>+</p>
                </Button>
            ) : (
                <Button onClick={() => addToCart(product)} variant={"outline"} className="bg-[#f7fff9] uppercase w-[60px] md:w-[72px] text-xs px-4 py-1 md:py-2 hover:bg-[#f7fff9] hover:text-[#318616] text-[#318616] border border-[#318616]">Add</Button>
            )}
        </div>
    );
};
