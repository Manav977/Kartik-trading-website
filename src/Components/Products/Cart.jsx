import React from "react";
import styles from "./Cart.module.css";

// Props mein onCheckout add kiya hai
const Cart = ({ cart, setCart, isOpen, toggleCart, onCheckout }) => {
  
  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Safe Total Calculation
  const totalAmount = (cart || []).reduce(
    (sum, item) => sum + (parseFloat(item.price || 0) * (item.quantity || 1)),
    0
  );

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.activeOverlay : ""}`}
        onClick={toggleCart}
      ></div>
      
      <div className={`${styles.cartDrawer} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h2>My Order</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={(e) => {
              e.stopPropagation();
              toggleCart();
            }}
          >
            ✕
          </button>
        </div>

        <div className={styles.cartContent}>
          {!cart || cart.length === 0 ? (
            <div className={styles.empty}>
              <p>Your Cart is Empty</p>
              <button onClick={toggleCart} className={styles.shopBtn}>
                Shop Now
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id || Math.random()} className={styles.cartItem}>
                <img
                  src={item.image || "https://via.placeholder.com/50"}
                  alt={item.title}
                  className={styles.cartImg}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                />
                <div className={styles.details}>
                  <h4>{item.title || "Product"}</h4>
                  <p className={styles.itemPrice}>₹{item.price || 0}</p>
                  <div className={styles.controls}>
                    <button onClick={() => updateQty(item.id, -1)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
                <button
                  className={styles.removeIcon}
                  onClick={() => removeItem(item.id)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {cart && cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalSection}>
              <span>Total:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <button
              className={styles.checkoutBtn}
              onClick={() => onCheckout && onCheckout()} // Correct function call
            >
              Order on WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;