"use client";
import Image from "next/image";
import { useState } from "react";
import { Card } from "../ui/card";
import config from "@/config";
import { Product } from "@/types/client/types";
import { useProductStore } from "@/store/useProductStore";
import useOptimistic from "@/lib/client/hooks/useOptimistic";
import AddSubtract from "./common/addSubtract";


const ProductCard = ({ product }: { product: Product }) => {
    const {cart, updateProductQuantityInCart, updateProductQuantityLocal} = useProductStore();
    const [count, setCount] = useState(0)
    const {debounceFn} = useOptimistic()

    const updateProductOptimistic = (count:number) => {
        updateProductQuantityLocal(product, count)
        debounceFn(() => updateProductQuantityInCart(product, count), 500)
    }

    const onCountUpdate = (action: 'increment'| 'decrement') => {
        switch(action) {
            case 'increment':
                setCount(prev => prev + 1)
                updateProductOptimistic(count + 1)
                break;
            case 'decrement':
                setCount(prev => prev - 1)
                updateProductOptimistic(count - 1)
                break;
        }
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
                    <AddSubtract count={count} onCountUpdate={onCountUpdate} />
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;

