import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Product.css";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [productData, setProductData] = useState({});
  const [rating, setRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M"); // State to track the selected size
  const params = useParams();
  const productid = parseInt(params.productid);
  const [productFound, setProductFound] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [residenceType, setResidenceType] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [paymentType, setPaymentType] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/product/${productid}/`
        );

        const data = await response.json();
        if (response.ok) {
          setProductFound(true);
          setTimeout(() => {
            setProductData(data);
          }, 10);
        } else {
          navigate("/404");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, []);

  useEffect(() => {
    if (productData.name) {
      document.title = `${productData.name}`;
    }
  }, [productData]);

  const ProductRating = ({ rating, setRating }) => {
    const handleStarClick = (index) => {
      // Set the rating to the index of the clicked star + 1
      setRating(index + 1);
    };

    return (
      <div className="product-page-rating">
        Rating:
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star ${index < rating ? "filled" : ""}`}
            onClick={() => handleStarClick(index)}
          >
            &#9733;
          </span>
        ))}
      </div>
    );
  };

  const handleOrderSubmission = async (e) => {
    e.preventDefault();
    const total = productData.price;
    const product = productData;
    const response = await fetch("http://127.0.0.1:8000/orders/place/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        recipientName,
        address,
        state,
        pincode,
        residenceType,
        mobile,
        paymentType,
        product,
        total,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      navigate(`/order/${data.orderid}/`);
      // alert("Order placed successfully!");
    } else {
      alert("Order could not be placed!");
    }
  };

  // Function to handle size selection
  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const handleStarClick = () => {
    alert("Product added to cart!");
    navigator.clipboard.writeText("Product added to cart!");
  };

  const handlebuyClick = async () => {
    // alert("Product bought successfully!");
    const token = localStorage.getItem("token");
    if (token === null) {
      alert("Please login to buy the product!");
    } else {
      if (localStorage.getItem("tokentype") === "user") {
        const response = await fetch("http://127.0.0.1:8000/users/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setAuthenticated(true);
          document.title = "Place Order";
        } else if (
          data["detail"] === "Token has Expired" ||
          data["detail"] === "Not Authenticated"
        ) {
          alert(
            "Your session has expired. Please login again to buy the product!"
          );
        }
      } else {
        alert("Only users can buy the product!");
      }
    }
  };

  return (
    <div>
      {productFound && !authenticated && (
        <div className="product-page-container">
          <img src={productData.imglink} alt="" className="product-page-img" />
          <div className="product-details-scrollable">
            <div className="product-page-details">
              <div className="product-page-name">{productData.name}</div>
              <div className="product-page-ofprice">${productData.ofprice}</div>
              <div className="product-page-discount">
                {productData.discount}% Off
              </div>
              <div className="product-page-price">${productData.price}</div>

              <div className="product-page-size">
                <span className="size">Sizes: </span>
                <div className="selectSize">
                  {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map(
                    (size, index) => (
                      <div
                        key={index}
                        className={`eachSize ${selectedSize === size ? "activeSize" : ""
                          }`}
                        onClick={() => handleSizeSelection(size)}
                      >
                        <span>{size}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <ProductRating rating={rating} setRating={setRating} />

              <div className="product-page-buttons">
                <button className="add-to-cart-btn" onClick={handleStarClick}>
                  Add to Cart
                </button>
                <button className="buy-now-btn" onClick={handlebuyClick}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {authenticated && (
        <div className="product-order-data">
          <div
            className="product-back-button"
            onClick={(e) => {
              setAuthenticated(false);
              document.title = productData.name;
            }}
          >
            <img
              src="/back-button.png"
              alt="back"
              style={{ height: "50px", width: "50px" }}
            />
          </div>
          <form onSubmit={handleOrderSubmission} className="product-order-form">
            <div>
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="recipientName">Recipient Name:</label>
              <input
                type="text"
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="mobile">Phone Number:</label>
              <input
                type="text"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="residenceType">Residence Type:</label>
              <select
                id="residenceType"
                value={residenceType}
                onChange={(e) => setResidenceType(e.target.value)}
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Office</option>
              </select>
            </div>
            <div>
              <label htmlFor="pincode">Pincode:</label>
              <input
                type="text"
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="state">State:</label>
              <input
                type="text"
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div className="col-2">

            <div>
              <label htmlFor="paymentType">Payment Type:</label>
              <select
                id="paymentType"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="paypal">UPI</option>
                <option value="other">Internet Banking</option>
              </select>
            </div>
            <button type="submit">Submit</button>
          </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Product;
