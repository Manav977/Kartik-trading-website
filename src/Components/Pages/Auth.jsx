import React, { useRef, useState, useEffect } from "react";
import styles from "./Auth.module.css";
import { auth, googleProvider, db } from "../../Firebase";
import {
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const Auth = ({ isVisible, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const recaptchaVerifierRef = useRef(null);

  const resetAuthStates = () => {
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
    setShowOTP(false);
    setOtp("");
    setError("");
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isVisible) {
        onClose();
      }
    });
    return () => {
      unsubscribe();
      resetAuthStates();
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // FIXED: Ab agar user Firestore mein nahi bhi hoga, toh login block nahi karega
  const handleUserPersistence = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Naya user entry create karein agar database mein nahi hai
      await setDoc(userRef, {
        uid: user.uid,
        displayName: name || user.displayName || "Business Partner",
        email: email || user.email || "",
        city: city || "Not Specified",
        phoneNumber: user.phoneNumber,
        role: "retailer",
        createdAt: serverTimestamp(),
      });
    }
  };

  const setupRecaptcha = () => {
    if (recaptchaVerifierRef.current) return recaptchaVerifierRef.current;
    
    recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    return recaptchaVerifierRef.current;
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formattedPhone = `+91${phone}`;
      const appVerifier = setupRecaptcha();
      await appVerifier.render();

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setShowOTP(true);
    } catch (err) {
      console.error("OTP Error:", err);
      resetAuthStates();
      setError(err.code === "auth/too-many-requests" ? "Too many attempts. Try later." : "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      
      // Profile name update karein turant
      if (name) {
        await updateProfile(result.user, { displayName: name });
      }

      await handleUserPersistence(result.user);
      onClose();
      // Reload is necessary to force Header to catch the new state immediately
      window.location.reload(); 
    } catch (err) {
      console.error("Verify Error:", err);
      setError("Invalid OTP or Registration Error.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserPersistence(result.user);
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.authCard} onClick={(e) => e.stopPropagation()}>
        <div id="recaptcha-container"></div>
        
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>

        <h2>{isLogin ? "B2B Partner Login" : "Wholesale Registration"}</h2>
        <p className={styles.subtitle}>Kartik Trading Co. Business Dashboard</p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button onClick={handleGoogleLogin} className={styles.googleBtn} disabled={loading}>
          Continue with Google
        </button>

        <div className={styles.divider}><span>OR</span></div>

        {!showOTP ? (
          <form className={styles.authForm} onSubmit={sendOTP}>
            {!isLogin && (
              <>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input type="text" placeholder="Owner/Manager Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className={styles.gridInputs}>
                  <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input type="email" placeholder="business@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Business City</label>
                    <input type="text" placeholder="Location" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                </div>
              </>
            )}

            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <div className={styles.phoneInput}>
                <span>+91</span>
                <input type="tel" placeholder="XXXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Please wait..." : (isLogin ? "Send Login OTP" : "Register Business")}
            </button>
          </form>
        ) : (
          <form className={styles.authForm} onSubmit={verifyOTP}>
            <div className={styles.inputGroup}>
              <label>Verification Code</label>
              <input type="text" placeholder="6-digit OTP" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>Verify & Enter</button>
            <p className={styles.resendText} onClick={() => setShowOTP(false)}>
              Wrong number? <span>Edit</span>
            </p>
          </form>
        )}

        <p className={styles.toggleText}>
          {isLogin ? "New user?" : "Existing partner?"}
          <span onClick={() => { setIsLogin(!isLogin); setError(""); }}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
