import React, { useEffect, useState } from "react";
import { Product, Quantity } from "@/types/client/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDevice } from "@/lib/client/hooks/useDevice";

type Props = {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
};

interface QuantityInAddProduct {
  id?: number;
  product_id?: number;
  is_stock_available?: number;
  quantity: string;
  price: string;
  stock_quantity: string;
}

function AddProductModal(props: Props) {
  const [productName, setProductName] = useState(props.product.name || "");
  const [imageURL, setImageURL] = useState(props.product.image || "");
  const [quantities, setQuantities] = useState<QuantityInAddProduct[]>([]);

  useEffect(() => {
    props.product.quantities.forEach((quantity: Quantity) => {
      setQuantities(prevQuantities => [
        ...prevQuantities, 
        { id: quantity.id, product_id: quantity.product_id, quantity: quantity.quantity, price: quantity.price, stock_quantity: String(quantity.stock_quantity) }
      ]);
    });
  }, []); // Empty dependency array to run only once
  
  const handleAddQuantity = () => {
    setQuantities([...quantities, { quantity: "", price: "", stock_quantity: "" }]);
  };

  const handleQuantityChange = (index: number, field: keyof QuantityInAddProduct, value: string) => {
    const updatedQuantities = [...quantities];
    // update quantity 
    // updatedQuantities[index][field] = value;
    setQuantities(updatedQuantities);
  };

  const handleSubmit = () => {
    console.log("Product Name:", productName);
    console.log("Image URL:", imageURL);
    console.log("Quantities:", quantities);
  };

   const isMobile = useDevice();
  return (
    <>
      {isMobile ? (
        <div className="lg:hidden visible">
          <Sheet open={props.isOpen} onOpenChange={props.onClose}>
            <SheetContent className="py-4 px-0" side={"bottom"}>
              <SheetHeader className="">
                <SheetTitle className="border-b border-slate-200 shadow-sm pb-4">
                  <p className="font-semibold text-sm">{props.product.name}</p>
                </SheetTitle>
              </SheetHeader>
              <SheetDescription className="flex flex-col gap-2 px-2 py-4">
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product Name"
                  className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                />
                <input
                  type="text"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                  placeholder="Image URL"
                  className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                />
                <Button color="primary" onClick={handleAddQuantity}>Add Quantity</Button>
                {quantities.map((quantity, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={quantity.quantity}
                      onChange={(e) => handleQuantityChange(index, "quantity", e.target.value)}
                      placeholder="Quantity"
                      className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                    />
                    <input
                      type="text"
                      value={quantity.price}
                      onChange={(e) => handleQuantityChange(index, "price", e.target.value)}
                      placeholder="Price"
                      className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                    />
                    <input
                      type="text"
                      value={quantity.stock_quantity}
                      onChange={(e) => handleQuantityChange(index, "stock_quantity", e.target.value)}
                      placeholder="Stock Quantity"
                      className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                    />
                  </div>
                ))}
                <Button color="primary" onClick={handleSubmit}>Submit</Button>
              </SheetDescription>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div className="hidden lg:visible">
          <Dialog open={props.isOpen} onOpenChange={props.onClose}>
            <DialogContent className="bg-slate-100">
              <DialogHeader>
                <DialogTitle>{props.product.name} Variants</DialogTitle>
                <DialogDescription className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Product Name"
                    className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                  />
                  <input
                    type="text"
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                    placeholder="Image URL"
                    className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                  />
                  <Button color="primary" onClick={handleAddQuantity}>Add Quantity</Button>
                  {quantities.length && quantities.map((quantity, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={quantity.quantity}
                        onChange={(e) => handleQuantityChange(index, "quantity", e.target.value)}
                        placeholder="Quantity"
                        className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                      />
                      <input
                        type="text"
                        value={quantity.price}
                        onChange={(e) => handleQuantityChange(index, "price", e.target.value)}
                        placeholder="Price"
                        className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                      />
                      <input
                        type="text"
                        value={quantity.stock_quantity}
                        onChange={(e) => handleQuantityChange(index, "stock_quantity", e.target.value)}
                        placeholder="Stock Quantity"
                        className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                      />
                    </div>
                  ))}
                  {/* Button to submit the form */}
                  <Button color="primary" onClick={handleSubmit}>Submit</Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}

export default AddProductModal;
