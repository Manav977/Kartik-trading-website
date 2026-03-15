import React, { useState, useEffect } from "react";
import classes from "./HeroSlider.module.css";
import Apicall from "../CustomHooks/Apicall";
import SkeletonSlider from "./Skeliton";
import { Link } from "react-router-dom";

function HeroSlider() {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const ApiDatahandler = (items) => {
    setProducts(items.slice(0, 5));
  };

  useEffect(() => {
    setIsImageLoaded(false);
  }, [index]);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [products]);

  if (products.length === 0) {
    return (
      <div className={classes.sliderContainer}>
        <Apicall onSent={ApiDatahandler} />
        <SkeletonSlider />
      </div>
    );
  }

  return (
    <div className={classes.sliderContainer}>
      <div className={classes.hero}>
        <button className={`${classes.navBtn} ${classes.prevBtn}`} onClick={prevSlide}>←</button>
        
        <div className={classes.heroContentWrapper}>
          {/* Left Side: Product Image */}
          <div className={classes.imageSection}>
            <img
              src={products[index].image}
              alt={products[index].title}
              onLoad={() => setIsImageLoaded(true)}
              className={`${classes.sliderImage} ${isImageLoaded ? classes.fadeIn : classes.hidden}`}
            />
          </div>

          {/* Right Side: Product Details */}
          <div className={`${classes.infoSection} ${isImageLoaded ? classes.fadeIn : classes.hidden}`}>
            <h1 className={classes.productTitle}>{products[index].title}</h1>
            <h2 className={classes.price}>
              Wholesale Rate: ₹{products[index].price || "Contact for Price"}
            </h2>
            <p className={classes.description}>{products[index].description}</p>
            
            <div className={classes.btnContainer}>
              <Link to="/products" className={classes.heroBtn}>
                View All Products
              </Link>
            </div>
          </div>
        </div>

        <button className={`${classes.navBtn} ${classes.nextBtn}`} onClick={nextSlide}>→</button>

        <div className={classes.dots}>
          {products.map((_, i) => (
            <span
              key={i}
              className={`${classes.dot} ${i === index ? classes.active : ""}`}
              onClick={() => setIndex(i)}
            >
              ●
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroSlider;