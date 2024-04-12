import React, { useState, useEffect } from "react";

const Product = () => {
  const [productData, setProductData] = useState({}); // To store the product data

  useEffect(() => {
    (async () => {
      const response = await fetch("http://127.0.0.1:8000/product/19577/");
      const data = await response.json();
      setTimeout(() => {
        setProductData(data);
      }, 200);
      console.log(data);
    })();
  }, []);

  return <div>{productData["name"]}</div>;
};

export default Product;
