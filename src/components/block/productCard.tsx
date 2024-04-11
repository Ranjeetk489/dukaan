"use client";
import Image from "next/image";
import { useState } from "react";
import { Card } from "../ui/card";
import config from "@/config";
import { Button } from "../ui/button";
import { Product } from "@/types/client/types";


const ProductCard = ({ product }: { product: Product }) => {
    console.log(product, "product")
    const [quantity, setQuantity] = useState(1);
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
                    <AddSubtract quantity={quantity} setQuantity={setQuantity} />
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;

const AddSubtract = ({
    quantity,
    setQuantity,
}: {
    quantity: number;
    setQuantity: (quantity: number) => void;
}) => {
    return (
        <div className="flex items-center">
            {quantity ? (
                // 1px solid rgb(49, 134, 22)
                <Button
                    variant={"outline"}
                    className="text-primary w-[66px] bg-[#318616] hover:bg-[#318616] hover:text-white flex gap-2 text-white font-medium items-center">
                    <p onClick={() => setQuantity(quantity - 1)}>-</p>
                    <p className="min-w-4">{quantity}</p>
                    <p onClick={() => setQuantity(quantity + 1)}>+</p>
                </Button>
            ) : (
                <Button onClick={() => setQuantity(quantity + 1)} variant={"outline"} className="bg-[#f7fff9] w-[66px] hover:bg-[#f7fff9] hover:text-[#318616] text-[#318616] border px-6 border-[#318616]">Add</Button>
            )}
        </div>
    );
};
