import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./Firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";

// Components
import Navbar from "./Components/Home/Header";
import Products from "./Components/Products/Products";
import Contact from "./Components/Pages/Contact";
import Home from "./Components/Pages/Home";
import About from "./Components/About/About";
import Cart from "./Components/Products/Cart";
import Auth from "./Components/Pages/Auth"; // Login Modal import kiya

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  
  // Login Popup Control
  const [showAuth, setShowAuth] = useState(false);

  // Auth Observer - Monitor Login/Logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setShowAuth(false); // Login hote hi popup band ho jaye
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  // Safe Add to Cart Logic
  const addToCartHandler = (product) => {
    if (!product || !product.id) return;

    setCart((prevCart) => {
      const safeCart = Array.isArray(prevCart) ? prevCart : [];
      const existingItem = safeCart.find((item) => item.id === product.id);

      if (existingItem) {
        return safeCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...safeCart, { ...product, quantity: 1 }];
    });
  };

  // WhatsApp Checkout Logic
  const handleWhatsAppCheckout = () => {
    if (!cart || cart.length === 0) {
      alert("Bhai, cart khali hai!");
      return;
    }

    let message = "📦 *New Order - Kartik Trading & Co.*\n\n";
    cart.forEach((item, index) => {
      const itemPrice = parseFloat(item.price || 0);
      const itemQty = item.quantity || 1;
      message += `${index + 1}. *${item.title}* - Qty: ${itemQty} - ₹${(itemPrice * itemQty).toFixed(2)}\n`;
    });

    const total = cart.reduce((acc, item) => acc + parseFloat(item.price || 0) * (item.quantity || 1), 0);
    message += `\n💰 *Total Amount: ₹${total.toFixed(2)}*`;

    const whatsappUrl = `https://wa.me/919041503569?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const totalItemsInCart = (cart || []).reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <BrowserRouter>
      {/* Navbar mein Login Click par popup khulega */}
      <Navbar
        cartCount={totalItemsInCart}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setShowAuth(true)} 
        user={user}
        onLogout={handleLogout}
        onSearch={setSearchTerm}
      />

      {/* Login Popup (Auth Modal) */}
      <Auth isVisible={showAuth} onClose={() => setShowAuth(false)} />

      <Cart
        cart={cart || []}
        setCart={setCart}
        isOpen={isCartOpen}
        toggleCart={() => setIsCartOpen(false)}
        onCheckout={handleWhatsAppCheckout}
      />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/products"
            element={
              <Products
                onAddToCart={addToCartHandler}
                searchTerm={searchTerm}
                selectedCategory={category}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;