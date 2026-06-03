import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">

        <div className="footer-brand">
          <h2>ARTIONARY</h2>
          <p>
            Transforming memories into timeless
            works of art.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/paintings">Paintings</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="footer-links">
          <h3>Support</h3>

          <a href="/">FAQ</a>
          <a href="/">Shipping Policy</a>
          <a href="/">Privacy Policy</a>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>

          <p>support@artionary.com</p>
          <p>+91 98765 43210</p>
          <p>India</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Artionary. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;