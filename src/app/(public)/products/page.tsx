// "use client"
import Categories from "@/components/block/page/products/categories";
import { getCategories } from "@/lib/directus/methods";
import { getProductsByCategoryId } from "@/lib/prisma";

type Props = {}

export  default async function Page({}: Props) {
  const categories = await getCategories()
  // const products = await getProductsByCategoryId(1)
  // console.log(products, "products")

  return (
    <div className="flex flex-col gap-8">
      <Categories
        categories={categories}
      />
    </div>
  )
}

