"use client";

import { Button } from "@/components/ui/button";
import { useDevice } from "@/lib/client/hooks/useDevice";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { AiFillProfile } from "react-icons/ai";
import isAuthenticatedAndUserId from "../(protected)/utils";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [searchValue, setSearchValue] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const { cart, toggleCartSheet } = useProductStore();

    useEffect(() => {
        isUserLoggedIn();
    }, [])

    const isUserLoggedIn= async () => {
        const response = await isAuthenticatedAndUserId();
        if(response.isAuthenticated) {
            setIsLoggedIn(true)
        }
    }
    
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


    let { isMobile } = useDevice()
    // isMobile = true
    const router = useRouter()

    const onCartClick = () => {
        if(!isLoggedIn) {
            router.push('/auth/login')
            return;
        }

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
            {isMobile?
            <header className="flex flex-col sm:flex-row justify-between my-4">
            <div className="flex flex-col mb-2 sm:mb-0">
                <h4 className="text-primary">Dukaan</h4>
                <p>Estimated Delivery in 24hr</p>
            </div>
            <div className="flex flex-col-2 w-full sm:flex-row gap-2 h-[43px] mb-2 sm:mb-0">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-500 rounded px-3 py-1 flex-grow"
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button className="" onClick={handleChange}>Search</Button>
            </div>
            <div className="flex gap-2">
                <Button className="w-full sm:w-auto" onClick={onCartClick}>
                    Cart <span className="w-[24px]">({totalItemsQuantity})</span>
                </Button>
                {isLoggedIn && (
                    <AiFillProfile
                        className="w-[40px] h-[40px] cursor-pointer bg-[#f7fff9] text-[#318616]"
                        onClick={() => router.push('/profile')}
                    />
                )}
                {!isLoggedIn && (
                    <Button className="w-full sm:w-auto bg-black" onClick={() => router.push('/auth/login')}>
                        Login
                    </Button>
                )}
            </div>
        </header>
                :<header className="flex justify-between my-4">
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
                <div>
                {isLoggedIn && <AiFillProfile 
                    className="w-[40px] h-[40px] cursor-pointer bg-[#f7fff9] text-[#318616] "
                    onClick={() => router.push('/profile')}
                />}
                {
                    !isLoggedIn && 
                    <Button className="bg-[black]" onClick={() => router.push('/auth/login')}>Login / Signup</Button>
                }
                </div>
            </header>}
            {children}
        </div>
    );
}
