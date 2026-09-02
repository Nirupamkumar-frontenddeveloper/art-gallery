import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CartContext = createContext();

export const CartProvider = ({
  children,
}) => {

  // Load cart from sessionStorage
  const [cartItems, setCartItems] =
    useState(() => {
      const savedCart =
        sessionStorage.getItem("cartItems");

      return savedCart
        ? JSON.parse(savedCart)
        : [];
    });

  // Save cart whenever cart changes
  useEffect(() => {
    sessionStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);


  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing =
        prevItems.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };


  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => item.id !== id
      )
    );
  };


  const increaseQty = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };


  const decreaseQty = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                item.quantity - 1,
                1
              ),
            }
          : item
      )
    );
  };


  const clearCart = () => {
    setCartItems([]);
    sessionStorage.removeItem(
      "cartItems"
    );
  };


  const isInCart = (id) => {
    return cartItems.some(
      (item) => item.id === id
    );
  };


  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () =>
  useContext(CartContext);