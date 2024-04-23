"use client";
import Image from "next/image";
import { useState } from "react";
import { Card } from "../../../ui/card";
import config from "@/config";
import { Product} from "@/types/client/types";
import { useProductStore } from "@/store/useProductStore";
import useOptimistic from "@/lib/client/hooks/useOptimistic";
import AddSubtract from "./addSubtract";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Quantity } from "@/types/server/types";

const ProductCard = ({ product }: { product: Product }) => {
  const { cart, updateProductQuantityInCart, updateProductQuantityLocal } = useProductStore();
  const { debounceFn } = useOptimistic();
  const [quantityIndex, setQuantityIndex] = useState<number>(0);
  const quantityInCart = getTotalQuantity()
  
  function getTotalQuantity() {
    let total = 0
    const productExistsInCart = cart.data[product.id]
    if(productExistsInCart) {
      productExistsInCart.quantities.forEach((quantity: Quantity) => {
        total += quantity?.count || 0
      })
    } else {
      total = 0
    }
    return total
  }
const totalItemsQuantity = getTotalQuantity()
  const productPrice = product.quantities[0].price;
  const updateProductOptimistic = (count: number) => {
    updateProductQuantityLocal(product, product.quantities[0].id, count);
    debounceFn(
      () =>
        updateProductQuantityInCart(product, product.quantities[0].id, count),
      500
    );
  };
  const [showVariant, setShowVariant] = useState<boolean>(false);

  console.log(quantityInCart)
  console.log(cart.data[product.id]?.quantities)

  const onCountUpdate = (action: "increment" | "decrement") => {
    const quantityInCart = cart.data[product.id]?.quantities[quantityIndex].count || 0;
    switch (action) {
      case "increment":
        updateProductOptimistic(quantityInCart + 1);
        break;
      case "decrement":
        updateProductOptimistic(quantityInCart - 1);
        break;
    }
  };

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
        <h3 className="text-xs font-semibold line-clamp-2 md:line-clamp-3 h-[40px]">
          {product.name}
        </h3>
        <Select>
          <SelectTrigger
            className="w-full text-xs h-8"
          >
            <SelectValue placeholder={product.quantities[0].quantity} />
          </SelectTrigger>
          <SelectContent>
            {product.quantities.map((quantity, index) => (
              <SelectItem
                className="cursor-pointer"
                key={quantity.id}
                value={quantity.quantity}
                onClick={() => {
                  setShowVariant(!showVariant);
                  setQuantityIndex(index);
                }}
              >
                {quantity.quantity}
              </SelectItem>
            ))}
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
