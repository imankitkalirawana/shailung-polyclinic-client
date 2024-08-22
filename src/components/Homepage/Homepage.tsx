import { useEffect } from "react";

const Homepage = () => {
  useEffect(() => {
    window.location.href = "/dashboard";
  }, []);
  return <></>;
};

export default Homepage;
