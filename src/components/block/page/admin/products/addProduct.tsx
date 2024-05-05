import React, { useState, useEffect } from "react";
import { Product, Quantity } from "@/types/client/types";
import SingleFileUploader from "@/components/ui/SingleVideoUploader";
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

const AddProductModal = (props: Props) => {
  const [productName, setProductName] = useState(props.product.name || "");
  const [quantities, setQuantities] = useState<QuantityInAddProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUUID, setImageUUID] = useState<string>("");

  

  useEffect(() => {
    props.product.quantities.forEach((quantity: Quantity) => {
      setQuantities(prevQuantities => [
        ...prevQuantities,
        { id: quantity.id, product_id: quantity.product_id, quantity: quantity.quantity, price: quantity.price, stock_quantity: String(quantity.stock_quantity) }
      ]);
    });
  }, []);

  const handleUpload = async (imageUUID: string) => {
    setImageUUID(imageUUID);
  };
  
  const handleAddQuantity = () => {
    setQuantities([...quantities, { quantity: "", price: "", stock_quantity: "" }]);
  };

  const handleQuantityChange = (index: number, field: keyof QuantityInAddProduct, value: string) => {
    const updatedQuantities = [...quantities];
    (updatedQuantities[index][field] as string) = value;
    setQuantities(updatedQuantities);
  };

  const handleSubmit = () => {
    console.log("Product Name:", productName);
    console.log("Quantities:", quantities);
  };

  const isMobile = useDevice();

  return (
    <>
      {isMobile ? (
        <div className="">
          <div className="py-4 px-0">
            <div className="border-b border-slate-200 shadow-sm pb-4">
              <p className="font-semibold text-sm">{props.product.name}</p>
            </div>
            <div className="flex flex-col gap-2 px-2 py-4 text-black">
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Product Name"
                className="border border-gray-300 rounded-md px-3 py-2 mb-3"
              />
              <SingleFileUploader
                onUpload={handleUpload}
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
            </div>
          </div>
        </div>
      ) : (
        <div className="text-black">
          <div className="bg-slate-100">
            <div>
              <div>
                <p>Product Details</p>
                <div className="flex flex-col gap-2 text-black">
                  <input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Product Name"
                    className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                  />
                  <SingleFileUploader
                    onUpload={handleUpload}
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
                  <Button color="primary" onClick={handleSubmit}>Submit</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProductModal;
