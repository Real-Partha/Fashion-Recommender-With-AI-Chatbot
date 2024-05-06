import React from "react";
import { useEffect, useState, useRef } from "react";
import "./ProductCard";
import "./HomeProducts.css";
import { useSelector } from "react-redux";

const HomeProducts = ({ isRecommendedProduct }) => {
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [productListState, setProductListState] = useState([]);
  const lastProductRef = useRef(null);
  const debounceTimeout = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultQuery, setResultQuery] = useState("");
  const [resultRetrieved, setResultRetrieved] = useState(false);
  let mydata = [];
  const productList = useSelector((state) => state.productList.value);

  useEffect(() => {
    loadInitialProducts();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setResultRetrieved(false);
    setResultQuery("");
    if (productList.length !== 0) {
      const shuffledList = [...productList].sort(() => Math.random() - 0.5);
      setProductListState(shuffledList);
      // setProductListState(productList);
    }
  }, [productList]);

  const loadInitialProducts = async () => {
    try {
      setResultRetrieved(false);
      setResultQuery("");
      const response = await fetch("http://127.0.0.1:8000/product/random/50");
      const data = await response.json();
      setLoading(false);
      setProductListState(data);
      mydata = data;
    } catch (err) {
      console.log(err);
    }
  };

  const loadMoreProducts = async () => {
    try {
      if (!resultRetrieved) {
        setLoadingMore(true);
        const response = await fetch(
          "http://127.0.0.1:8000/product/random/more/20/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mydata),
          }
        );
        const newData = await response.json();
        mydata = [...mydata, ...newData];
        setProductListState((prevProductList) => [
          ...prevProductList,
          ...newData,
        ]);
      }
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

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      setSearchLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/product/search/${searchQuery}`
      );
      const searchData = await response.json();
      setResultQuery(searchQuery);
      setSearchQuery("");
      setProductListState(searchData);
      setResultRetrieved(true);
      setSearchLoading(false);
    } catch (error) {
      console.error("Error searching for products:", error);
    }
  };

  return (
    <>
      {!loading && (
        <div className="home-search">
          <form onSubmit={handleSearch}>
            <div className="inputBox_container">
              <svg
                className="search_icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                alt="search icon"
              >
                <path d="M46.599 46.599a4.498 4.498 0 0 1-6.363 0l-7.941-7.941C29.028 40.749 25.167 42 21 42 9.402 42 0 32.598 0 21S9.402 0 21 0s21 9.402 21 21c0 4.167-1.251 8.028-3.342 11.295l7.941 7.941a4.498 4.498 0 0 1 0 6.363zM21 6C12.717 6 6 12.714 6 21s6.717 15 15 15c8.286 0 15-6.714 15-15S29.286 6 21 6z"></path>
              </svg>
              <input
                className="inputBox"
                id="inputBox"
                type="text"
                placeholder="Search For Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <div className="search-result-query">
            {resultRetrieved && <div>Showing results for "{resultQuery}"</div>}
          </div>
        </div>
      )}
      {searchLoading && (
        <div className="search-loader">
          <div class="loader">
            <div class="loaderMiniContainer">
              <div class="barContainer">
                <span class="bar"></span>
                <span class="bar bar2"></span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 101 114"
                class="svgIcon"
              >
                <circle
                  stroke-width="7"
                  stroke="black"
                  transform="rotate(36.0692 46.1726 46.1727)"
                  r="29.5497"
                  cy="46.1727"
                  cx="46.1726"
                ></circle>
                <line
                  stroke-width="7"
                  stroke="black"
                  y2="111.784"
                  x2="97.7088"
                  y1="67.7837"
                  x1="61.7089"
                ></line>
              </svg>
            </div>
          </div>
        </div>
      )}
      {!searchLoading && (
        <div className="homepageProducts">
          <div className="products">
            {productListState.length !== 0 ? (
              productListState.map((product, index) => (
                <div
                  className="product"
                  key={product.pid}
                  ref={
                    index === productListState.length - 1
                      ? lastProductRef
                      : null
                  }
                  onClick={(e) => {
                    window.open(`/product/${product.pid}`, "_blank");
                  }}
                  style={{ cursor: "pointer",position:"relative" }}
                >
                  <img src={product.imglink} alt="product" />
                  <span className="home-products-discount" style={{position:"absolute",top:"0",left:"0"}}>
                      - {Math.floor(product.discount)}%
                    </span>
                  <h3
                    title={product.name}
                    style={{
                      width: "80%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.name}
                  </h3>
                  <div className="price-details">
                    <span style={{margin:"10px"}}>₹{Math.ceil(product.price)}</span>
                    <del>₹{Math.ceil(product.ofprice)}</del>
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
      )}
    </>
  );
};

export default HomeProducts;
