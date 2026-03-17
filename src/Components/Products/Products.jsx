import React, { useState, useEffect } from "react";
import Apicall from "../CustomHooks/Apicall"; // Aapka purana component
import styles from "./Products.module.css";
import Footer from "../About/Footer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase";
import { Link } from "react-router-dom";

function Products({ onAddToCart, searchTerm = "", selectedCategory = "All" }) {
  const [firestoreProducts, setFirestoreProducts] = useState([]); // Admin wala data
  const [apiProducts, setApiProducts] = useState([]); // API wala data
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // --- 1. Firestore se Data Fetch Karo (Admin Data) ---
  useEffect(() => {
    const getFirestoreData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFirestoreProducts(items);
      } catch (err) {
        console.error("Firestore fetch error:", err);
      }
    };
    getFirestoreData();
  }, []);

  // --- 2. API Data Handler (Jo Apicall se aayega) ---
  const handleApiData = (items) => {
    if (items && Array.isArray(items)) {
      setApiProducts(items);
    }
  };

  // --- 3. Dono ko Combine Karo ---
  // Isse Firestore wale products hamesha pehle dikhenge (Fresh Stock)
  const allProducts = [...firestoreProducts, ...apiProducts];

  // --- 4. Filtering Logic (Combined Data Par) ---
  const filteredProducts = allProducts.filter((item) => {
    if (!item) return false;
    const title = (item?.title || "").toLowerCase();
    const search = (searchTerm || "").toLowerCase();
    const matchesSearch = title.includes(search);
    const matchesCategory =
      selectedCategory === "All" || item?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;
  const currentProducts = filteredProducts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <div className={styles.mainContainer}>
        {/* Aapka purana component yahan API ka kaam handle kar raha hai */}
        <Apicall onSent={handleApiData} />

        <div className={styles.top}>
          <h2 className={styles.heading}>Our Products</h2>
          <Link to="/" className={styles.heroBtn}>Back To Home</Link>
        </div>

        <div className={styles.gridContainer}>
          {currentProducts.length > 0 ? (
            currentProducts.map((item) => (
              <div key={item.id || Math.random()} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img
                    src={item?.image || "https://via.placeholder.com/150"}
                    alt={item?.title || "Product"}
                    className={styles.productImage}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.title}>{item?.title || "No Title"}</h3>
                  <button
                    className={styles.addBtn}
                    onClick={() => onAddToCart && onAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noData}>Loading...</p>
          )}
        </div>

        {/* Pagination logic remains same */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 0); }}
                className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePage : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Products;