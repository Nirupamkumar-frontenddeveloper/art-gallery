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

        <div className="footer-contact">
          <h3>Contact</h3>

          <p>Artionary.support@gmail.com</p>
          <p>+91 8796523785</p>
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