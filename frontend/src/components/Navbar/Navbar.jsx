import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingBag,
} from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="top-nav">

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="brand-section">
          <Link
            to="/"
            className="brand-link"
            onClick={() => setMenuOpen(false)}
          >
            <h1>ARTIONARY</h1>
          </Link>
        </div>

        <div className="desktop-icons">
          <FaSearch />

          <Link
            to="/cart"
            className="cart-icon"
            onClick={() => setMenuOpen(false)}
          >
            <FaShoppingBag />
          </Link>
        </div>

        <div className="mobile-icons">
          <FaSearch />

          <Link
            to="/cart"
            className="cart-icon"
            onClick={() => setMenuOpen(false)}
          >
            <FaShoppingBag />
          </Link>
        </div>

      </div>

      <nav
        className={`menu-links ${
          menuOpen ? "active" : ""
        }`}
      >
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>

        <Link
          to="/paintings/portrait"
          onClick={() => setMenuOpen(false)}
        >
          Paintings
        </Link>

        <Link
          to="/about"
          onClick={() => setMenuOpen(false)}
        >
          About
        </Link>

        <Link
          to="/my-orders"
          onClick={() => setMenuOpen(false)}
        >
          Orders
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;