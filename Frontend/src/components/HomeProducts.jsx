import React from "react";
import { useEffect, useState, useRef } from "react";
import "./ProductCard";
import "./HomeProducts.css";

const HomeProducts = () => {
  const [loadingMore, setLoadingMore] = useState(false);
  const [productListState, setProductListState] = useState([]);
  const lastProductRef = useRef(null);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    loadInitialProducts();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const loadInitialProducts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/product/random/50");
      const data = await response.json();
      setProductListState(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadMoreProducts = async () => {
    try {
      setLoadingMore(true);
      let formdata = new FormData();
      formdata.append("productList", productListState);
      console.log(productListState);
      const response = await fetch(
        "http://127.0.0.1:8000/product/random/more/20/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: formdata,
        }
      );
      // const response = await axios.post(
      //   "http://127.0.0.1:8000/product/random/more/20/",formdata,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // )
      const newData = await response.json();
      // const newData = response.data;
      setProductListState((prevProductList) => [
        ...prevProductList,
        ...newData,
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = () => {
    if (lastProductRef.current && !loadingMore) {
      const lastProductOffset =
        lastProductRef.current.offsetTop + lastProductRef.current.clientHeight;
      const pageOffset = window.pageYOffset + window.innerHeight;
      const bottomOffset = 20; // Adjust this value to fine-tune when to load more

      if (pageOffset > lastProductOffset - bottomOffset) {
        // Use debounce to prevent multiple rapid calls
        if (!debounceTimeout.current) {
          debounceTimeout.current = setTimeout(() => {
            loadMoreProducts();
            debounceTimeout.current = null; // Reset debounce timeout after function execution
          }, 500); // Adjust debounce delay (milliseconds)
        }
      }
    }
  };

  return (
    <>
      <div className="homepageProducts">
        <h1>Products</h1>
        <div className="products">
          {productListState.length !== 0 ? (
            productListState.map((product, index) => (
              <div
                className="product"
                key={product.pid}
                ref={
                  index === productListState.length - 1 ? lastProductRef : null
                }
                onClick={(e) => {
                  window.open(`/product/${product.pid}`, "_blank");
                }}
                style={{ cursor: "pointer" }}
              >
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
            // <div>Loading...</div>
            <div>
              <div class="home-loader-container">
                <div class="dot dot-1"></div>
                <div class="dot dot-2"></div>
                <div class="dot dot-3"></div>
              </div>

              <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="goo">
                    <feGaussianBlur
                      result="blur"
                      stdDeviation="10"
                      in="SourceGraphic"
                    ></feGaussianBlur>
                    <feColorMatrix
                      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
                      mode="matrix"
                      in="blur"
                    ></feColorMatrix>
                  </filter>
                </defs>
              </svg>
            </div>
          )}
        </div>
        {loadingMore && <p>Loading more Products...</p>}
      </div>
    </>
  );
};

export default HomeProducts;
