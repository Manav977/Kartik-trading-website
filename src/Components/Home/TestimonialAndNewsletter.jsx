import React, { useState } from 'react';
import styles from './TestimonialAndNewsletter.module.css';

const TestimonialAndNewsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log(`Subscribed with email: ${email}`);
    // Yahan newsletter subscription logic add kar sakte hain
    setEmail('');
  };

  return (
    <div className={styles.mainWrapper}>
      {/* Testimonial Section with Blurred Background */}
      <section className={styles.testimonialSection}>
        <div className={styles.blurredBackground}></div> {/* Blurred Image Pseudo-element */}
        <div className={styles.testimonialContainer}>
          {/* Testimonial Card 1 */}
          <div className={styles.testimonialCard}>
            <p className={styles.quoteText}>
              "Main pichle 5 saalon se Kartik Trading se poora ration mangwata hoon. Freshness hamesha top-notch rehti hai, aur unki delivery bhi reliable hai. Chandigarh mein sabse badiya Kiryana store!"
            </p>
            <p className={styles.customerName}>Rajesh Mehra</p>
            <p className={styles.customerRole}>Regular Customer, 5 Years</p>
          </div>
          {/* Testimonial Card 2 */}
          <div className={styles.testimonialCard}>
            <p className={styles.quoteText}>
              "Mujhe yahan ka saamaan bahut pasand hai, aur prices bhi wholesale rates ke kareeb milte hain. Har tarah ka ration aur daily essentials ek hi jagah mil jaata hai."
            </p>
            <p className={styles.customerName}>Sangeeta Sharma</p>
            <p className={styles.customerRole}>Housewife, Chandigarh</p>
          </div>
        </div>
      </section>

      {/* Newsletter and Persistent Bottom Button Section */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterContainer}>
          <h2 className={styles.newsletterHeading}>Ghar Baithe Ration ke Offers Payein - Subscribe Karein!</h2>
          <form className={styles.subscriptionForm} onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
              required
            />
            <button type="submit" className={styles.subscribeBtn}>Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default TestimonialAndNewsletter;