import React, { useState, useEffect } from "react";
import { Product, Quantity } from "@/types/client/types";
import SingleFileUploader from "@/components/ui/SingleVideoUploader";
import { Button } from "@/components/ui/button";

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


  if (!props.isOpen) {
    return null; // Render nothing if modal is not open
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-75">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-xl w-11/12 md:max-w-md">
          <div className="py-4 px-6 text-black">
            <div className="border-b border-slate-200 pb-4">
              <label className="font-semibold text-lg mb-2">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Product Name"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            <div className="mt-4">
              <label className="font-semibold text-lg mb-2">Image Upload</label>
              <SingleFileUploader onUpload={handleUpload} />
            </div>
            <div className="mt-4">
             
              <table className="border border-gray-300 rounded-md w-full mt-4">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2">Stock Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {quantities.map((quantity, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="text"
                          value={quantity.quantity}
                          onChange={(e) => handleQuantityChange(index, "quantity", e.target.value)}
                          placeholder="Quantity"
                          className="w-full outline-none"
                        />
                        <span className="text-gray-500 text-sm mt-1">e.g., 100gm, 1L</span>
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="text"
                          value={quantity.price}
                          onChange={(e) => handleQuantityChange(index, "price", e.target.value)}
                          placeholder="Price"
                          className="w-full outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="text"
                          value={quantity.stock_quantity}
                          onChange={(e) => handleQuantityChange(index, "stock_quantity", e.target.value)}
                          placeholder="Stock Quantity"
                          className="w-full outline-none"
                        />
                        <span className="text-gray-500 text-sm mt-1">In stock count</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button color="primary" className="mt-4" onClick={handleAddQuantity}>Add Quantity</Button>
            </div>
          </div>
          <div className="flex justify-end py-4 px-6 gap-2">
            <Button color="primary" onClick={handleSubmit}>Submit</Button>
            <Button color="secondary" onClick={props.onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
