import React, { useState, useEffect } from "react";
import styles from "./Auth.module.css";
import { auth, googleProvider } from "../../Firebase";
import {
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
} from "firebase/auth";

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

  useEffect(() => {
    if (isVisible && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => setError(""),
          "expired-callback": () => setError("reCAPTCHA expired, please try again."),
        });
      } catch (err) {
        console.error("Recaptcha init error:", err);
      }
    }
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const sendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && (!name || !email || !city)) {
      setError("Please fill all details.");
      return;
    }
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit number.");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = `+91${phone}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowOTP(true);
    } catch (err) {
      setError(err.code === "auth/too-many-requests" ? "Too many requests. Wait a bit." : "Error sending OTP.");
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
      if (!isLogin && name) {
        await updateProfile(result.user, { displayName: name });
      }
      onClose();
    } catch (err) {
      setError("Wrong OTP! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.authCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className={styles.subtitle}>Enter details to access Kartik Trading dashboard</p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button onClick={() => signInWithPopup(auth, googleProvider).then(onClose)} className={styles.googleBtn}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
          </svg>
          Continue with Google
        </button>

        <div className={styles.divider}><span>OR</span></div>

        {!showOTP ? (
          <form className={styles.authForm} onSubmit={sendOTP}>
            {!isLogin && (
              <>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className={styles.gridInputs}>
                  <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input type="email" placeholder="mail@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>City</label>
                    <input type="text" placeholder="Chandigarh" value={city} onChange={(e) => setCity(e.target.value)} required />
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
              {loading ? "Please wait..." : (isLogin ? "Get Login OTP" : "Register & Get OTP")}
            </button>
            {/* Hidden Recaptcha Div */}
            <div id="recaptcha-container"></div>
          </form>
        ) : (
          <form className={styles.authForm} onSubmit={verifyOTP}>
            <div className={styles.inputGroup}>
              <label>OTP Code</label>
              <input type="text" placeholder="6-digit code" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>Verify Now</button>
            <p className={styles.resendText} onClick={() => setShowOTP(false)}>Wrong number? <span>Change</span></p>
          </form>
        )}

        <p className={styles.toggleText}>
          {isLogin ? "New user?" : "Already joined?"}
          <span onClick={() => { setIsLogin(!isLogin); setShowOTP(false); setError(""); }}>
            {isLogin ? " Create Account" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;