"use client"
import ProductCard from "@/components/block/productCard"
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/types/client/types"

type Props = {}

export default function Page({ }: Props) {
  const products = useProductStore(state => state.products);


  return (
    <div className="flex flex-col gap-8">
      <div className="flex overflow-x-auto gap-4 scroll no-scrollbar">
        {
          products.map((product, idx) => (
            // eslint-disable-next-line react/jsx-key
            <ProductCard product={product} key={product.id} />
          ))
        }
      </div>
    </div>

  )
}

