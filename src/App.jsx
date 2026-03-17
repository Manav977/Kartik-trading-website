import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { auth, db } from "./Firebase";
import "./App.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  addDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";

import toast, { Toaster } from "react-hot-toast";

// Components
import Navbar from "./Components/Home/Header";
import Products from "./Components/Products/Products";
import Contact from "./Components/Pages/Contact";
import Home from "./Components/Pages/Home";
import About from "./Components/About/About";
import Cart from "./Components/Products/Cart";
import Auth from "./Components/Pages/Auth";
import AdminPanel from "./Components/Adminpanel.jsx/AdminPanel";
import AddressModal from "./Components/Products/Address";

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [showAuth, setShowAuth] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const hasShownLoginToast = useRef(false);

  const ADMIN_EMAILS = [
    "manavnasra8080@gmail.com",
    "kartiktradingcompany@gmail.com",
  ];

  // ✅ AUTH LOGIC
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (!hasShownLoginToast.current) {
          toast.success("Welcome back!", { id: "login-toast" });
          hasShownLoginToast.current = true;
        }
        setUser(currentUser);
        setShowAuth(false);

        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && userSnap.data().cart) {
            setCart(userSnap.data().cart);
          }
        } catch (error) {
          console.error("Cart loading error:", error);
        }
      } else {
        if (hasShownLoginToast.current) {
          toast.success("Logged out", { id: "logout-toast" });
        }
        setUser(null);
        setCart([]);
        hasShownLoginToast.current = false;
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ ADDRESS LISTENER
  useEffect(() => {
    if (!user?.uid) {
      setUserAddress("");
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserAddress(docSnap.data().address || "");
      }
    });
    return () => unsub();
  }, [user?.uid]);

  const handleLogout = () => signOut(auth);

  // ✅ CART SYNC
  const saveCartToFirestore = async (newCart, currentUser) => {
    if (!currentUser?.uid) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { cart: newCart }, { merge: true });
    } catch (error) {
      console.error("Cart Sync Error:", error);
    }
  };

  const clearCart = async (currentUser) => {
    setCart([]);
    if (!currentUser?.uid) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { cart: [] }, { merge: true });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const addToCartHandler = (product) => {
    if (!product?.id) return;
    setCart((prevCart) => {
      const safeCart = Array.isArray(prevCart) ? prevCart : [];
      const existingItem = safeCart.find((item) => item.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = safeCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      } else {
        updatedCart = [...safeCart, { ...product, quantity: 1 }];
      }
      saveCartToFirestore(updatedCart, user);
      toast.success(`${product.title} added!`, { id: product.id });
      return updatedCart;
    });
  };

  const openWhatsApp = (message) => {
    const url = `https://wa.me/919888276906?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // ✅ FINAL ORDER FLOW (STOCK LOGIC REMOVED)
  const handleFinalOrderFlow = async () => {
    if (!user) {
      toast.error("Please login first");
      setShowAuth(true);
      setIsCartOpen(false);
      return;
    }

    if (!userAddress?.trim()) {
      setShowAddressModal(true);
      return;
    }

    const currentCart = [...cart];
    if (currentCart.length === 0) return;

    const processOrder = async () => {
      // 1. WhatsApp Message taiyar karna
      let itemDetails = "";
      currentCart.forEach((item, index) => {
        itemDetails += `${index + 1}. ${item.title} (Qty: ${item.quantity || 1})\n`;
      });

      const message = `📦 *New Order - Kartik Trading & Co.*\n\n👤 Name: ${user.displayName || "User"}\n📍 Address: ${userAddress}\n\n🛒 Items:\n${itemDetails}\n✅ Please confirm the order.`;

      // 2. Database mein order save karna
      try {
        await addDoc(collection(db, "orders"), {
          userId: user.uid,
          userName: user.displayName || "User",
          address: userAddress,
          items: currentCart,
          timestamp: new Date(),
          status: "Confirmed",
        });
      } catch (e) {
        console.warn("Order save to DB skipped", e);
      }

      // 3. WhatsApp open karna aur cart clear karna
      openWhatsApp(message);
      await clearCart(user);
      setIsCartOpen(false);
    };

    toast.promise(processOrder(), {
      loading: "Processing your order...",
      success: "Order Confirmed! ✅",
      error: "Error placing order ❌",
    });
  };

  const handleDetailsSubmit = async (details) => {
    if (!user?.uid) {
      setShowAddressModal(false);
      setShowAuth(true);
      return;
    }
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        { phone: details.phone, address: details.address },
        { merge: true },
      );
      setUserAddress(details.address);
      setShowAddressModal(false);
      toast.success("Details saved!");
    } catch (error) {
      toast.error("Error saving details");
    }
  };

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Navbar
        cartCount={cart.reduce((t, i) => t + (i.quantity || 0), 0)}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setShowAuth(true)}
        user={user}
        onLogout={handleLogout}
        onSearch={setSearchTerm}
      />

      <Auth isVisible={showAuth} onClose={() => setShowAuth(false)} />
      <AddressModal
        isVisible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSubmit={handleDetailsSubmit}
        user={user}
      />

      <Cart
        cart={cart}
        user={user}
        setCart={(val) => {
          setCart((prev) => {
            const updated = typeof val === "function" ? val(prev) : val;
            saveCartToFirestore(updated, user);
            return updated;
          });
        }}
        isOpen={isCartOpen}
        toggleCart={() => setIsCartOpen(false)}
        onCheckout={handleFinalOrderFlow}
        setShowAddressModal={setShowAddressModal}
        userAddress={userAddress}
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
          <Route
            path="/admin-secret-panel"
            element={
              user && ADMIN_EMAILS.includes(user.email?.toLowerCase()) ? (
                <AdminPanel />
              ) : (
                <div className="access-denied">
                  <h2>🔒 Locked</h2>

                  <h3>This area is reserved for authorized admins only.</h3>
                  <Link to="/" className="back-home-btn">
                    ← Back to Home
                  </Link>
                </div>
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
