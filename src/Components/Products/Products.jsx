import React, { useState, useEffect } from "react";
import Apicall from "../CustomHooks/Apicall";
import styles from "./Products.module.css";
import Footer from "../About/Footer";
import { Link } from "react-router-dom";

function Products({ onAddToCart, searchTerm = "", selectedCategory = "All" }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Data handle karte waqt check karo ki array hi mile
  const ApiDatahandler = (items) => {
    if (items && Array.isArray(items)) {
      setProducts(items);
    } else {
      setProducts([]);
    }
  };

  // Filtering mein safety lagayi hai
  const filteredProducts = products.filter((item) => {
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
        <Apicall onSent={ApiDatahandler} />
        <div className={styles.top}>
          <h2 className={styles.heading}>Our Products</h2>
          <Link to="/" className={styles.heroBtn}>
            Back To Home
          </Link>
        </div>

        <div className={styles.gridContainer}>
          {currentProducts.length > 0 ? (
            currentProducts.map((item) => {
              // Agar item ke andar data missing ho toh crash na ho
              if (!item) return null;

              return (
                <div key={item.id || Math.random()} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={item?.image || "https://via.placeholder.com/150"}
                      alt={item?.title || "Product"}
                      className={styles.productImage}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.title}>
                      {item?.title || "No Title"}
                    </h3>
                    {/* <p className={styles.price}>₹{item?.price || 0}</p> */}
                    <button
                      className={styles.addBtn}
                      onClick={() => {
                        if (onAddToCart) {
                          onAddToCart(item);
                        }
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className={styles.noData}>Bhai, koi product nahi mila.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo(0, 0);
                }}
                className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePage : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default Products;
