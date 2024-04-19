"use client";

import { Button } from "@/components/ui/button";
import { useProductStore } from "@/store/useProductStore";
import {useRouter} from 'next/navigation'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { cart } = useProductStore();
    const totalItemsQuantity = Object.values(cart.data).reduce((acc, item) => acc + item.quantity, 0)
    const router = useRouter()

    return (
        <div className="container">
            <header className="flex justify-between my-4">
                <div className="flex flex-col">
                    <h4 className="text-primary">Dukaan</h4>
                    <p>Estimated Delivery in 4hr</p>
                </div>
                <div>
                    <Button className="" onClick={() => router.push('/cart')}>
                        Cart {' '}
                        <p className="w-[24px]">({totalItemsQuantity})</p>
                    </Button>
                </div>
            </header>
            {children}
        </div>
    );
}
