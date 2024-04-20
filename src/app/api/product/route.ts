import { responseHelper } from "@/lib/helpers";
import { directus } from "@/lib/utils";
import {  readItems } from "@directus/sdk";
import { Product } from "@/types/client/types";


export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const categoryId = url.searchParams.get("categoryId");

    if(!categoryId){
      return responseHelper(
        { message: "Category Id is required", statusCode: 400, data: {} },
        400,
      );
    }

    const category_id = Number(categoryId);
    // @ts-expect-error
    const products: Product[] = await directus.request(
      // @ts-expect-error
      readItems("products", {
        fields: ["*", "quantity_id.*"],
        filter: {
          category_id: {
            _eq: category_id,
          },
        },
      }),
    );

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
