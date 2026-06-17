import "./Home.css";
import { Link } from "react-router-dom";
import { products } from "../../data/products";

function Home() {
  const bestSellers = products.filter((item) => item.bestSeller);
  return (
    <>
      <>
        <>
          <section className="hero">
            <div className="hero-left">
              

              <h1>
                Crafting Memories
                <br />
                Celebrating Life.
              </h1>

              <p>
                Discover custom paintings, handcrafted gifts and beautiful
                artwork designed to transform your cherished moments into
                timeless keepsakes.
              </p>

              <div className="hero-buttons">
                <button className="primary-btn">Explore Collection</button>

                <button className="secondary-btn">About Us</button>
              </div>
            </div>

            <div className="hero-right">
              <img
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200"
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
              <Link to="/paintings/portrait" className="featured-card large">
                <img
                  src="https://res.cloudinary.com/dcbvuidqn/image/upload/v1781717653/Book_marks_vxvxc8.jpg"
                  alt=""
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

              <Link to="/paintings/couple" className="featured-card">
                <img
                  src="https://res.cloudinary.com/dcbvuidqn/image/upload/v1781717651/planner_qkgtr8.jpg"
                  alt=""
                />

                <div className="featured-overlay">
                  <div>
                    <h3>Planners</h3>

                    <span className="art-btn collection-btn">
                      Explore Collection →
                    </span>
                  </div>
                </div>
              </Link>

              <Link to="/paintings/pet" className="featured-card">
                <img
                  src="https://res.cloudinary.com/dcbvuidqn/image/upload/v1781717650/journal2_zpzrxc.jpg"
                  alt=""
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

              <Link to="/paintings/wedding" className="featured-card wide">
                <img
                  src="https://res.cloudinary.com/dcbvuidqn/image/upload/v1781717652/Notepad_2_b82dme.jpg"
                  alt=""
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
            </div>
          </section>
        </>
        <>
        <section className="best-selling-section">
          <div className="best-selling-heading">
            <span>BEST SELLERS</span>
            <h2>Customer Favorites</h2>
          </div>

          <div className="products-grid">
            {bestSellers.map((product) => (
              <div className="product-card" key={product.id}>
                <img src={product.image} alt={product.title} />

                <div className="product-content">
                  <h3>{product.title}</h3>

                  <p>Starting from ₹{product.price}</p>

                  <Link to={`/product/${product.id}`} className="art-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
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
                Every artwork is carefully crafted with attention to detail and
                artistic excellence.
              </p>
            </div>

            <div className="why-card">
              <div className="why-number">02</div>
              <h3>Personalized</h3>
              <p>
                Custom creations designed around your memories, stories and
                special moments.
              </p>
            </div>

            <div className="why-card">
              <div className="why-number">03</div>
              <h3>Premium Quality</h3>
              <p>
                High-quality materials and printing techniques ensure lasting
                beauty.
              </p>
            </div>

            <div className="why-card">
              <div className="why-number">04</div>
              <h3>Fast Delivery</h3>
              <p>
                Safe packaging and reliable shipping right to your doorstep.
              </p>
            </div>
          </div>
        </section>
      </>

      
      <section className="testimonial-section">
        <div className="testimonial-heading">
          <span>TESTIMONIALS</span>
          <h2>What Our Customers Say</h2>
        </div>

        <div className="testimonial-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>
              The portrait exceeded my expectations. Every detail was
              beautifully captured.
            </p>
            <h4>Priya Sharma</h4>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>
              Perfect anniversary gift. The quality and packaging were
              outstanding.
            </p>
            <h4>Rahul Verma</h4>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>
              My pet portrait looks amazing. Highly recommended for custom
              artwork.
            </p>
            <h4>Neha Kapoor</h4>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
