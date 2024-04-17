"use client"
import { Card } from '@/components/ui/card'
import config from '@/config'
import { CartItem } from '@/types/client/types'
import Image from 'next/image'
import  { useState } from 'react'

type Props = {
    cartData: CartItem[] | [],
}

function CartItems(props: Props) {
  return (
    <Card>
        {
            props.cartData.map((item) => (
                    <div key={item.product.id} className='flex items-center justify-between'>
                        <div>
                        <Image
                            src={`${config.directusFileDomain}/${item.product.image}`}
                            alt={item.product.name}
                            width={100}
                            height={100}
                            className='border border-slate-500 rounded-md'
                        />
                        <div className='flex flex-col gap-1'>
                            <p className='text-slate-800'>{item.product.name}</p>
                            <p className='text-slate-600'>{item.product.stock_quantity}</p>
                            <p className='font-medium text-slate-900'>₹{item.product.price}</p>
                        </div>
                        </div>
                        
                    </div>

                )
            )
        }
    </Card>
  )
}

export default CartItems