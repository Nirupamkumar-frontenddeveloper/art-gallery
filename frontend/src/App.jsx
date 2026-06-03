import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home/Home";
import Gallery from "./pages/Gallery/Gallery";
import Cart from "./pages/Cart/Cart";
import ProductDetails from "./pages/ProductDetails/ProductDetails";



function App() {
  return (
    <>
      <Navbar />
 <ScrollToTop />
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
       
      </Routes>

      <Footer />
    </>
  );
}

export default App;