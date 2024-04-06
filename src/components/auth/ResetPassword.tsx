import { useFormik } from "formik";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
      token: token,
    },
    validate: (values) => {
      const errors: any = {};
      if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await axios.put(
          `${API_BASE_URL}/api/user/reset-password`,
          values
        );
        toast.success(response.data.message);
        navigate("/auth/login");
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
      setLoading(false);
    },
  });
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Reset Password
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="newPassword" className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                id="newPassword"
                type="password"
                required
                onChange={formik.handleChange}
                value={formik.values.newPassword}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                className={`input input-bordered w-full ${
                  formik.errors.confirmPassword &&
                  formik.touched.confirmPassword
                    ? "input-error"
                    : ""
                }`}
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  {formik.errors.confirmPassword &&
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword}
                </span>
              </label>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Loading..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
