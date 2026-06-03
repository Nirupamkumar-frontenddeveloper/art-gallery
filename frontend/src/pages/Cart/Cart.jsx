import { useCart } from "../../context/CartContext";
import "./Cart.css";

function Cart() {
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

  return (
    <div className="cart-page">

      <div className="cart-header">
        <h1>Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          Your cart is empty
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
                  <p>₹{item.price}</p>
                </div>

                <div className="quantity-box">

                  <button
                    onClick={() =>
                      decreaseQty(item.id)
                    }
                  >
                    -
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

            <h2>
              Total : ₹{total}
            </h2>

            <button className="checkout-btn">
              Proceed To Checkout
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default Cart;