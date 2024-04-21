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




  /*
  import { Directus } from '@directus/sdk';

// Initialize Directus SDK
const directus = new Directus('https://your-directus-url.com');

// Function to upload an image and associate it with a product
async function addProductWithImage(productName: string, productDescription: string, categoryId: number, imageUUID: string) {
    try {
        // Insert the product data into the products table
        const newProduct = await directus.items('products').create({
            name: productName,
            description: productDescription,
            category_id: categoryId,
            image: imageUUID // Associate the image with the product using its UUID
        });

        console.log('New product added:', newProduct);
        return newProduct;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
}

// Example usage
async function main() {
    try {
        // Upload the image to Directus (replace 'path/to/image.jpg' with the actual path to your image file)
        const uploadedImage = await directus.files.upload('path/to/image.jpg');

        // Get the UUID of the uploaded image
        const imageUUID = uploadedImage.data.id;

        // Add the product with the associated image
        const newProduct = await addProductWithImage('Product Name', 'Product Description', 1, imageUUID);

        console.log('New product added:', newProduct);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the main function
main();

  */