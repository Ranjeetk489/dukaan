import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Address } from "@/types/client/types";
import { Heading } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';


type EditPopupProps = {
    address: Address;
    onCancel: (event?: React.MouseEvent<HTMLButtonElement>) => void;
    isOpen: boolean;
    onChange: (isOpen: boolean) => void;
};

const EditAddressPopup: React.FC<EditPopupProps> = ({ address, onCancel, isOpen, onChange }) => {
    const [editedAddress, setEditedAddress] = useState<Address>(address);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedAddress({ ...editedAddress, [name]: value });
    };

    const handleSubmit = () => {
        // Submit logic here
        console.log(editedAddress, 'editedAddress')
        onCancel();
    };

    return (

        <Dialog open={isOpen} onOpenChange={() => onChange(false)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Address</DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-col gap-4">
                            <Heading size={2}>Edit Address</Heading>
                            <Input
                                type="text"
                                name="address_line1"
                                value={editedAddress.address_line1}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="address_line2"
                                value={editedAddress.address_line2}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="city"
                                value={editedAddress.city}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="state"
                                value={editedAddress.state}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="country"
                                value={editedAddress.country}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="postal_code"
                                value={editedAddress.postal_code}
                                onChange={handleInputChange}
                            />
                            <Button className="bg-primary text-white" onClick={handleSubmit}>Save</Button>
                            <Button className="bg-primary text-white" onClick={onCancel}>Cancel</Button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    );
};


export default EditAddressPopup;