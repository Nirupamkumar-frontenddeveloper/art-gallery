import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { products } from "../../data/products";
import "./Gallery.css";

function Gallery() {
  const { category } = useParams();

  const filteredProducts = products.filter(
    (item) => item.category === category
  );

  const categoryTitle =
    category?.charAt(0).toUpperCase() +
    category?.slice(1);

  return (
    <div className="gallery-page">

      <div className="gallery-hero">
        <span>ARTIONARY COLLECTION</span>

        <h1>
          {categoryTitle}
        </h1>

        <p>
          Discover handcrafted artwork created
          with passion and attention to detail.
        </p>
      </div>

      <div className="gallery-grid">

        {filteredProducts.map((item) => (
          <div
            className="gallery-card"
            key={item.id}
          >

            <div className="gallery-image">
              <img
                src={item.image}
                alt={item.title}
              />
            </div>

            <div className="gallery-content">

              <h3>{item.title}</h3>

              <p className="gallery-desc">
                {item.description}
              </p>

              <div className="gallery-bottom">

                <span>
                  ₹{item.price}
                </span>

                <Link
                  to={`/product/${item.id}`}
                  className="art-btn"
                >
                  View Details
                </Link>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Gallery;