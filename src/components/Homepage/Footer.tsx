import { Link } from "react-router-dom";

type Props = {
  title: string;
};

const Footer = ({ title }: Props) => {
  return (
    <>
      <footer className="mx-auto max-w-6xl p-4">
        <div className="container flex flex-col items-center justify-between px-6 py-8 mx-auto lg:flex-row">
          <Link to="/" className="1 text-xl font-bold btn btn-ghost">
            {title}
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

          <p className="mt-6 text-sm lg:mt-0">© Copyright 2024 {title} </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;