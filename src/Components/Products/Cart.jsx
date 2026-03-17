import React from "react";
import styles from "./Cart.module.css";

const Cart = ({ 
  cart, 
  setCart, 
  isOpen, 
  toggleCart, 
  onCheckout, 
  userAddress, // Ye prop App.js se aa raha hai
  setShowAddressModal 
}) => {
  
  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

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
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={item.image || "https://via.placeholder.com/50"}
                  alt={item.title}
                  className={styles.cartImg}
                />
                <div className={styles.details}>
                  <h4>{item.title || "Product"}</h4>
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
            {/* --- ADDRESS SECTION FIXED --- */}
            <div className={styles.addressSection}>
              <div className={styles.addressText}>
                <span className={styles.deliverLabel}>Deliver to:</span>
                {/* Yahan condition check ho rahi hai */}
                <p className={styles.actualAddress}>
                   {userAddress && userAddress.trim() !== "" 
                    ? userAddress 
                    : "No address added yet"}
                </p>
              </div>
              <button 
                className={styles.changeAddressBtn}
                onClick={() => setShowAddressModal(true)}
              >
                {userAddress ? "Change" : "Add"}
              </button>
            </div>

            <button
              className={styles.checkoutBtn}
              onClick={() => onCheckout && onCheckout()}
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