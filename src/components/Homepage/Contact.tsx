import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { useEffect, useState } from "react";

const Contact = () => {
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/website/`);
        formik.setValues((prevValues) => ({
          ...prevValues,
          to: response.data.email,
        }));
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetchContact();
  }, []);
  const formik = useFormik({
    initialValues: {
      name: "",
      from: "",
      phone: "",
      message: "",
      subject: "Contact Us Form Submission",
      to: "",
    },
    onSubmit: async (values) => {
      try {
        setProcessing(true);
        await axios.post(`${API_BASE_URL}/api/mail`, values);
        toast.success("Message sent successfully");
        formik.resetForm();
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setProcessing(false);
      }
    },
  });

  return (
    <>
      <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Contact us
          </h2>
          <p className="mt-2 text-lg leading-8">
            Send us a message and we will get back to you as soon as possible.
          </p>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="mx-auto mt-16 max-w-xl sm:mt-20"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="sm:col-span-2 col-span-full">
              <label htmlFor="name" className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="given-name"
                className="input input-bordered w-full"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </div>

            <div className="sm:col-span-2 col-span-full">
              <label htmlFor="from" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="from"
                name="from"
                id="from"
                autoComplete="email"
                className="input input-bordered w-full"
                value={formik.values.from}
                onChange={formik.handleChange}
              />
            </div>
            <div className="sm:col-span-2 col-span-full">
              <label htmlFor="phone" className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <div className="relative mt-2.5">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  className="input input-bordered w-full"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className="sm:col-span-2 col-span-full">
              <label htmlFor="message" className="label">
                <span className="label-text">Message</span>
              </label>
              <div className="mt-2.5">
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  className="textarea textarea-bordered w-full"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={processing}
            >
              {processing ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Let's Talk"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Contact;
