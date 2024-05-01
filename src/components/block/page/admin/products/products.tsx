import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchInsideTryCatch } from "@/lib/client/apiUtil";
import { Product } from "@/types/client/types";
import AdminProductCard from "./adminProductCard";

const ProductsComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchAllProducts = async () => {
    try {
      console.log("Fetching products...");
      const response = await fetchInsideTryCatch<Product[]>(
        `api/admin/products`
      );

      if (response && response.response.data) {
        console.log(response.response.data);
        setProducts(response.response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  const addNewProduct = async () => {
    console.log("Add new product");

  }
  useEffect(() => {
    fetchAllProducts();
  }, []);
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <Button color="primary" style={{ marginRight: '0.5rem', marginTop: '0.5rem' }} onClick={() => addNewProduct()}>
          Add New Product
        </Button>
        <Button color="primary" style={{ marginTop: '0.5rem' }}>
          Add New Category
        </Button>
      </div>
      <div style={{ height: '800px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px', padding: '8px' }}>
          {products.map((product, index) => (
            <AdminProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
  
  
  
};

export default ProductsComponent;
