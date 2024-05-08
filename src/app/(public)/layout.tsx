"use client";

import { Button } from "@/components/ui/button";
import { useDevice } from "@/lib/client/hooks/useDevice";
import { useProductStore } from "@/store/useProductStore";
import { Quantity } from "@/types/server/types";
import {useRouter} from 'next/navigation'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { cart, toggleCartSheet } = useProductStore();
    const getTotalQuantity = () => {
        let total = 0
        Object.keys(cart.data).forEach((key: string) => {
            const cartProduct = cart.data[Number(key)]
            cartProduct.quantities.forEach((quantity: any) => {
                total+= quantity.count
            })
        })
        return total
    }
    const totalItemsQuantity = getTotalQuantity()


    const {isMobile} = useDevice()
    const router = useRouter()

    const onCartClick = () => {
        if(isMobile) {
            router.push('/cart')
        } else {
            toggleCartSheet(true)
        }
    }

    return (
        <div className="container">
            <header className="flex justify-between my-4">
                <div className="flex flex-col">
                    <h4 className="text-primary">Dukaan</h4>
                    <p>Estimated Delivery in 4hr</p>
                </div>
                <div>
                    <Button className="" onClick={onCartClick}>
                        Cart {' '}
                        <p className="w-[24px]">({totalItemsQuantity})</p>
                    </Button>
                </div>
            </header>
            {children}
        </div>
    );
}
