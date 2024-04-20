"use server";
import { Cart, CartItem, Category, Product } from "@/types/client/types";
import { isAuthenticatedAndUserData } from "../auth";
import { directus } from "../utils";
import { readItems } from "@directus/sdk";
import { DirectusCartItem } from "./types";

const getCartItems = async (): Promise<Cart> => {
  const auth = await isAuthenticatedAndUserData();
  if (auth.isAuthenticated && auth.user) {
    const userId = auth.user.id;
    // @ts-expect-error
    const data: DirectusCartItem[] = await directus.request(
      // @ts-expect-error
      readItems("cart", {
        fields: ["quantity", "product_id.*", "quantity_id.*"],
        filter: {
          user_id: {
            _eq: userId,
          },
        },
      }),
    );

    if (data.length) {
      const result: Cart = {};
      data.forEach((item) => {
        result[item.product_id.id] = {
          product: item.product_id,
          quantity: item.quantity,
        };
      });
      return result;
    }
  }
  return {};
};

const getCategories = async (): Promise<Category[]> => {
  const data: Category[] = await directus.request(
    // @ts-expect-error
    readItems("categories", { fields: ["id", "name"] }),
  );

  return data;
};

const getProductsByCategoryId = async (
  categoryId: string,
): Promise<Product[]> => {
  const category_id = Number(categoryId)
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
  return products;
};
export { getCartItems, getCategories, getProductsByCategoryId };
