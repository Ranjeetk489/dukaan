"use client"
import ProductCard from "@/components/block/productCard"
import { Button } from "@/components/ui/button";
import useOptimistic from "@/lib/client/hooks/useOptimistic";
import { useProductStore } from "@/store/useProductStore";
import {  useState } from "react";

type Props = {}

export default function Page({ }: Props) {
  const products = useProductStore(state => state.products);


  return (
    <div className="flex flex-col gap-8">
      <div className="flex overflow-x-auto gap-4 scroll no-scrollbar">
        {
          products.map((product) => (
            // eslint-disable-next-line react/jsx-key
            <ProductCard product={product} key={product.id} />
          ))
        }
      </div> 
    </div>

  )
}

