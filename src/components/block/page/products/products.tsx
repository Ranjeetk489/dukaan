'use client'
import { useProductStore } from "@/store/useProductStore";
import ProductCard from "./productCard";
import { Product } from "@/types/client/types";
import { useDevice } from "@/lib/client/hooks/useDevice";

type Props = {
    productsData: Product[]
}

const Products = (props: Props) => {
    // const products = useProductStore(state => state.products);
    const { isMobile } = useDevice()
    return (
        <div className="flex gap-4">
            {
                props.productsData.map((product) => (
                    // eslint-disable-next-line react/jsx-key
                    <ProductCard product={product} key={product.id} />
                ))
            }
        </div>
    )
}

export default Products