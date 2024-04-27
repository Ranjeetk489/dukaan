import { Cart, CartItem, CartItemQuantity } from "@/types/client/types";

export function formatCartData(apiData: CartItem[]): Cart {
    const formattedCart: Cart = {};
    
    apiData.forEach((item, index) => {
        const {
        product_id,
        name,
        description,
        category_id,
        created_at,
        updated_at,
        image,
        quantity_id,
        quantity,
        price,
        is_stock_available,
        stock_quantity,
        cart_quantity,
        cart_id,
      } = item;
      // const quantity = apiData
      if (!formattedCart[product_id]) {
        formattedCart[product_id] = {
          id: product_id,
          name,
          description,
          category_id,
          created_at,
          updated_at,
          image,
          quantity_id,
          quantities: [],
        };
      }
  
      const cartItemQuantity: CartItemQuantity = {
        id: cart_id,
        product_id,
        quantity,
        price,
        is_stock_available,
        count: cart_quantity,
        stock_quantity: stock_quantity,
        created_at,
        updated_at: updated_at || '',
        added_quantity: cart_quantity,
      };
      
  
      formattedCart[product_id].quantities.push(cartItemQuantity);
    });
    return formattedCart;
  }
