import React from 'react'
import ProductCard from './ProductCard'
import "./ShowAdminProducts.css"
import { useState,useEffect } from 'react'

const ShowAdminProducts = () => {
  const [products, setProducts] = useState(null);
  const [productsAvailable, setProductsAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch("http://127.0.0.1:8000/product/admin/show/",{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setProductsAvailable(true);
      }
      else{
        console.log("Error Fetching Products");
      }
    })();
  }, [])
  


  return (
    <div className="show-admin-products">
      {productsAvailable && products.map((product) => {
        return <ProductCard key={product.id} product={product} />;
      }
      )}
    </div>
  )
}

export default ShowAdminProducts
