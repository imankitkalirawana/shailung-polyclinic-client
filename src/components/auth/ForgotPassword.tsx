import { useFormik } from "formik";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ExternalLinkIcon } from "../icons/Icons";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const response = await axios.post(
          `${API_BASE_URL}/api/user/forgot-password/`,
          {
            email: values.email,
          }
        );
        console.log(response.data);
        toast.success(response.data.message);
        setIsSent(true);
      } catch (error: any) {
        toast.error(error.response.data.error);
        console.log(error.response.data.error);
      }
      setIsSubmitting(false);
    },
  });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-24 w-auto"
            src="/logo.webp"
            alt="Shailung"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Forgot Password
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form>
            <div>
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                required
                onChange={formik.handleChange}
                value={formik.values.email}
                className="input input-bordered w-full"
                disabled={isSent || isSubmitting}
              />
              <label className="label">
                <Link to="/auth/login" className="label-text-alt link">
                  Back to Login
                </Link>
              </label>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
                onClick={() => {
                  if (isSubmitting) return;
                  else if (isSent)
                    window.open(
                      "https://mail.google.com/mail/u/0/#inbox",
                      "_blank"
                    );
                  else formik.handleSubmit();
                }}
              >
                {isSubmitting ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : isSent ? (
                  <>
                    <ExternalLinkIcon className="h-4 w-4" />
                    <span>View Mail</span>
                  </>
                ) : (
                  "Send Email"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
