"use client";

import { Address } from "@/types/client/types";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import EditAddressPopup from "./EditAddressPopup";
import { AiFillHome } from "react-icons/ai";


type Props = {
    addresses: Address[];
};

const AddressModal = ({ addresses }: Props) => {
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [openEditAddressPopup, setOpenEditAddressPopup] = useState(false);

    const handleEditClick = (address: Address) => {
        setSelectedAddress(address);
        setOpenEditAddressPopup(true)
        console.log("Edit Clicked", address);
    };

    const handleDeleteClick = (address: Address) => {
        setSelectedAddress(address);
    };

    return (
        <>
            <div className="flex flex-col">
                <ul>
                    {addresses.map(address => (
                        <li key={address.id}>
                            <div className="flex items-center gap-4 mb-4">
                                <AiFillHome />

                                <div className="font-medium">Home</div>

                                <div>{`${address.address_line1}, ${address.address_line2}, ${address.city}, ${address.state}, ${address.country}, ${address.postal_code}`}</div>
                                <div className="flex items-center gap-2 ml-auto">

                                    <Button className="bg-primary text-white" onClick={() => handleEditClick(address)}>Edit</Button>

                                    <Button className="bg-primary text-white" onClick={() => handleDeleteClick(address)}>Delete</Button>
                                </div>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>
            <EditAddressPopup
                address={selectedAddress!}
                onCancel={() => setOpenEditAddressPopup(false)}
                isOpen={openEditAddressPopup}
                onChange={() => setOpenEditAddressPopup(false)}
            />
        </>
    );
};

export default AddressModal;
