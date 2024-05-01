"use client";
import Image from "next/image";
import { useState } from "react";
import config from "@/config";
import { Product } from "@/types/client/types";
import { useProductStore } from "@/store/useProductStore";
import useOptimistic from "@/lib/client/hooks/useOptimistic";
import { Quantity } from "@/types/client/types";
import VariantModal from "./addProduct";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddProductModal from "./addProduct";

const AdminProductCard = ({ product }: { product: Product }) => {
  const [editProductModal, setEditProductModal] = useState<boolean>(false)
  const { cart, updateProductQuantityInCart, updateProductQuantityLocal } =
    useProductStore();
  const { debounceFn } = useOptimistic();
  const quantityInCart = getTotalQuantity();
  const productFromCart = cart.data[product.id] ? cart.data[product.id] : product
  const [showVariant, setShowVariant] = useState<boolean>(false);
  function getTotalQuantity() {
    let total = 0;
    const productExistsInCart = cart.data[product.id];
    if (productExistsInCart) {
      productExistsInCart.quantities.forEach((quantity: Quantity) => {
        total += quantity?.count || 0;
      });
    } else {
      total = 0;
    }
    return total;
  }
  const totalItemsQuantity = getTotalQuantity();
  const productPrice = product.quantities[0].price;
  const updateProductOptimistic = (count: number, quantIndex: number) => {
    const productFromCart = cart.data[product.id] ? cart.data[product.id] : product
    updateProductQuantityLocal(
      productFromCart,
      count,
      product.quantities[quantIndex].id,
    );
    debounceFn(
      () =>
        updateProductQuantityInCart(
          product,
          count,
          product.quantities[quantIndex].id,
        ),
      500,
    );
  };

  // console.log(cart.data, "====> q11")
  const onCountUpdate = (action: "increment" | "decrement", quantIndex:number) => {
    debugger
    if (product.quantities.length > 1 && !showVariant) {
      setShowVariant(true);
    } else {
      const quantityInCart = cart.data?.[product.id]?.quantities[quantIndex]?.count || 0;
      switch (action) {
        case "increment":
          updateProductOptimistic(quantityInCart + 1, quantIndex);
          break;
        case "decrement":
          updateProductOptimistic(quantityInCart - 1, quantIndex);
          break;
      }
    }
  };

  const takeActionOnProduct = async () => {
   setEditProductModal(!editProductModal)
  }

  const updateProductOptimisticV1 = (action: "increment" | "decrement", quantIndex: number, quantObj: Quantity) => {
    onCountUpdate(action, quantIndex);
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
              height={210}
            />
          </div>
        ) : (
          // <div>Product {product.name} has no image</div>
          <Image
              src={`${config.directusFileDomain}/ea7d848d-440a-443f-9eb4-01882c73076a`}
              alt={product.name}
              style={{
                objectFit: "cover",
              }}
              className="h-full w-full"
              width={180}
              height={210}
            />
        )}
      </div>
      <div className=" w-full flex flex-col h-full justify-between px-1">
        <h3 className="text-xs font-semibold line-clamp-2 md:line-clamp-3 h-[40px]">
          {product.name}
        </h3>
        {
          editProductModal &&
          <AddProductModal 
            product={product}
            isOpen={editProductModal}
            onClose={() => setEditProductModal(false)}
          />
        }
        <div className="flex justify-between items-center w-full mt-1">
          <p className="text-xs font-semibold">₹{productPrice}</p>
          <Button color="primary" onClick={takeActionOnProduct} style={{ marginRight: '0.5rem', marginTop: '0.5rem' }}>
                          Action
                        </Button>
          </div>
      </div>
    </Card>
  );
};

export default AdminProductCard;
