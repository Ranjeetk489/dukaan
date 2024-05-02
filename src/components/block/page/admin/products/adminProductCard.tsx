"use client";
import Image from "next/image";
import { useState } from "react";
import config from "@/config";
import { Product } from "@/types/client/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddProductModal from "./addProduct";

const AdminProductCard = ({ product }: { product: Product }) => {
  const [editProductModal, setEditProductModal] = useState<boolean>(false)

  const productPrice = product.quantities[0].price;

  const takeActionOnProduct = async () => {
    setEditProductModal(!editProductModal)
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
