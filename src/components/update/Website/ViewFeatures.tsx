import React, { useEffect, useState } from "react";
// import Features from "../../Homepage/Features";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { useFormik } from "formik";

type Feature = {
  title: string;
  description: string;
};

export const ViewFeatures = () => {
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/website/features/`
        );
        formik.setValues((prevValues) => ({
          ...prevValues,
          features: response.data,
        }));
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetchFeatures();
    const fetchWebsite = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/website/`);
        formik.setValues((prevValues) => ({
          ...prevValues,
          featuresTitle: response.data.featuresTitle,
          featuresDescription: response.data.featuresDescription,
          featuresImage: response.data.featuresImage,
        }));
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetchWebsite();
  }, []);

  const formik = useFormik({
    initialValues: {
      features: [] as Feature[],
      featuresTitle: "",
      featuresDescription: "",
      featuresImage: "",
    },
    onSubmit: async (values) => {
      try {
        setProcessing(true);
        const updatedFeatures = values.features.map((feature) => ({
          title: feature.title,
          description: feature.description,
        }));
        values.featuresTitle = values.featuresTitle;
        values.featuresDescription = values.featuresDescription;
        values.featuresImage = values.featuresImage;

        await axios.put(
          `${API_BASE_URL}/api/website/features/`,
          {
            features: updatedFeatures,
            featuresTitle: values.featuresTitle,
            featuresDescription: values.featuresDescription,
            featuresImage: values.featuresImage,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        toast.success("Features updated successfully");
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setProcessing(false);
      }
    },
  });

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        formik.setValues((prevValues) => ({
          ...prevValues,
          featuresImage: imageData,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold leading-7 text-base-content">
              Features
            </h2>
            <p className="mt-1 text-sm leading-6 text-base-neutral">
              Update your website features.
            </p>
          </div>
        </div>
        <div className="mockup-browser border bg-base-300 my-8 pointer-events-none select-none">
          <div className="mockup-browser-toolbar">
            <div className="input">https://{window.location.hostname}</div>
          </div>
          <div className="flex justify-center p-4 bg-base-200">
            <Features
              features={formik.values.features}
              featuresTitle={formik.values.featuresTitle}
              featuresDescription={formik.values.featuresDescription}
              featuresImage={formik.values.featuresImage}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="features-title" className="label">
              <span className="label-text">Feature Title</span>
            </label>
            <input
              id="features-title"
              name="featuresTitle"
              type="text"
              className="input input-bordered w-full"
              value={formik.values.featuresTitle}
              onChange={formik.handleChange}
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="features-description" className="label">
              <span className="label-text">Feature Description</span>
            </label>
            <input
              id="features-description"
              name="featuresDescription"
              type="text"
              className="input input-bordered w-full"
              value={formik.values.featuresDescription}
              onChange={formik.handleChange}
            />
          </div>
          <div className="col-span-full">
            <label htmlFor="featuresImage" className="label">
              <span className="label-text">Feature Image</span>
            </label>
            <div className="flex gap-4 items-center flex-col-reverse">
              <label
                htmlFor="featuresImage"
                className="flex flex-col bg-base-300 border-neutral border-2 items-center p-5 w-full text-center border-dashed cursor-pointer rounded-xl"
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
                  Feature Image
                </h2>
                <p className="mt-2 text-xs tracking-wide">
                  Upload or darg & drop your file SVG, PNG, JPG or GIF. (Max
                  2MB)
                </p>
                <input
                  id="featuresImage"
                  name="featuresImage"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e)}
                />
              </label>
            </div>
          </div>
          {formik.values.features
            .slice(0, 4)
            .map((feature: any, index: number) => (
              <React.Fragment key={index}>
                <div className="sm:col-span-3">
                  <label htmlFor={`feature-title-${index}`} className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    id={`feature-title-${index}`}
                    name="title"
                    type="text"
                    className="input input-bordered w-full"
                    value={feature.title}
                    onChange={(e) => {
                      const updatedFeatures = [...formik.values.features];
                      updatedFeatures[index] = {
                        ...updatedFeatures[index],
                        title: e.target.value,
                      };
                      formik.setValues({
                        ...formik.values,
                        features: updatedFeatures,
                      });
                    }}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor={`feature-description-${index}`}
                    className="label"
                  >
                    <span className="label-text">Description</span>
                  </label>
                  <input
                    id={`feature-description-${index}`}
                    name="description"
                    type="text"
                    className="input input-bordered w-full"
                    value={feature.description}
                    onChange={(e) => {
                      const updatedFeatures = [...formik.values.features];
                      updatedFeatures[index] = {
                        ...updatedFeatures[index],
                        description: e.target.value,
                      };
                      formik.setValues({
                        ...formik.values,
                        features: updatedFeatures,
                      });
                    }}
                  />
                </div>
              </React.Fragment>
            ))}
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
  features: {
    title: string;
    description: string;
  }[];
  featuresTitle: string;
  featuresDescription: string;
  featuresImage: string;
};

const Features = ({
  features,
  featuresTitle,
  featuresDescription,
  featuresImage,
}: Props) => {
  return (
    <>
      <section className="max-w-6xl mx-auto p-4">
        <div className="container flex flex-col px-6 gap-4 py-10 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center">
          <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg flex flex-col gap-4">
              <h1
                className="text-3xl font-semibold tracking-wide lg:text-4xl tooltip tooltip-open border-2 border-dashed border-base-content rounded-md p-4"
                data-tip="Feature Title"
              >
                {featuresTitle}
              </h1>
              <p
                className="mt-4 tooltip tooltip-open tooltip-bottom border-2 border-dashed border-base-content rounded-md p-4"
                data-tip="Feature Description"
              >
                {featuresDescription}
              </p>
              <div
                className="grid gap-6 mt-8 sm:grid-cols-2 tooltip tooltip-open tooltip-bottom border-2 border-dashed border-base-content rounded-md p-4"
                data-tip="Features"
              >
                {features.slice(0, 4).map((feature, index) => (
                  <div className="flex items-center -px-3 " key={index}>
                    <svg
                      className="w-5 h-5 mx-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>

                    <span className="mx-3">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="items-center justify-center w-full h-96 lg:w-1/2 hidden md:flex border-2 border-dashed border-base-content rounded-md p-4 tooltip tooltip-open tooltip-top"
            data-tip="Feature Image"
          >
            <img
              className="object-cover w-full h-full max-w-2xl rounded-md"
              src={featuresImage}
              alt="glasses photo"
            />
          </div>
        </div>
      </section>
    </>
  );
};
