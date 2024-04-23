import { isLoggedIn } from "../../../utils/auth";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import ViewSign from "./ViewSign";
import { useFormik } from "formik";
import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";
import { toast } from "sonner";
import { getWebsite } from "../../../functions/get";

// get domain name from url

const Website = () => {
  const { loggedIn, user } = isLoggedIn();
  useEffect(() => {
    if (!loggedIn || user?.role !== "admin") {
      window.location.href = "/auth/login";
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWebsite();
        formik.setValues({
          title: data.title,
          email: data.email,
          phone: data.phone,
          description: data.description,
          address: data.address,
        });
      } catch (error) {
        toast.error("Error Updating Details");
      }
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      email: "",
      phone: "",
      description: "",
      address: "",
    },
    onSubmit: async (values) => {
      try {
        await axios.put(`${API_BASE_URL}/api/website`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("Website Information Updated");
      } catch (error) {
        toast.error("Error Updating Details");
      }
    },
  });

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
        <form onSubmit={formik.handleSubmit}>
          <div>
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
                  id="title"
                  name="title"
                  type="text"
                  className="input input-bordered w-full"
                  value={formik.values.title}
                  onChange={formik.handleChange}
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
                  className="input input-bordered w-full"
                  value={formik.values.email}
                  onChange={formik.handleChange}
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
                  className="input input-bordered w-full"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
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
                  className="input input-bordered w-full"
                  value={formik.values.description}
                  onChange={formik.handleChange}
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
                  className="input input-bordered w-full"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end mt-12">
            <a href="/dashboard" className="btn btn-sm">
              Cancel
            </a>
            <button className="btn btn-primary btn-sm" type="submit">
              Update
            </button>
          </div>
        </form>

        {/* <div className="divider my-12"></div>
        <div className="my-8">
          <ViewTeam />
        </div> */}
        <div className="divider"></div>
        <div className="my-8">
          <ViewSign />
        </div>
      </div>
    </>
  );
};

export default Website;
