import { useEffect, useState } from "react";
import Banner from "./Banner";
import Contact from "./Contact";
import Features from "./Features";
import Footer from "./Footer";
import Team from "./Team";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [websiteData, setWebsiteData] = useState({
    team: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/website`).then((response) => {
      setWebsiteData(response.data);
    });
    navigate("/dashboard");
  }, []);

  return (
    <>
      <Banner />
      <Features />
      <Team team={websiteData?.team} />
      <Contact />
      <Footer />
    </>
  );
};

export default Homepage;
