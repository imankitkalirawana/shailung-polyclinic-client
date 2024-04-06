import { Link } from "react-router-dom";

type Props = {
  banner: {
    title: string;
    description: string;
  }[];
};

const Banner = ({ banner }: Props) => {
  const bannerItem = banner[0];

  return (
    <>
      <div className="relative isolate px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-base-content sm:text-6xl">
              {bannerItem?.title || ""}
            </h1>
            <p className="mt-6 text-lg leading-8 overflow-hidden">
              {bannerItem?.description || ""}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/appointment/new" className="btn btn-primary">
                Book an Appointment
              </Link>
              <a href="/appointment/history" className="btn btn-ghost">
                View History <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
