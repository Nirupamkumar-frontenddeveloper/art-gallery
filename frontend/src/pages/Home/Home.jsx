import "./Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useProducts } from "../../context/productStore";
import { FaWhatsapp, FaStar } from "react-icons/fa";

function Home() {
  const { products } = useProducts();
  const bestSellers = products.filter((item) => item.bestSeller);

  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          "https://artionary-backend.onrender.com/api/reviews"
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !comment.trim()) return;

    try {
      const response = await axios.post(
        "https://artionary-backend.onrender.com/api/reviews",
        {
          name: name.trim(),
          rating,
          comment: comment.trim(),
        }
      );

      if (response.data.success) {
        setReviews((prev) => [
          response.data.review,
          ...prev,
        ]);

        setName("");
        setComment("");
        setRating(5);
        setHoverRating(0);
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert(
        error.response?.data?.message ||
        "Failed to submit review"
      );
    }
  };

  return (
    <>
      <a
        href="https://wa.me/918796523785?text=I%20want%20to%20buy"
        className="whatsapp-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp className="whatsapp-icon" />
        <span>PLACE YOUR ORDER NOW</span>
      </a>

      <section className="hero">
        <div className="hero-left">
          <h1>
            Crafting Memories
            <br />
            Celebrating Life.
          </h1>

          <p>
            Discover custom paintings,
            handcrafted gifts and beautiful
            artwork designed to transform
            your cherished moments into
            timeless keepsakes.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => {
                document
                  .querySelector(".featured-section")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
            >
              Explore Collection
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="https://res.cloudinary.com/dcbvuidqn/image/upload/v1788366402/ChatGPT_Image_Sep_2_2026_09_55_57_PM_qrydgd.png"
            alt="Artwork"
          />
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <span>OUR COLLECTIONS</span>
          <h2>Art For Every Memory</h2>
        </div>

        <div className="featured-grid">
          <Link
            to="/paintings/bookmarks"
            className="featured-card standard"
          >
            <img
              src="https://res.cloudinary.com/dcbvuidqn/image/upload/v1789218625/ChatGPT_Image_Sep_12_2026_06_31_48_PM_wdcpky.png"
              alt="Bookmarks"
            />
            <div className="featured-overlay">
              <div>
                <h3>Bookmarks</h3>
                <span className="art-btn collection-btn">
                  Explore Collection →
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/paintings/prints"
            className="featured-card"
          >
            <img
              src="https://res.cloudinary.com/dcbvuidqn/image/upload/v1789218616/ChatGPT_Image_Sep_12_2026_06_33_09_PM_bbys2o.png"
              alt="Prints"
            />
            <div className="featured-overlay">
              <div>
                <h3>Prints</h3>
                <span className="art-btn collection-btn">
                  Explore Collection →
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/paintings/journals"
            className="featured-card"
          >
            <img
              src="https://res.cloudinary.com/dcbvuidqn/image/upload/v1789218617/ChatGPT_Image_Sep_12_2026_06_35_04_PM_t0xduw.png"
              alt="Journals"
            />
            <div className="featured-overlay">
              <div>
                <h3>Journals</h3>
                <span className="art-btn collection-btn">
                  Explore Collection →
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/paintings/notepad"
            className="featured-card"
          >
            <img
              src="https://res.cloudinary.com/dcbvuidqn/image/upload/v1789218615/ChatGPT_Image_Sep_12_2026_06_36_01_PM_urh0v9.png"
              alt="Notepad"
            />
            <div className="featured-overlay">
              <div>
                <h3>Notepad</h3>
                <span className="art-btn collection-btn">
                  Explore Collection →
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/paintings/paintings"
            className="featured-card"
          >
            <img
              src="https://res.cloudinary.com/dcbvuidqn/image/upload/v1789218618/ChatGPT_Image_Sep_12_2026_06_37_05_PM_umphse.png"
              alt="Paintings"
            />
            <div className="featured-overlay">
              <div>
                <h3>Paintings</h3>
                <span className="art-btn collection-btn">
                  Explore Collection →
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/paintings/posters"
            className="featured-card"
          >
            <img
              src="https://res.cloudinary.com/dcbvuidqn/image/upload/v1789218620/ChatGPT_Image_Sep_12_2026_06_38_22_PM_izkgav.png"
              alt="Posters"
            />
            <div className="featured-overlay">
              <div>
                <h3>Posters</h3>
                <span className="art-btn collection-btn">
                  Explore Collection →
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/paintings/postcards"
            className="featured-card"
          >
            <img
              src="https://res.cloudinary.com/dcbvuidqn/image/upload/v1789218616/ChatGPT_Image_Sep_12_2026_06_39_41_PM_erhu0n.png"
              alt="Postcards"
            />
            <div className="featured-overlay">
              <div>
                <h3>Postcards</h3>
                <span className="art-btn collection-btn">
                  Explore Collection &rarr;
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="best-selling-section">
        <div className="best-selling-heading">
          <span>BEST SELLERS</span>
          <h2>Customer Favorites</h2>
        </div>

        <div className="products-grid">
          {bestSellers.map((product) => (
            <div
              className="product-card"
              key={product.id}
            >
              <img
                src={product.image}
                alt={product.title}
              />

              <div className="product-content">
                <h3>{product.title}</h3>
                <p>
                  Starting from ₹{product.price}
                </p>

                <Link
                  to={`/product/${product.id}`}
                  className="art-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="why-section">
        <div className="why-heading">
          <span>WHY CHOOSE US</span>
          <h2>More Than Just Art</h2>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-number">01</div>
            <h3>Handcrafted</h3>
            <p>
              Every artwork is carefully crafted
              with attention to detail and artistic
              excellence.
            </p>
          </div>

          <div className="why-card">
            <div className="why-number">02</div>
            <h3>Personalized</h3>
            <p>
              Custom creations designed around your
              memories, stories and special moments.
            </p>
          </div>

          <div className="why-card">
            <div className="why-number">03</div>
            <h3>Premium Quality</h3>
            <p>
              High-quality materials and printing
              techniques ensure lasting beauty.
            </p>
          </div>

          <div className="why-card">
            <div className="why-number">04</div>
            <h3>Fast Delivery</h3>
            <p>
              Safe packaging and reliable shipping
              right to your doorstep.
            </p>
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="testimonial-heading">
          <span>TESTIMONIALS</span>
          <h2>What Our Customers Say</h2>
        </div>

        <div className="testimonial-grid">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                className="testimonial-card"
                key={review.id}
              >
                <div className="stars">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <FaStar
                        key={star}
                        className={
                          star <= review.rating
                            ? "review-star filled"
                            : "review-star"
                        }
                      />
                    )
                  )}
                </div>

                <p>{review.comment}</p>
                <h4>{review.name}</h4>
              </div>
            ))
          ) : (
            <p className="no-reviews">
              No reviews yet. Be the first to share
              your experience!
            </p>
          )}
        </div>

        <div className="review-form-wrapper">
          <h3>Share Your Experience</h3>

          <form
            className="review-form"
            onSubmit={handleReviewSubmit}
          >
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              required
            />

            <div className="rating-input">
              <span>Your Rating:</span>

              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <FaStar
                      key={star}
                      onClick={() =>
                        setRating(star)
                      }
                      onMouseEnter={() =>
                        setHoverRating(star)
                      }
                      onMouseLeave={() =>
                        setHoverRating(0)
                      }
                      className={
                        star <=
                        (hoverRating || rating)
                          ? "interactive-star active"
                          : "interactive-star"
                      }
                    />
                  )
                )}
              </div>
            </div>

            <button
              type="submit"
              className="review-submit-btn"
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Home;
