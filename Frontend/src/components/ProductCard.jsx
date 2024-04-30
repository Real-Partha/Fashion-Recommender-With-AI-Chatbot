// ProductCard.js
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card" onClick={(e)=>{window.open(`/product/${product.pid}`, "_blank");}}>
      <img className="product-image" src={product.imglink} alt={product.name} />
      <div className="product-details">
        <div className="product-name" title={product.name}>
          {product.name}
        </div>
        <div className="price-container">
          <div className="product-price">₹ {product.price}</div>
          <div className="product-discount">{product.discount}% off</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

// import React from "react";
// import {
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBRipple,
// } from "mdb-react-ui-kit";
// // import "./App.css";
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import "@fortawesome/fontawesome-free/css/all.min.css";
// const ProductCard = ({ product }) => {
//   const handleCardClick = () => {
//     window.open(`/product/${product.pid}`, "_blank");
//   };
//   return (
//         <MDBCol md="8" lg="4" className="mb-3">
//            <MDBCard onClick={handleCardClick} style={{width:"auto",height:"auto"}}>
//             <MDBRipple
//               // rippleColor="light"
//               rippleTag="div"
//               className="bg-image rounded hover-zoom"
//             >
//               <MDBCardImage
//                 src={product.imglink}
//                 fluid
//                 className="w-100"
//                 style={{ height: "auto", objectFit: "contain" }}
//               />
//               <a href="#!">
//                 <div className="mask">
//                   <div class="d-flex justify-content-start align-items-end h-100">
//                     <h5 style={{fontSize: "calc(1vw + 1vh)"}}>
//                       <span className="badge bg-danger ms-2">-{product.discount}%</span>
//                     </h5>
//                   </div>
//                 </div>
//                 <div className="hover-overlay">
//                   <div
//                     className="mask"
//                     style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
//                   ></div>
//                 </div>
//               </a>
//             </MDBRipple>
//             <MDBCardBody >
//               <a href="#!" className="text-reset"  >
// <h5 className="card-title mb-3" style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{product.name}</h5>              </a>
//               {/* <a href="#!" className="text-reset">
//                 <p>Category</p>
//               </a> */}
//               <h6 className="mb-3">
//                 <s>₹{product.ofprice}</s>
//                 <strong className="ms-2 text-danger">₹{product.price}</strong>
//               </h6>
//             </MDBCardBody>
//           </MDBCard>
//         </MDBCol>
//   );
// };

// export default ProductCard;
