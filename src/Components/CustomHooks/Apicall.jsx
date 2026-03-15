import { useEffect } from "react";

const Apicall = (props) => {

  useEffect(() => {
    fetch("https://kartik-trading-fd03a-default-rtdb.firebaseio.com/.json")
      .then((res) => res.json())
      .then((data) => {
        props.onSent(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return null;
};

export default Apicall;