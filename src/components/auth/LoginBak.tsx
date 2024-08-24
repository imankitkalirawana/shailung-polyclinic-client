import axios from "axios";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../utils/config";
import { useFormik } from "formik";
import { toast } from "sonner";
import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { data } from "../../utils/data";

const Login = () => {
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const redirect = searchParams.get("redirect");

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
          // remove session storage
          sessionStorage.removeItem("register");
          if (redirect) {
            window.location.href = redirect;
          } else {
            window.location.href = "/dashboard";
          }
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

  return (
    <>
      <section className="">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <main className="flex items-center justify-center px-8 py-8 sm:px-12 col-span-full">
            <div className="lg:max-w-md max-w-md mx-auto">
              <Card
                as={"form"}
                className="p-4"
                onSubmit={() => formik.handleSubmit()}
              >
                <CardHeader className="flex-col">
                  <div className="block text-primary">
                    <span className="sr-only">Home</span>
                    <img
                      className="mx-auto h-24 w-auto"
                      src="/logo.webp"
                      alt={data.title}
                    />
                  </div>
                  <h1 className="mt-6 text-2xl text-center">
                    Welcome to {data.title} 🏥
                  </h1>
                </CardHeader>
                <CardBody>
                  <Input
                    type="text"
                    id="id"
                    name="id"
                    onChange={(e) => {
                      handleIdChange(e);
                    }}
                    fullWidth
                    label="Email or Phone"
                    placeholder="Enter your email or phone"
                    labelPlacement="outside"
                  />

                  <Input
                    type="password"
                    id="Password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    fullWidth
                    label="Password"
                    placeholder="Enter your password"
                    labelPlacement="outside"
                  />
                  <label htmlFor="Password" className="label">
                    <Link
                      to="/auth/forgot-password"
                      className="label-text-alt underline"
                    >
                      Forgot Password
                    </Link>
                  </label>
                </CardBody>

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
              </Card>
            </div>
          </main>
        </div>
      </section>
    </>
  );
};

export default Login;
