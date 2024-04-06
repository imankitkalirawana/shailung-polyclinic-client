import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { useFormik } from "formik";

export const ViewBanner = () => {
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/website/banner/65f3ed6b806f47973db31ff3`
        );
        formik.setValues(response.data);
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetchBanner();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: async (values) => {
      try {
        setProcessing(true);
        await axios.put(
          `${API_BASE_URL}/api/website/banner/65f3ed6b806f47973db31ff3`,
          values,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Banner updated successfully");
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setProcessing(false);
      }
    },
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-base font-semibold leading-7 text-base-content"
              data-tip="Banner Title"
            >
              Banner Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-base-neutral">
              Update your Banner information.
            </p>
          </div>
        </div>

        <div className="mockup-browser border bg-base-300 my-8 pointer-events-none">
          <div className="mockup-browser-toolbar">
            <div className="input">https://{window.location.hostname}</div>
          </div>
          <div className="flex justify-center p-4 bg-base-200">
            <Banner banner={[formik.values]} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="title" className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formik.values.title}
              onChange={formik.handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="banner-description" className="label">
              <span className="label-text">Description</span>
            </label>
            <input
              id="banner-description"
              name="description"
              type="text"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="input input-bordered w-full"
            />
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
    </>
  );
};

type Props = {
  banner: {
    title: string;
    description: string;
  }[];
};

const Banner = ({ banner }: Props) => {
  return (
    <>
      <div className="relative isolate px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-24">
          <div className="text-center flex flex-col">
            <h1
              className="text-4xl font-bold text-base-content sm:text-6xl  border-2 border-dashed border-base-content rounded-md p-4 tooltip tooltip-open tooltip-top"
              data-tip="Banner-title"
            >
              {banner[0]?.title || ""}
            </h1>
            <p
              className="mt-6 text-lg leading-8 border-2 border-dashed border-base-content rounded-md p-4 tooltip tooltip-open tooltip-bottom"
              data-tip="Banner Description"
            >
              {banner[0]?.description || ""}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="#" className="btn btn-primary">
                Book an Appointment
              </a>
              <a href="#" className="btn btn-ghost">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
