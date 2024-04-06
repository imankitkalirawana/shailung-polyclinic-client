import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";
import { toast } from "sonner";
import { isLoggedIn } from "../../../utils/auth";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { ViewFeatures } from "./ViewFeatures";
import { ViewBanner } from "./ViewBanner";
import { ViewTeam } from "./ViewTeam";
import { UploadSingleFile, DeleteFile } from "../../../utils/FileHandling";

// get domain name from url

const Website = () => {
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { loggedIn, user } = isLoggedIn();
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/website`).then((response) => {
      formik.setValues(response.data);
    });
    if (!loggedIn || user?.role !== "admin") {
      window.location.href = "/auth/login";
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      email: "",
      phone: "",
      address: "",
      logo: "logo-default.webp",
      banner: [],
      features: [],
      team: [],
      social: [],
      logoPreview: "",
    },
    onSubmit: async (values) => {
      try {
        setProcessing(true);
        if (file) {
          if (formik.values.logo !== "logo-default.webp") {
            await DeleteFile(formik.values.logo);
          }
          const filename = file.name;
          await UploadSingleFile(file, filename);
          values.logo = filename;
        }
        await axios.put(`${API_BASE_URL}/api/website`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("Website updated successfully");
      } catch (error: any) {
        toast.error(error.response.statusText);
      } finally {
        setProcessing(false);
      }
    },
  });

  // console.log(file?.name);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        formik.setValues({
          ...formik.values,
          logoPreview: imageData,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit}>
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
              <span>Changing website data might affect SEO.</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold leading-7 text-base-content">
                  Website Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-base-neutral">
                  Update your website information.
                </p>
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
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
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
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
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
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                  placeholder="e.g. +1234567890"
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
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
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
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="logo" className="label">
                  <span className="label-text">Logo</span>
                </label>
                <div className="flex gap-4 items-center flex-col-reverse">
                  <label
                    htmlFor="logo"
                    className="flex flex-col bg-base-300 border-neutral border-2 items-center p-1 w-full text-center border-dashed cursor-pointer rounded-xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                      />
                    </svg>
                    <h2 className="mt-1 font-medium tracking-wide">
                      Logo File
                    </h2>
                    <p className="mt-2 text-xs tracking-wide">
                      Upload or darg & drop your file SVG, PNG, JPG or GIF. (Max
                      2MB)
                    </p>
                    <input
                      id="logo"
                      name="logo"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e)}
                    />
                  </label>
                  <img
                    src={
                      formik.values.logoPreview ||
                      `${API_BASE_URL}/api/upload/${formik.values.logo}`
                    }
                    className="w-24 h-24 rounded-full mr-4 aspect-square"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end mt-12">
            <a href="/dashboard" className="btn btn-sm">
              Cancel
            </a>
            <button
              className="btn btn-primary btn-sm"
              type="submit"
              disabled={processing}
            >
              {processing ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
        <div className="divider my-12"></div>
        <div className="my-8">
          <ViewBanner />
        </div>
        <div className="divider my-12"></div>
        <div className="my-8">
          <ViewFeatures />
        </div>
        <div className="divider my-12"></div>
        <div className="my-8">
          <ViewTeam />
        </div>
      </div>
    </>
  );
};

export default Website;
