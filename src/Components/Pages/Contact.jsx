import React, { Fragment, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import styles from "./Contact.module.css";
import Footer from '../About/Footer'

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState("");

const sendEmail = (e) => {
  e.preventDefault();
  setStatus("Sending..."); // Button par "Sending..." dikhega

  emailjs.init("R5MMQMOXZ_jal-bM4");

  emailjs
    .sendForm("Kartik_", "template_n6wgsf4", form.current)
    .then(
      (result) => {
        setStatus("Message Sent Successfully! ✅"); // Success ke baad button text badal jayega
        e.target.reset();

        // 3 second baad button ko wapas normal karne ke liye (Optional)
        setTimeout(() => setStatus(""), 3000);
      },
      (error) => {
        console.error("FAILED...", error);
        setStatus("Error ❌");
        setTimeout(() => setStatus(""), 3000);
      }
    );
};



  return (
    <Fragment>
    <div className={styles.contactContainer}>
      <div className={styles.headerSection}>
        <h1>Contact Us</h1>
        <p>Get in touch with Kartik Trading  Co. for wholesale inquiries.</p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.infoSide}>
          <div className={styles.infoSide}>
            <h2>Get in Touch</h2>
            <p>
              Whether you have a question about our products, need assistance,
              or just want to talk wholesale — we’re here for you.
            </p>

            <div className={styles.detailItem}>
              <div className={styles.contactDetail}>
                <div>
                  <span>ADDRESS</span>
                  <p>Shop no. 2 , Main Bazar ,Tripuri , Patiala, punjab, India</p>
                </div>
              </div>
              <div className={styles.contactDetail}>
                <div>
                  <span>EMAIL</span>
                  <p>support@kartiktrading.com</p>
                </div>
              </div>
              <div className={styles.contactDetail}>
                <div>
                  <span>PHONE</span>
                  <p>+91 98882 76906</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.detailItem}>
            {/* Map details yahan rahengi */}
          </div>
        </div>

        <div className={styles.formSide}>
          <form ref={form} onSubmit={sendEmail} className={styles.contactForm}>
            <h3>Send a Message</h3>

            <div className={styles.inputGroup}>
              <div className={styles.field}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="user_name"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input
                  type="email"
                  name="user_email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Bulk Order / Inquiry"
                required
              />
            </div>

            <div className={styles.field}>
              <label>Message</label>
              <textarea
                name="message"
                rows="5"
                placeholder="Write details here..."
                required
              ></textarea>
            </div>

            <button type="submit" className={styles.sendBtn}>
              {status || "Send Message"}
            </button>

            {status && <p className={styles.statusMsg}>{status}</p>}
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className={styles.mapSection}>
        <iframe
          title="Kartik Trading Location"
          src="https://www.google.com/maps?q=KartikTradingCompany&output=embed"
          width={1200}
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
          <div>
        <Footer/>
      </div>
    </Fragment>
  );
};

export default Contact;
