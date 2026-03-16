import React from "react";
import classes from "./About.module.css";
import Logo from '../../assets/Logo1.png' 
import CoreValues from "./CoreValues";
import Footer from "./Footer";
const About = () => {
  return (
    <>
    <div className={classes.about}>
      <div className={classes.heading}>
        <span>About Our Store</span>
        <p>
          Discover the story behind Kartik Trading Co. — your trusted
          neighborhood grocery store where quality meets affordability. We
          provide fresh, daily-use essentials to make your home life easier and
          healthier.
        </p>
      </div>
      <div className={classes.container}>
         <img src={Logo} alt="Logo"/>
        <div>

        <h1>Our Mission</h1>
        <p>
          At Kartik Trading Co. , our mission is to provide high-quality
          grocery products at affordable prices for every household. We believe
          that good food and daily essentials should always be fresh,
          accessible, and reliable.
        </p>
        <p>
          That’s why we carefully select our suppliers and ensure every product
          meets our quality standards. Our goal is to build long-term trust with
          our customers by delivering excellent service and maintaining the
          highest standards in everything we offer.
        </p>
        </div>
      </div>
    </div>
    <CoreValues/>
    <Footer/>
    </>
  );
};

export default About;
