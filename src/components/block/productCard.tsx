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
        <Card className="relative flex flex-col border-none shadow-none bg-none items-center p-0 md:p-4 gap-4 justify-between min-w-[130px] min-h-[220px] md:min-w-[200px] md:min-h-[220px]">
            <div className="basis-1/2  w-fit shadow-sm md:shadow-none border">
                {product.image ? (
                    <div className="relative min-w-[120px] min-h-[120px] md:min-w-[170px] md:min-h-[150px]">
                        <Image
                            src={`${config.directusFileDomain}/${product.image}`}
                            alt={product.name}
                            layout={"fill"}
                            className=""
                            // width={180}
                            // height={250}
                        />
                    </div>
                ) : (
                    false
                )}
            </div>
            <div className="basis-1/2 w-full flex flex-col justify-between">
                <h3 className="text-xs font-semibold line-clamp-2 md:line-clamp-3">{product.name}</h3>
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
