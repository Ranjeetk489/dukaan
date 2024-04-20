"use client"

import { useProductStore } from '@/store/useProductStore'
import { Cart, CartItem } from '@/types/client/types'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import CartItems from './cartItems'
import BillDetails from './ billDetails'
import { ArrowRightIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

type Props = {
    cartData?: Cart
}

function OrderCart(props: Props) {
    const { toggleCartSheet, cart, updateCart } = useProductStore()
    const totalAmount = Object.values(cart.data).reduce((acc: number, item: CartItem) => acc + (+item.product.price * item.quantity), 0)
    const router = useRouter()
    const handleProceedAction = () => {
        toggleCartSheet(false)
        router.push('/cart')
    }

    useEffect(() => {
        if(props.cartData) {
            updateCart(props.cartData)
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.cartData])


    const deliveryCharge = 100
    return (
        <>    {
            Object.keys(cart.data).length ?
                <div className=''>
                    <div className='px-2'>
                        <CartItems cartData={cart.data} />
                    </div>
                    <div className='px-2 mt-4'>
                        <BillDetails subTotal={totalAmount} deliveryCharge={deliveryCharge} grandTotal={totalAmount + deliveryCharge} />
                    </div>
                    <Card className='px-2 py-2 mx-2 mt-2'>
                        <p>Cancellation Policy</p>
                        <p className='text-xs text-slate-500 mt-1'>Cancellation charges may be applicable</p>
                    </Card>
                    <div className='absolute bottom-0 right-0 left-0 py-4 bg-white border-t border-slate-200 rounded-tl-xl shadow-[0_0_10px_0px_rgba(0,0,0,0.1)] rounded-tr-lg'>
                        <div className='mr-4 ml-4 p-2 rounded-md bg-primary flex text-white cursor-pointer justify-between items-center' onClick={handleProceedAction}>
                            <div className='text-xs'>
                                <p className='font-medium'> ₹{totalAmount}</p>
                                <p className='font-light  uppercase tracking-wide'>Total</p>
                            </div>
                            <div className='flex items-center gap-1'>
                                <p>Proceed</p>
                                <ArrowRightIcon />
                            </div>
                        </div>
                    </div>
                    
                </div>
                : false
        }
        </>
    )
}

export default OrderCart