import React from "react";
import { useEffect } from "react";
import "./ProductCard";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import "./HomeProducts.css";
import { useDispatch } from "react-redux";
import { setProductList } from "../redux/ProductList/productList";



const HomeProducts = () => {
  const productList = useSelector((state) => state.productList.value);
  const dispatch = useDispatch();
  

    useEffect(() => {
        (async () => {
            // Check if the user is already logged in
            try {
              const response = await fetch("http://127.0.0.1:8000/product/random/100");
              const data = await response.json();
              dispatch(setProductList(data))
            } catch (err) {
              console.log(err);
            }
          })();

    }, [])
    
  return (
    <div className="home-products-container">
      {productList.length !== 0?productList.map((product,index) => (
        <ProductCard key={index} product={product} />
      )):<div>Loading...</div>}
    </div>
  );
};

export default HomeProducts;
