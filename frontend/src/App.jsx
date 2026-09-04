import { Routes, Route } from "react-router-dom";
import Checkout from "./pages/Checkout/Checkout";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home/Home";
import Gallery from "./pages/Gallery/Gallery";
import Cart from "./pages/Cart/Cart";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import MyOrders from "./pages/MyOrders/MyOrders";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import AdminOrders from "./pages/AdminOrders/AdminOrders";
import BackButton from "./components/BackButton/BackButton";

function App() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <BackButton />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/paintings/:category" element={<Gallery />} />

        <Route
          path="/cart"
          element={<Cart />}
        />
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />
        <Route
          path="/my-orders"
          element={<MyOrders />}
        />
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/order/:id"
          element={<OrderDetails />}
        />
<Route
  path="/admin-orders"
  element={<AdminOrders />}
/>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
