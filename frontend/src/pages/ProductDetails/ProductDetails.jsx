import { useParams, useNavigate } from "react-router-dom";
import { products } from "../../data/products";
import { useCart } from "../../context/CartContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    addToCart,
    isInCart
  } = useCart();

  const product = products.find(
    (item) => item.id === id
  );

  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Product Not Found</h1>
      </div>
    );
  }

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        type: "single",
        product,
      },
    });
  };

  return (
    <div className="product-details-page">

      <div className="product-details-container">

        <div className="product-details-image">
          <img
            src={product.image}
            alt={product.title}
          />
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
            <div className="feature">
              ✓ Premium Quality Materials
            </div>

            <div className="feature">
              ✓ Handcrafted Artwork
            </div>

            <div className="feature">
              ✓ Custom Personalization
            </div>

            <div className="feature">
              ✓ Secure Packaging
            </div>

            <div className="feature">
              ✓ Fast Delivery
            </div>
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

      <div className="reviews-section">

        <h2>Customer Reviews</h2>

        <div className="review-card">
          <div className="review-top">
            <h4>Rahul Sharma</h4>
            <span>★★★★★</span>
          </div>

          <p>
            Amazing quality artwork. The final
            painting looked even better than
            expected.
          </p>
        </div>

        <div className="review-card">
          <div className="review-top">
            <h4>Neha Verma</h4>
            <span>★★★★★</span>
          </div>

          <p>
            Beautiful painting and very premium
            packaging. Worth every rupee.
          </p>
        </div>

        <div className="write-review">

          <h3>Write A Review</h3>

          <textarea
            placeholder="Share your experience..."
          />

          <button className="submit-review-btn">
            Submit Review
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;