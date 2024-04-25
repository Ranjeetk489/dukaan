"use client";
import { Card } from "@/components/ui/card";
import { Cart } from "@/types/server/types";
import { useProductStore } from "@/store/useProductStore";
import CartProduct from "./cartItem";
import { useEffect } from "react";

type Props = {
    cartData: Cart
};

function CartItems(props: Props) {
    const { cart, updateCart } = useProductStore()
    useEffect(() => {
        updateCart(props.cartData)
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.cartData])

    console.log(cart, "====> cart")

    console.log(Object.values(cart.data).map((item) => {console.log(item)}))
    return (
        <Card className="flex flex-col gap-4 px-2 py-2 mt-4">
            {
                Object.values(cart.data).map((item) => (
                    <CartProduct key={item?.id} item={item} />
                ))
            }
        </Card>
    );
}

export default CartItems;

