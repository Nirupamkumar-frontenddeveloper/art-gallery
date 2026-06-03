import "./Home.css";
import { Link } from "react-router-dom";
import { products } from "../../data/products";

function Home() {
     const bestSellers = products.filter(
    (item) => item.bestSeller
  );
  return (
    <><><><section className="hero">
          <div className="hero-left">
              <span className="hero-subtitle">
                  HANDCRAFTED • PERSONALIZED • PREMIUM
              </span>

              <h1>
                  Crafting Memories,
                  <br />
                  Celebrating Life.
              </h1>

              <p>
                  Discover custom paintings, handcrafted gifts and
                  beautiful artwork designed to transform your
                  cherished moments into timeless keepsakes.
              </p>

              <div className="hero-buttons">
                  <button className="primary-btn">
                      Explore Collection
                  </button>

                  <button className="secondary-btn">
                      About Us
                  </button>
              </div>
          </div>

          <div className="hero-right">
              <img
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200"
                  alt="Artwork" />
          </div>
      </section>
      
      <section className="featured-section">
  <div className="section-heading">
    <span>OUR COLLECTIONS</span>
    <h2>Art For Every Memory</h2>
  </div>

  <div className="featured-grid">

    <Link
      to="/paintings/portrait"
      className="featured-card large"
    >
      <img
        src="https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=1200"
        alt=""
      />

      <div className="featured-overlay">
        <div>
          <h3>Portrait Art</h3>

          <span className="art-btn collection-btn">
            Explore Collection →
          </span>
        </div>
      </div>
    </Link>

    <Link
      to="/paintings/couple"
      className="featured-card"
    >
      <img
        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200"
        alt=""
      />

      <div className="featured-overlay">
        <div>
          <h3>Couple Art</h3>

          <span className="art-btn collection-btn">
            Explore Collection →
          </span>
        </div>
      </div>
    </Link>

    <Link
      to="/paintings/pet"
      className="featured-card"
    >
      <img
        src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1200"
        alt=""
      />

      <div className="featured-overlay">
        <div>
          <h3>Pet Portraits</h3>

          <span className="art-btn collection-btn">
            Explore Collection →
          </span>
        </div>
      </div>
    </Link>

    <Link
      to="/paintings/wedding"
      className="featured-card wide"
    >
      <img
        src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200"
        alt=""
      />

      <div className="featured-overlay">
        <div>
          <h3>Wedding Paintings</h3>

          <span className="art-btn collection-btn">
            Explore Collection →
          </span>
        </div>
      </div>
    </Link>

  </div>
</section>
</><section className="why-section">
              <div className="why-heading">
                  <span>WHY CHOOSE US</span>
                  <h2>More Than Just Art</h2>
              </div>

              <div className="why-grid">

                  <div className="why-card">
                      <div className="why-number">01</div>
                      <h3>Handcrafted</h3>
                      <p>
                          Every artwork is carefully crafted with attention
                          to detail and artistic excellence.
                      </p>
                  </div>

                  <div className="why-card">
                      <div className="why-number">02</div>
                      <h3>Personalized</h3>
                      <p>
                          Custom creations designed around your memories,
                          stories and special moments.
                      </p>
                  </div>

                  <div className="why-card">
                      <div className="why-number">03</div>
                      <h3>Premium Quality</h3>
                      <p>
                          High-quality materials and printing techniques
                          ensure lasting beauty.
                      </p>
                  </div>

                  <div className="why-card">
                      <div className="why-number">04</div>
                      <h3>Fast Delivery</h3>
                      <p>
                          Safe packaging and reliable shipping right to
                          your doorstep.
                      </p>
                  </div>

              </div>
          </section></><>
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
        The portrait exceeded my expectations.
        Every detail was beautifully captured.
      </p>
      <h4>Priya Sharma</h4>
    </div>

    <div className="testimonial-card">
      <div className="stars">★★★★★</div>
      <p>
        Perfect anniversary gift. The quality
        and packaging were outstanding.
      </p>
      <h4>Rahul Verma</h4>
    </div>

    <div className="testimonial-card">
      <div className="stars">★★★★★</div>
      <p>
        My pet portrait looks amazing. Highly
        recommended for custom artwork.
      </p>
      <h4>Neha Kapoor</h4>
    </div>

  </div>
</section>
          </>
    
  );
}

export default Home;