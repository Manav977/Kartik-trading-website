import React, { Fragment, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import Logo from "../../assets/Logo";

const Header = ({ cartCount, onCartClick, onLoginClick, user, onLogout, onSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    onSearch(value);
    if (value.length > 0 && location.pathname !== "/products") {
      navigate("/products");
    }
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

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

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Yeh wala part Mobile pe hide ho jayega (CSS se) */}
          <div className={styles.desktopUser}>
            {user ? (
              <span className={styles.userGreet} title="Click to Logout">
                Hi, {user.displayName || "User"} 👋
              </span>
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

      {/* Side Menu Drawer */}
      <div className={`${styles.sideMenu} ${isMobileMenuOpen ? styles.active : ""}`}>
        <div className={styles.menuTop}>
          <h3>MENU</h3>
          <button className={styles.closeMenu} onClick={closeMenu}>✕</button>
        </div>
        
        <div className={styles.menuLinks}>
          {/* Mobile User Greeting - Yeh sirf mobile menu mein dikhega */}
          {user && (
            <div className={styles.mobileUserInfo}>
              <p>Welcome, </p>
              <span>{user.displayName || "User"} 👋</span> 
              <hr />
            </div>
          )}

          <Link to="/" onClick={closeMenu}>🏠 Home</Link>
          <Link to="/products" onClick={closeMenu}>🛍️ Products</Link>
          <Link to="/about" onClick={closeMenu}>ℹ️ About Us</Link>
          <Link to="/contact" onClick={closeMenu}>📞 Contact</Link>
          <hr />
          
          {user ? (
            <button className={styles.logoutBtn} onClick={() => { onLogout(); closeMenu(); }}>
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