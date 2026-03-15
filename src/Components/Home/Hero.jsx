import { Fragment } from "react";
import FavouriteCollection from "./FavouriteCollection";
import HeroSlider from "./HeroSlider";
import TestimonialAndNewsletter from "./TestimonialAndNewsletter";

function Hero() {
  return (
    <Fragment>
      <HeroSlider />
      <FavouriteCollection/>
      <TestimonialAndNewsletter/>
    </Fragment>
  );
}

export default Hero;