import React from "react";
import { useEffect } from "react";
import "./ProductCard";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
// import "./HomeProducts.css";
import { useDispatch } from "react-redux";
// import styled from 'styled-components';
import { setProductList } from "../redux/ProductList/productList";
import {
  MDBRow,
  MDBContainer,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRipple,
} from "mdb-react-ui-kit";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';


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
  return (
    <MDBContainer fluid className="my-5 text-center">
      <MDBRow>
        {productList.length !== 0 ? (
          productList.map((product, index) => (
            <MDBCol md="6" lg="4" className="mb-4">
              <MDBCard onClick={(e)=>{window.open(`/product/${product.pid}`, "_blank");}} style={{cursor:"pointer"}}>
                <MDBRipple
                  // rippleColor="light"
                  rippleTag="div"
                  className="bg-image rounded hover-zoom"
                >
                  <MDBCardImage
                    src={product.imglink}
                    fluid
                    className="w-100"
                    style={{ height: "300px", objectFit: "contain" }}
                  />
                    <div className="mask">
                      <div class="d-flex justify-content-start align-items-end h-100">
                        <h5>
                          <span className="badge bg-danger ms-2">
                            -{product.discount}%
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div className="hover-overlay">
                      <div
                        className="mask"
                        style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                      ></div>
                    </div>
                </MDBRipple>
                <MDBCardBody>
                    <h5
                      className="card-title mb-3"
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                      title={product.name}
                    >
                      {product.name}
                    </h5>{" "}
                  
                  <h6 className="mb-3">
                    <s>₹{product.ofprice}</s>
                    <strong className="ms-2 text-danger">
                      ₹{product.price}
                    </strong>
                  </h6>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </MDBRow>
    </MDBContainer>
  );
};

export default HomeProducts;
