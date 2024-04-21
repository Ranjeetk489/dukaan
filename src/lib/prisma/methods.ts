'use server'
import { Product } from "@/types/client/types";
import prisma from "./client";

export const getProductsByCategoryId = async (category_id: number) => {
    const data: Product[] = await prisma.$queryRaw`
    SELECT
      p.*,
      json_agg(q.*) as quantities
    FROM
      products p
    LEFT JOIN
      quantity q
    ON
      p.id = q.product_id
    WHERE
      p.category_id = ${category_id}
    GROUP BY
      p.id
  `;
    console.log(data, "data")
    return data
}