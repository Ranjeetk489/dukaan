"use client"
import { Button } from "@/components/ui/button"
import { useCategoryStore } from "@/store/useProductStore"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Products from "./products"
import { getProductsByCategoryId } from "@/lib/prisma"
import { useState } from "react"
import { useDevice } from "@/lib/client/hooks/useDevice"

type Props = {
    categories: { id: number, name: string }[]
}


const Categories = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const { categories, updateCategoryProducts, categoryProducts, updateCategories } = useCategoryStore()
    let { isMobile } = useDevice()
    // isMobile = true
    const onCategoryClick = async (id: number) => {
        setLoading(true)
        const data = await getProductsByCategoryId(id)
        setLoading(false)
        if (data) {
            updateCategoryProducts(data)
        }
        
    }

    return (
        <>
            {isMobile ?
            <div className="grid grid-cols-9 gap-6">
            <div className="flex flex-col gap-2 col-span-3">
                {
                    props.categories
                    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                    .map((category) => {
                        return (
                            <form action={() => onCategoryClick(category.id)} key={category.id} className="w-full">
                                <Button className="w-full p-2 text-center whitespace-normal break-words" type="submit">{category.name.substring(0, 20)}</Button>
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
        :
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
            }
        </>
    )
}

export default Categories