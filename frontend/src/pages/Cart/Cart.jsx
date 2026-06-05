import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const total = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        type: "cart",
        items: cartItems,
        total,
      },
    });
  };

  return (
    <div className="cart-page">

      <div className="cart-header">
        <span>YOUR SELECTIONS</span>
        <h1>Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your Cart Is Empty</h2>
          <p>
            Add some beautiful artwork
            to get started.
          </p>
        </div>
      ) : (
        <>
          <div className="cart-items">

            {cartItems.map((item) => (
              <div
                className="cart-item"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.title}
                />

                <div className="cart-info">

                  <h3>{item.title}</h3>

                  <p className="item-price">
                    ₹{item.price}
                  </p>

                  <p className="item-total">
                    Total :
                    ₹
                    {item.price *
                      item.quantity}
                  </p>

                </div>

                <div className="quantity-box">

                  <button
                    onClick={() =>
                      decreaseQty(item.id)
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQty(item.id)
                    }
                  >
                    +
                  </button>

                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  Remove
                </button>

              </div>
            ))}

          </div>

          <div className="cart-summary">

            <div className="summary-top">
              <h2>
                Total Amount
              </h2>

              <h1>
                ₹{total}
              </h1>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Proceed To Checkout →
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default Cart;