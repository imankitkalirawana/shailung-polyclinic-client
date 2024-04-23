import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../utils/config";
import { useFormik } from "formik";
import { toast } from "sonner";

const Login = () => {
  const [processing, setProcessing] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      phone: "",
      password: "",
    },
    onSubmit: async (values) => {
      setProcessing(true);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/user/login`, values);
        const { data } = res;
        if (data) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userData", JSON.stringify(data));
          localStorage.setItem("userId", data.user._id);
          toast.success("Logged in successfully");
          window.location.href = "/dashboard";
        }
      } catch (err: any) {
        toast.error(err.response.data.error);
        console.log(err);
      } finally {
        setProcessing(false);
      }
    },
  });

  const handleIdChange = (e: any) => {
    // if id includes alphabets, it's an email
    if (e.target.value.includes("@")) {
      formik.setFieldValue("email", e.target.value);
      formik.setFieldValue("phone", "");
    } else {
      formik.setFieldValue("phone", e.target.value);
      formik.setFieldValue("email", "");
    }
  };

  // console.log(formik.values);

  return (
    <>
      <section className="">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <main className="flex items-center justify-center px-8 py-8 sm:px-12 col-span-full">
            <div className="lg:max-w-md max-w-md mx-auto">
              <div className="block text-primary">
                <span className="sr-only">Home</span>
                <img
                  className="mx-auto h-24 w-auto"
                  src="/logo.webp"
                  alt="Shailung Polyclinic"
                />
              </div>

              <h1 className="mt-6 text-2xl text-center">
                Welcome to Shailung Polyclinic 🏥
              </h1>
              <form
                onSubmit={formik.handleSubmit}
                className="mt-8 grid grid-cols-6 gap-4"
              >
                <div className="col-span-full">
                  <label htmlFor="id" className="label">
                    <span className="label-text">Email / Phone Number</span>
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    className="input input-bordered w-full"
                    onChange={(e) => {
                      handleIdChange(e);
                    }}
                  />
                </div>

                <div className="col-span-full">
                  <label htmlFor="Password" className="label">
                    <span className="label-text">Password</span>
                  </label>

                  <input
                    type="password"
                    id="Password"
                    name="password"
                    className="input input-bordered w-full"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  <label htmlFor="Password" className="label">
                    <Link
                      to="/auth/forgot-password"
                      className="label-text-alt underline"
                    >
                      Forgot Password
                    </Link>
                  </label>
                </div>

                <div className="col-span-6 hidden">
                  <p className="text-sm">
                    By creating an account, you agree to our
                    <a href="#" className="underline">
                      {" "}
                      terms and conditions{" "}
                    </a>
                    and
                    <a href="#" className="underline">
                      privacy policy
                    </a>
                    .
                  </p>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button type="submit" className="btn btn-primary w-full">
                    {processing ? (
                      <span className="loading loading-dots loading-sm"></span>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
                <div className="col-span-full">
                  <p className="leading-relaxed text-sm">
                    Don't have an Account?{" "}
                    <Link
                      to="/auth/register"
                      className="text-primary underline"
                    >
                      Create an account
                    </Link>
                    .
                  </p>
                </div>
              </form>
            </div>
          </main>
        </div>
      </section>
    </>
  );
};

export default Login;
