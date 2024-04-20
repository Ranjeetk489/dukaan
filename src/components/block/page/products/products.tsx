'use client'

import { useProductStore } from "@/store/useProductStore";
import ProductCard from "../../productCard";

type Props = {

}

const Products = (props: Props) => {
    const products = useProductStore(state => state.products);

    return (
        <div className="flex overflow-x-auto gap-4 scroll no-scrollbar">
            {
                products.map((product) => (
                    // eslint-disable-next-line react/jsx-key
                    <ProductCard product={product} key={product.id} />
                ))
            }
        </div>
    )
}

export default Products