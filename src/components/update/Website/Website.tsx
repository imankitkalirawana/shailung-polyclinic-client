import { isLoggedIn } from "../../../utils/auth";
import { useEffect } from "react";
import { ViewTeam } from "./ViewTeam";
import { data } from "../../../utils/data";
import { Helmet } from "react-helmet-async";
import ViewSign from "./ViewSign";

// get domain name from url

const Website = () => {
  const { loggedIn, user } = isLoggedIn();
  useEffect(() => {
    if (!loggedIn || user?.role !== "admin") {
      window.location.href = "/auth/login";
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Website - Shailung Polyclinic</title>
        <meta
          name="description"
          content="Get an inside look at the Shailung Polyclinic's website information and team members."
        />
        <meta
          name="keywords"
          content="Shailung Polyclinic, Website, Information, Team, Members, Address, Phone, Email, Description"
        />
        <link
          rel="canonical"
          href="https://report.shailungpolyclinic.com/dashboard/website"
        />
      </Helmet>
      <div>
        <form>
          <div>
            <div role="alert" className="alert mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span className="text-sm">
                Changing website data is disabled due to the SEO but you can
                still update your team.
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-base font-semibold leading-7 text-base-content">
                  Website Information
                </h1>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="website-title" className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  id="website-title"
                  name="title"
                  type="text"
                  value={data.websiteData.title}
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="website-email" className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id="website-email"
                  name="email"
                  type="text"
                  value={data.websiteData.email}
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="website-phone" className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  id="website-phone"
                  name="phone"
                  type="text"
                  value={data.websiteData.phone}
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="website-description" className="label">
                  <span className="label-text">Description</span>
                </label>
                <input
                  id="website-description"
                  name="description"
                  type="text"
                  value={data.websiteData.description}
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
              <div className="sm:col-span-full">
                <label htmlFor="website-address" className="label">
                  <span className="label-text">Address</span>
                </label>
                <input
                  id="website-address"
                  name="address"
                  type="text"
                  value={data.websiteData.address}
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
            </div>
          </div>
        </form>

        <div className="divider my-12"></div>
        <div className="my-8">
          <ViewTeam />
        </div>
        <div className="divider"></div>
        <div className="my-8">
          <ViewSign />
        </div>
      </div>
    </>
  );
};

export default Website;
