import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./routes/Home.jsx";
import Login from "./routes/Login.jsx";
import Signup from "./routes/Signup.jsx";
import Product from "./routes/Product.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import Orders from "./routes/Orders.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/product",
    element: <Product />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
