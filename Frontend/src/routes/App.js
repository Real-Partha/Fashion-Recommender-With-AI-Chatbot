import React from "react";
import Product from "./Product";

const App = () => {
  return (
    <div>
      <Product productId={60090} imgLink="http://127.0.0.1:8000/product/60090/" />
      <Product productId={60091} imgLink="http://127.0.0.1:8000/product/60091/" />
    </div>
  );
};

export default App;
