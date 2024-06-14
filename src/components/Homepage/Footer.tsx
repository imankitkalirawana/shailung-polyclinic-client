import { Link } from "react-router-dom";
import { data } from "../../utils/data";

const Footer = () => {
  return (
    <>
      <footer className="mx-auto max-w-6xl p-4">
        <div className="flex flex-col items-center justify-between px-6 py-8 mx-auto lg:flex-row">
          <Link to="/dashboard" className="1 text-xl font-bold btn btn-ghost">
            {data.websiteData.title}
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
            <a href="#" className="link">
              Overview
            </a>

            <a href="#" className="link">
              Features
            </a>

            <a href="#" className="link">
              Pricing
            </a>
            <a href="#" className="link">
              Careers
            </a>

            <a href="#" className="link">
              Help
            </a>

            <a href="#" className="link">
              Privacy
            </a>
          </div>

          <p className="mt-6 text-sm lg:mt-0">
            © Copyright {new Date().getFullYear()} {data.websiteData.title}{" "}
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
