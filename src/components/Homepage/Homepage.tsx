import { useEffect, useState } from "react";
import Banner from "./Banner";
import Contact from "./Contact";
import Features from "./Features";
import Footer from "./Footer";
// import Pricing from "./Pricing";
import Team from "./Team";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

const Homepage = () => {
  const [websiteData, setWebsiteData] = useState({
    title: "",
    banner: [],
    features: [],
    team: [],
    social: [],
    featuresTitle: "",
    featuresDescription: "",
    featuresImage: "",
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/website`).then((response) => {
      setWebsiteData(response.data);
    });
  }, []);

  return (
    <>
      <Banner banner={websiteData?.banner} />
      <Features />
      {/* <Pricing /> */}
      <Team team={websiteData?.team} />
      <Contact />
      <Footer title={websiteData.title} />
    </>
  );
};

export default Homepage;
