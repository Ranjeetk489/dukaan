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
    let { isMobile } = useDevice()
    // isMobile = true
    return (
        <>
            {
                isMobile ?
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                        {props.productsData.map((product) => (
                            <ProductCard product={product} key={product.id} />
                        ))}
                    </div>
                    :
                    <div className="flex flex-wrap">
                        {props.productsData.map((product) => (
                            <ProductCard product={product} key={product.id} />
                        ))}
                    </div>
            }
        </>
    )
}

export default Products