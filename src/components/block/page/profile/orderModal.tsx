"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Order } from "@/types/client/types"
import { Heading } from "lucide-react"
import { useState } from "react"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableCaption, TableHead } from "@/components/ui/table"
import { fetchInsideTryCatch } from "@/lib/client/apiUtil"

type Props = {
    orders: Order[]
}
const OrderModal = (props: Props) => {
    const [open, setOpen] = useState(false)
    const [showOrderDetails, setShowOrderDetails] = useState<Order | null>(null)
    const { orders } = props

    const handleViewDetails = (order: Order) => {
        console.log(order)
        setShowOrderDetails(order)
        setOpen(true)
    }

    const OrderStatus = {
        "order_placed": "Order Placed",
        "out_for_delivery": "Out for Delivery",
        "cancelled": "Cancelled",
        "delivered": "Delivered"
    }

    const handleCancelOrder = async (id: number) => {
        console.log("Cancel order", id)
        const response = await fetchInsideTryCatch(`/api/admin/orders`,
            {
                method: "PATCH",
                body: JSON.stringify({ orderId: id, status: "cancelled" })
            }
        )
        if (response && response.response && response.response.statusCode === 200) {
            console.log("Order cancelled")

        }

    }
    return (
        <>

            <div className="w-full">
                <Table className="table-fixed">
                    <TableCaption>Order Items</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ordered On</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{new Date(order.created_at).toDateString()}</TableCell>
                                <TableCell>Rs. {order.total_amount}</TableCell>
                                <TableCell>{OrderStatus[order.status]}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewDetails(order)}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


            {
                open && showOrderDetails &&
                <Dialog open={open} onOpenChange={() => setOpen(false)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>
                                <div className="flex flex-col gap-4">
                                    {/* Show Order Details */}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Order Date</span>
                                            <span className="text-sm">{new Date(showOrderDetails.order_date).toDateString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Order Amount</span>
                                            <span className="text-sm">{showOrderDetails.total_amount}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Order Status</span>
                                            <span className="text-sm">{OrderStatus[showOrderDetails.status]}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Order items </span>
                                            <div className="flex flex-col gap-2">
                                                <div className="w-full">
                                                    <Table className="table-fixed">
                                                        <TableCaption>Order Items</TableCaption>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Product Name</TableHead>
                                                                <TableHead>Quantity</TableHead>
                                                                <TableHead>Price Per Unit</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {showOrderDetails.order_items.map((item) => (
                                                                <TableRow key={item.id}>
                                                                    <TableCell>{item.product_name}</TableCell>
                                                                    <TableCell>{item.quantity}</TableCell>
                                                                    <TableCell>{item.price_per_unit}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Cancel button if order_date is not older than 5 hours */}
                                        {new Date(showOrderDetails.order_date).getTime() > new Date().getTime() - 5 * 60 * 60 * 1000 &&
                                            <div className="flex items-center justify-between">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleCancelOrder(Number(showOrderDetails.id))}
                                                >
                                                    Calcel Order
                                                </Button>
                                            </div>}
                                    </div>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog >
            }
        </>
    )
}




export default OrderModal