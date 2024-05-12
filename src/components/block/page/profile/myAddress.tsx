import { Button } from "@/components/ui/button"
import { Address } from "@/types/client/types";
import AddressModal from "./AddressModal";
import { useState } from "react";
import EditAddressPopup from "./EditAddressPopup";


const mockAddresses: Address[] = [
    {
        id: 1,
        user_id: 1,
        address_line1: '123 Main St',
        address_line2: 'Apt 2B',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10001',
        created_at: '2022-04-25T10:15:30Z',
        updated_at: '2022-04-25T10:15:30Z',
    },
    {
        id: 2,
        user_id: 1,
        address_line1: '456 Elm St',
        address_line2: 'Floor 3',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        postal_code: '90001',
        created_at: '2022-04-26T09:20:45Z',
        updated_at: '2022-04-26T09:20:45Z',
    },
    // Add more mock addresses as needed
];
const emptyAddress: Address = {
    id: 0,
    user_id: 0,
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    created_at: '',
    updated_at: '',
};
const MyAddress = () => {
    const [addNewAddressPopup, setAddNewAddressPopup] = useState(false);
    const [newAddress, setNewAddress] = useState<Address | null>(emptyAddress);
    const [openAddAddressPopup, setOpenAddAddressPopup] = useState(false);

    
    
    const handleAddNewAddressClick = () => {
        setAddNewAddressPopup(true)
        console.log("Add new address click")
    }

    return (
        <>
            <div className="flex gap-4 mb-4">
                My Address
            </div>
            <div>
                <Button
                    className="bg-primary text-white"
                    onClick={handleAddNewAddressClick}>
                    Add New Address
                </Button>
            </div>
            <div>
                <AddressModal addresses={mockAddresses} />
            </div>
        {
            addNewAddressPopup && 
            <EditAddressPopup
                address={newAddress!}
                onCancel={() => setAddNewAddressPopup(false)}
                isOpen={addNewAddressPopup}
                onChange={() => setAddNewAddressPopup(false)}
            />
        }
        </>
    )
}

export default MyAddress