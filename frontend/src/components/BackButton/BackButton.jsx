import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./BackButton.css";

function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") {
    return null;
  }

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  return (
    <div className="page-back-button-wrap">
      <button
        type="button"
        className="checkout-back-btn"
        onClick={handleBack}
        aria-label="Go back"
      >
        <FaArrowLeft />
        Back
      </button>
    </div>
  );
}

export default BackButton;
