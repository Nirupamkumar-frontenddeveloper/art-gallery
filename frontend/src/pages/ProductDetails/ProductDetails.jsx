import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../context/productStore";
import { useCart } from "../../context/CartContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const { products, isLoadingProducts } = useProducts();
  const navigate = useNavigate();
  const [showImage, setShowImage] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const { addToCart, isInCart } = useCart();

  const product = products.find((item) => item.id === id);

  if (isLoadingProducts && !product) {
    return (
      <div className="product-not-found">
        <h1>Loading Product...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Product Not Found</h1>
      </div>
    );
  }

  const productImages = product.images?.length ? product.images : [product.image];
  const selectImage = (index) => setActiveImage((index + productImages.length) % productImages.length);
  const handleSwipeEnd = (event) => {
    if (touchStart === null) return;
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 40) selectImage(activeImage + (distance < 0 ? 1 : -1));
    setTouchStart(null);
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        type: "single",
        product,
      },
    });
  };

  const handleImageClick = () => {
    if (window.innerWidth > 768) {
      setShowImage(true);
    }
  };

  return (
    <div className="product-details-page">

      <div className="product-details-container">

        <div className="product-details-image">
          <div className="product-image-gallery" onTouchStart={(event) => setTouchStart(event.touches[0].clientX)} onTouchEnd={handleSwipeEnd}>
            <img src={productImages[activeImage]} alt={`${product.title} ${activeImage + 1}`} onClick={handleImageClick} />
            {productImages.length > 1 && <><button type="button" className="gallery-arrow gallery-arrow-left" onClick={() => selectImage(activeImage - 1)} aria-label="Previous image"><FaChevronLeft /></button><button type="button" className="gallery-arrow gallery-arrow-right" onClick={() => selectImage(activeImage + 1)} aria-label="Next image"><FaChevronRight /></button></>}
          </div>
          {productImages.length > 1 && <div className="product-image-thumbnails">{productImages.map((image, index) => <button type="button" className={index === activeImage ? "active" : ""} key={image} onClick={() => selectImage(index)} aria-label={`View image ${index + 1}`}><img src={image} alt="" loading="lazy" /></button>)}</div>}
        </div>

        <div className="product-details-content">

          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.title}</h1>

          <div className="product-price">
            ₹{product.price}
          </div>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-features">
            {product.features &&
              product.features.map((feat, idx) => (
                <div className="feature" key={idx}>
                  ✓ {feat}
                </div>
              ))}
          </div>

          <div className="product-buttons">

            {!isInCart(product.id) ? (
              <button
                className="add-cart-btn"
                onClick={() => addToCart(product)}
              >
                Add To Cart
              </button>
            ) : (
              <button
                className="add-cart-btn added-btn"
                disabled
              >
                Added To Cart ✓
              </button>
            )}

            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>

      {/* Full Screen Image Preview (Desktop Only) */}

      {showImage && (
        <div
          className="image-modal"
          onClick={() => setShowImage(false)}
        >
          <img
            src={productImages[activeImage]}
            alt={product.title}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="close-image"
            onClick={() => setShowImage(false)}
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}

export default ProductDetails;
