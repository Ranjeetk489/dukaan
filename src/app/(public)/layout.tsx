"use client";

import { Button } from "@/components/ui/button";
import { useProductStore } from "@/store/useProductStore";
import { Fragment, useState } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { cart } = useProductStore();

    return (
        <Fragment>
            <header className="flex justify-between my-4">
                <div className="flex flex-col">
                    <h4 className="text-primary">Dukaan</h4>
                    <p>Estimated Delivery in 4hr</p>
                </div>
                <div>
                    <Button className="">
                        Cart {' '}
                        <p className="w-[24px]">({cart.length})</p>
                    </Button>
                </div>
            </header>
            {children}
        </Fragment>
    );
}
