import classes from "./Skeliton.module.css";

function SkeletonSlider() {
  return (
    <div className={classes.container}>
      <div className={classes.image}></div>
      <div className={classes.title}></div>
      <div className={classes.price}></div>
    </div>
  );
}

export default SkeletonSlider;