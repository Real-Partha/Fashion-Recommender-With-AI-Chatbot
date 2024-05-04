import React from "react";
import { useEffect } from "react";
import "./ProductCard";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setProductList } from "../redux/ProductList/productList";

import "./HomeProducts.css";


const HomeProducts = () => {
  const productList = useSelector((state) => state.productList.value);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/product/random/50");
        const data = await response.json();
        dispatch(setProductList(data));
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return(
    <>
    <div className="homepageProducts">
        <h1>Products</h1>
        <div className="products">
        {productList.length !== 0 ? (
          productList.map((product, index) => (
              <div className="product" key={product.pid} onClick={(e)=>{window.open(`/product/${product.pid}`, "_blank");}} style={{cursor:"pointer"}}>
                <img src={product.imglink} alt="product" />
                <h3 title={product.name}>{product.name.slice(0, 22)}...</h3>
                <div className="DisPrice">
                  <p>
                    ₹{product.ofprice} <del>₹{product.price}</del>
                  </p>
                  <p>{product.discount}%</p>
                </div>
              </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
        </div>
      </div>
      </>
  )
};

export default HomeProducts;
