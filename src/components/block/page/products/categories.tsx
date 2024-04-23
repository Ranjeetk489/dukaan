"use client"
import { Button } from "@/components/ui/button"
import { useCategoryStore } from "@/store/useProductStore"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Products from "./products"
import { getProductsByCategoryId } from "@/lib/prisma"
import { useState } from "react"

type Props = {
    categories: { id: number, name: string }[]
}


const Categories = (props: Props) => {
    const [loading,setLoading] = useState(false)
    const { categories, updateCategoryProducts, categoryProducts, updateCategories } = useCategoryStore()

    const onCategoryClick = async (id: number) => {
        setLoading(true)
        const data = await getProductsByCategoryId(id)
        if (data) {
            updateCategoryProducts(data)
        }
        setLoading(false)
    }

    return (
        <div className="grid grid-cols-8 gap-8">
            <div className="flex flex-col gap-2 col-span-2">
                {
                    props.categories.map((category) => {
                        return (
                            <form action={() => onCategoryClick(category.id)} key={category.id} className="w-full">
                                <Button className="w-full" type="submit">{category.name}</Button>
                            </form>
                        )
                    })
                }
            </div>
            <div className="col-span-6">
                {
                    loading ?
                        <LoadingSpinner /> :
                        <Products productsData={categoryProducts.data} />
                }
            </div>
        </div>
    )
}

export default Categories