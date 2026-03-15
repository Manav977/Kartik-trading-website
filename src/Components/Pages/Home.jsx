import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../Home/Hero';
import Footer from '../About/Footer';
import styles from './Home.module.css';

function Home({ user }) {
  return (
    <div>
      <Hero />
      
      {/* Product Section - Visible to Everyone */}
      <section className={styles.productShortcut}>
        <div className={styles.contentBox}>
          {user ? (
            <h2>Welcome Back, {user.displayName || 'Bhai'}!</h2>
          ) : (
            <h2>Our Premium Collection</h2>
          )}
          
          <p>Explore the best wholesale deals at Kartik Trading Co.</p>
          
          <Link to="/products" className={styles.mainActionBtn}>
            View All Products →
          </Link>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

export default Home;