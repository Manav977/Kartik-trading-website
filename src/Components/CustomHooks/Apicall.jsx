import { useEffect } from "react";

const Apicall = (props) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ab hum token nahi bhej rahe hain, direct public URL hit kar rahe hain
        const res = await fetch(
          `https://kartik-trading-app-default-rtdb.firebaseio.com/.json`
        );

        if (!res.ok) throw new Error("Database error ya Permission Denied");

        const data = await res.json();
        props.onSent(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchData();
  }, [props.onSent]); // Sirf onSent badalne par call hoga

  return null;
};

export default Apicall;