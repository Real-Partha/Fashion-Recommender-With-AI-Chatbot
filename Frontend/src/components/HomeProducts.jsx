import React from "react";
import { useEffect } from "react";
import "./ProductCard";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
// import "./HomeProducts.css";
import { useDispatch } from "react-redux";
// import styled from 'styled-components';
import { setProductList } from "../redux/ProductList/productList";
// import {
//   MDBRow,
//   MDBContainer,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBRipple,
// } from "mdb-react-ui-kit";
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import "./homepage.css"
import "./HomeProducts.css";


const HomeProducts = () => {
  const productList = useSelector((state) => state.productList.value);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      // Check if the user is already logged in
      try {
        const response = await fetch("http://127.0.0.1:8000/product/random/50");
        const data = await response.json();
        dispatch(setProductList(data));
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // return (
  //   <div className="home-products-container">
  //     {productList.length !== 0?productList.map((product,index) => (
  //       <ProductCard key={index} product={product} />
  //     )):<div>Loading...</div>}
  //   </div>
  // );
  return(
    <>
    <div className="homepageProducts">
        <h1>Products</h1>
        <div className="products">
        {productList.length !== 0 ? (
          productList.map((product, index) => (
            // <Link className="text-link" to={/productDetail/${product.id}}>
              <div className="product" key={product.id}onClick={(e)=>{window.open(`/product/${product.pid}`, "_blank");}} style={{cursor:"pointer"}}>
                <img src={product.imglink} alt="product" />
                <h3 title={product.name}>{product.name.slice(0, 22)}...</h3>
                <div className="DisPrice">
                  <p>
                    ₹{product.ofprice} <del>₹{product.price}</del>
                  </p>
                  <p>{product.discount}%</p>
                </div>
              </div>
            // </Link>
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
