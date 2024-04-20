"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import ProductCard from "../../productCard"
import { useCategoryStore } from "@/store/useProductStore"
import { NETWORK_STATES } from "@/lib/client/apiUtil"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

type Props = {
    categories: { id: number, name: string }[]
}


const Categories = (props: Props) => {
    const {categories, getProductsByCategory, categoryProducts, updateCategories } = useCategoryStore()
 
    return (
        <div className="grid grid-cols-8">
            <div className="flex flex-col gap-2 col-span-2">
                {
                    props.categories.map((category) => {
                        return (
                            <Button key={category.id} onClick={() => getProductsByCategory(category.id)}>{category.name}</Button>
                        )
                    })
                }
            </div>
            <div className="col-span-6">
                
                {
                    categoryProducts.status === NETWORK_STATES.LOADING ? <LoadingSpinner/> : 
                    categoryProducts.data.map((product) => {
                        return (
                            <ProductCard key={product.id} product={product} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Categories