import { responseHelper } from "@/lib/helpers";
import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const categoryId = url.searchParams.get("categoryId");

    if (!categoryId) {
      return responseHelper(
        { message: "Category Id is required", statusCode: 400, data: {} },
        400,
      );
    }

    const category_id = Number(categoryId);
    const products: any = await prisma.$queryRaw`
    SELECT * FROM products
    WHERE category_id = ${Number(category_id)}
  `;

    // Extract product IDs from the fetched products
    const productIds = products.map((product: any) => Number(product.id));

    const quantityOfProducts: any = await prisma.$queryRaw`
    SELECT * FROM quantity
    WHERE product_id IN (${Prisma.join(
      productIds
    )})`;



    // Group quantities by product ID
    const quantitiesByProductId: Record<number, any[]> = {};
    quantityOfProducts.forEach((quantity: any) => {
      if (!quantitiesByProductId[quantity.product_id]) {
        quantitiesByProductId[quantity.product_id] = [];
      }
      quantitiesByProductId[quantity.product_id].push(quantity);
    });

    // Map quantities to their respective products
    products.forEach((product: any) => {
      // Find quantities associated with the current product
      const productQuantities = quantitiesByProductId[product.id] || [];

      // Add quantities to the product
      product.quantities = productQuantities;
    });

    return responseHelper(
      {
        message: "Products fetched successfully",
        statusCode: 200,
        data: products,
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
