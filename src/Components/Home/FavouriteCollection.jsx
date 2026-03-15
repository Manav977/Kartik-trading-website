import React, { useState } from "react";
import classes from "./FavouriteCollection.module.css";
import Apicall from "../CustomHooks/Apicall";

const FavouriteCollection = () => {
  const [collection, setCollection] = useState([]);

  // API se data aane par sirf pehle 3 items lenge grid ke liye
  const ApiDatahandler = (items) => {
    setCollection(items.slice(5, 8));
  };

  return (
    <section className={classes.sectionWrapper}>
      {/* Top Text Section */}
      <div className={classes.textContainer}>
        <h2 className={classes.heading}>Our Favourite Collection</h2>
        <p className={classes.subtext}>
          Handpicked daily essentials to make your kitchen complete. We bring you the finest 
          quality grocery products, trusted by households everyday for a healthier lifestyle.
        </p>
      </div>

      {/* API Call Component (Invisible, just fetches data) */}
      {collection.length === 0 && <Apicall onSent={ApiDatahandler} />}

      {/* Bottom Image Grid Section */}
      <div className={classes.gridContainer}>
        {collection.length > 0 ? (
          collection.map((item, index) => (
            <div key={index} className={classes.card}>
              <img 
                src={item.image} 
                alt={item.title || "Product"} 
                className={classes.productImage} 
              />
              <h2>{item.title}</h2>
            </div>
          ))
        ) : (
          // Loading state jab tak data fetch ho raha hai
          <div className={classes.loading}>Loading Collection...</div>
        )}
      </div>
    </section>
  );
};

export default FavouriteCollection;