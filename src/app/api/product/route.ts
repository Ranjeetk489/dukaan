import { responseHelper } from "@/lib/helpers";
import prisma from "@/lib/prisma/client";
import { Product } from "@/types/client/types";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category_id = Number(url.searchParams.get("categoryId"));

    if (!category_id || Number.isNaN(category_id)) {
      return responseHelper(
        { message: "Category Id is required", statusCode: 400, data: {} },
        400,
      );
    }


    const productsWithQuantities: Product[] = await prisma.$queryRaw`
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


    return responseHelper(
      {
        message: "Products fetched successfully",
        statusCode: 200,
        data: productsWithQuantities,
      },
      200,
    );
  } catch (err) {
    console.error(
      "Internal server error in fetching Product By category Id:",
      err,
    );
    return responseHelper(
      { message: "Internal server error in fetching Products", statusCode: 500, data: {} },
      500,
    );
  }
}





// Replace this code by one query

  //   const products: ProductFromDB[] = await prisma.$queryRaw`
  //   SELECT * FROM products
  //   WHERE category_id = ${Number(category_id)}
  // `;

  //   // Extract product IDs from the fetched products
  //   const productIds: number[] = products.map((product: any) => Number(product.id));

  //   const quantityOfProducts: Quantity[] = await prisma.$queryRaw`
  //   SELECT * FROM quantity
  //   WHERE product_id IN (${Prisma.join(
  //     productIds
  //   )})`;

  //   // Group quantities by product ID
  //   const quantitiesByProductId: Record<number, Quantity[]> = {};
  //   quantityOfProducts.forEach((quantity: any) => {
  //     if (!quantitiesByProductId[quantity.product_id]) {
  //       quantitiesByProductId[quantity.product_id] = [];
  //     }
  //     quantitiesByProductId[quantity.product_id].push(quantity);
  //   });

  //   // Map quantities to their respective products
  //   products.forEach((product: any) => {
  //     const productQuantities = quantitiesByProductId[product.id] || [];

  //     product.quantities = productQuantities;
  //   });
