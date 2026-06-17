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
  const [menuOpen, setMenuOpen] =
    useState(false);

  const handleProductsClick = () => {
    setMenuOpen(false);

    if (
      window.location.pathname !==
      "/"
    ) {
      window.location.href = "/";
      return;
    }

    const section =
      document.querySelector(
        ".featured-section"
      );

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="navbar">

      <div className="navbar-container">

        <button
          className="mobile-menu-btn"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          {menuOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>

        <Link
          to="/"
          className="brand-link"
        >
          <div className="brand">

            <h1>Artionary</h1>

            <span className="brand-tagline">
              HANDCRAFTED • PERSONALIZED • PREMIUM
            </span>

          </div>
        </Link>

        <nav className="desktop-menu">

          <Link
            to="/"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Home
          </Link>

          <button
            className="nav-btn"
            onClick={
              handleProductsClick
            }
          >
            Products
          </button>

          <Link
            to="/about"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            About
          </Link>

          <Link
            to="/my-orders"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Orders
          </Link>

        </nav>

        <div className="desktop-icons">

          <FaSearch />

          <Link
            to="/cart"
            className="cart-icon"
          >
            <FaShoppingBag />
          </Link>

        </div>

        <div className="mobile-icons">

          <FaSearch />

          <Link
            to="/cart"
            className="cart-icon"
          >
            <FaShoppingBag />
          </Link>

        </div>

      </div>

      <nav
        className={`mobile-menu ${
          menuOpen
            ? "active"
            : ""
        }`}
      >

        <Link
          to="/"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          Home
        </Link>

        <button
          className="mobile-nav-btn"
          onClick={
            handleProductsClick
          }
        >
          Products
        </button>

        <Link
          to="/about"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          About
        </Link>

        <Link
          to="/my-orders"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          Orders
        </Link>

      </nav>

    </header>
  );
}

export default Navbar;