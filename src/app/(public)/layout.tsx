"use client";

import { Button } from "@/components/ui/button";
import { useDevice } from "@/lib/client/hooks/useDevice";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from 'next/navigation'
import { useState } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [searchValue, setSearchValue] = useState('')

    const { cart, toggleCartSheet } = useProductStore();
    const getTotalQuantity = () => {
        let total = 0
        Object.keys(cart.data).forEach((key: string) => {
            const cartProduct = cart.data[Number(key)]
            cartProduct.quantities.forEach((quantity: any) => {
                total += quantity.count
            })
        })
        return total
    }
    const totalItemsQuantity = getTotalQuantity()


    const { isMobile } = useDevice()
    const router = useRouter()

    const onCartClick = () => {
        if (isMobile) {
            router.push('/cart')
        } else {
            toggleCartSheet(true)
        }
    }

    const handleChange = () => {
        console.log("handle change", searchValue)
        
    }


    return (
        <div className="container">
            <header className="flex justify-between my-4">
                <div className="flex flex-col">
                    <h4 className="text-primary">Dukaan</h4>
                    <p>Estimated Delivery in 24hr</p>
                </div>
                <div className="flex gap-2 h-[43px]">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-500 rounded px-3 py-1 w-[600px]"
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <Button className="" onClick={handleChange}>Search</Button>
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
