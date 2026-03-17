import React, { useState, useEffect } from "react";
import { db } from "../../Firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Address.module.css";

const AddressModal = ({ isVisible, onClose, onSubmit, user }) => {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Jab modal khule aur user logged in ho, tab data fetch karo
  useEffect(() => {
    const fetchUserData = async () => {
      if (isVisible) {
        setValidationError("");
      }
      if (isVisible && user) {
        setLoading(true);
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const data = userSnap.data();
            setPhone(data.phone || "");
            setAddress(data.address || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isVisible, user]);

  if (!isVisible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setValidationError("Please Enter Valid Phone Number!");
      return;
    }
    if (address.trim().length < 5) {
      setValidationError("Please Enter Valid Address!");
      return;
    }
    setValidationError("");
    
    // Submit the data back to App.js
    onSubmit({ phone, address });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Delivery Details 🚚</h3>
        <p>Please confirm your details to ensure your order reaches the right location.</p>
        
        {validationError && (
          <p className={styles.errorMessage}>{validationError}</p>
        )}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>WhatsApp Number</label>
              <input 
                type="number" 
                placeholder="9888XXXXXX" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Full Address</label>
              <textarea 
                placeholder="Shop Name, Street, City, Pincode" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                required 
              />
            </div>

            <div className={styles.btns}>
              <button type="button" onClick={onClose} className={styles.cancel}>
                Cancel
              </button>
              <button type="submit" className={styles.submit}>
                Confirm & Order
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddressModal;
