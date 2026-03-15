import React from 'react';
import styles from './CoreValue.module.css';
import { Link } from 'react-router-dom';

const CoreValues = () => {
  return (
    <div className={styles.wrapper}>
      {/* Top Section: Our Core Values */}
      <section className={styles.coreValuesSection}>
        <h2 className={styles.sectionTitle}>Our Core Values</h2>
        
        <div className={styles.cardsContainer}>
          {/* Card 1: Freshness / Quality */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              {/* Leaf Icon for Freshness */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 4 13c0-3.5 3-8 8-11 5 3 8 7.5 8 11a7 7 0 0 1-7 7z"/>
                <path d="M12 22v-2"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Freshness Guaranteed</h3>
            <p className={styles.cardText}>
              Hum direct kisanon aur top brands se saaman laate hain, taaki aapko hamesha taaza aur badiya quality ka ration mile.
            </p>
          </div>

          {/* Card 2: Pricing / Value */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              {/* Price Tag Icon for Discounts */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Unbeatable Prices</h3>
            <p className={styles.cardText}>
              Har item par wholesale rates, daily discounts aur best offers, taaki aapke ghar ka budget hamesha control mein rahe.
            </p>
          </div>

          {/* Card 3: Delivery */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              {/* Truck Icon for Delivery */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Superfast Delivery</h3>
            <p className={styles.cardText}>
              Aapka poora mahine ka ration aur daily zaroorat ka saaman seedha aapke darwaze par, bina kisi jhanjhat ke.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Section: Call to Action / App Download */}
      <section className={styles.teamSection}>
        <div className={styles.teamHeader}>
          {/* Kiryana store ke liye "Meet the team" ki jagah "Download App" ya "Shop Now" zyada suit karta hai */}
          <h2 className={styles.sectionTitle}>Get Grocery Delivered to Your Doorstep</h2>
          <Link to= "/products"className={styles.downloadBtn}>Shop Now</Link>
        </div>
      </section>
    </div>
  );
};

export default CoreValues;