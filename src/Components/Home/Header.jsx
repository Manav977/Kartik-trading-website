import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import Logo from "../../assets/Logo";
import { auth } from "../../Firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";

const Header = ({ cartCount, onCartClick, onLoginClick, onSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  const navigate = useNavigate();
  const location = useLocation();

  // Admin Emails List
  const ADMIN_EMAILS = [
    "manavnasra8080@gmail.com",
    "kartiktradingcompany@gmail.com",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    onSearch(value);
    if (value.length > 0 && location.pathname !== "/products") {
      navigate("/products");
    }
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Check if current user is admin
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);

  return (
    <Fragment>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          
          {/* Logo */}
          <div className={styles.logo}>
            <Link to="/" onClick={closeMenu}>
              <Logo className={styles.logo}/>
            </Link>
          </div>

          {/* Search Bar */}
          <div className={styles.searchSection}>
            <div className={styles.searchWrapper}>
              <input 
                type="text" 
                placeholder="Search wholesale products..." 
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              <button className={styles.searchBtn}>🔍</button>
            </div>
          </div>

          {/* Desktop Section */}
          <div className={styles.rightSection}>
            <div className={styles.desktopUser}>
              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={styles.userGreet}>
                    Hi, {currentUser.displayName || "Partner"} 👋
                  </span>
                </div>
              ) : (
                <button className={styles.loginLink} onClick={onLoginClick}>
                  Login / Signup
                </button>
              )}
            </div>

            <div className={styles.cartIconWrapper} onClick={onCartClick}>
              <span className={styles.mainIcon}>🛒</span>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </div>

            <button className={styles.hamburger} onClick={() => setIsMobileMenuOpen(true)}>
              <span className={styles.hamburgerIcon}>☰</span>
            </button>
          </div>
        </div>

        {/* Side Menu Drawer (Mobile/Hamburger) */}
        <div className={`${styles.sideMenu} ${isMobileMenuOpen ? styles.active : ""}`}>
          <div className={styles.menuTop}>
            <h3>MENU</h3>
            <button className={styles.closeMenu} onClick={closeMenu}>✕</button>
          </div>
          
          <div className={styles.menuLinks}>
            {currentUser && (
              <div className={styles.mobileUserInfo}>
                <p>Welcome, </p>
                <span style={{fontWeight: 'bold', color: '#002147'}}>{currentUser.displayName || "Partner"} 👋</span> 
                <hr />
              </div>
            )}

            <Link to="/" onClick={closeMenu}>🏠 Home</Link>
            <Link to="/products" onClick={closeMenu}>🛍️ Products</Link>
            <Link to="/about" onClick={closeMenu}>ℹ️ About Us</Link>
            <Link to="/contact" onClick={closeMenu}>📞 Contact</Link>
            
            {/* --- ADMIN PANEL LINK (Only for Admins) --- */}
            {isAdmin && (
              <Link 
                to="/admin-secret-panel" 
                onClick={closeMenu} 
                style={{ color: '#d35400', fontWeight: 'bold' }}
              >
                🛠️ Admin Panel
              </Link>
            )}

            <hr />
            
            {currentUser ? (
              <button 
                className={styles.authBtn} 
                onClick={() => { handleLogout(); closeMenu(); }}
              >
                🚪 Logout
              </button>
            ) : (
              <button className={styles.authBtn} onClick={() => { onLoginClick(); closeMenu(); }}>
                👤 Login / Sign Up
              </button>
            )}
          </div>
        </div>

        {isMobileMenuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
      </nav>
    </Fragment>
  );
};

export default Header;