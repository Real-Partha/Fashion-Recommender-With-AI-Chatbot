import React from 'react'
import "./ShowAdminProducts.css"
import { useState,useEffect } from 'react'
import AdminProductCard from './AdminProductCard'

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
        return <AdminProductCard key={product.pid} product={product} />;
      }
      )}
      {productsAvailable && products.length === 0 && (
        <h2>No Products Available</h2>
      )}
    </div>
  )
}

export default ShowAdminProducts
