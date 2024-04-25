import { useFormik } from "formik";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../../utils/config";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const Register = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  // const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const [isOtpResent, setIsOtpResent] = useState(0);

  const validationSchema = Yup.object().shape({
    phone: Yup.string().required("Phone number is required"),
    otp: (isOtpSent
      ? Yup.string()
          .matches(/^\d{6}$/, "OTP must be 6 digits")
          .required("OTP is required")
      : undefined) as Yup.StringSchema<string, Yup.AnyObject, undefined, "">,
  });

  const formik = useFormik({
    initialValues: {
      phone: "",
      dbOtp: "",
      otp: "",
      name: "",
      dob: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (isOtpVerified) {
          if (values.password !== values.confirm_password) {
            formik.setErrors({
              confirm_password: "Passwords do not match",
            });
            return;
          }
          const res = await axios.post(`${API_BASE_URL}/api/user/register`, {
            phone: values.phone,
            name: values.name,
            dob: values.dob,
            email: values.email,
            password: values.password,
          });
          const { data } = res;
          if (data) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userData", JSON.stringify(data));
            localStorage.setItem("userId", data.user._id);
            toast.success("Registered successfully");
            // clear session storage
            sessionStorage.removeItem("register");
            window.location.href = "/dashboard";
          } else {
            toast.error("An error occurred. Please try again later.");
          }
        } else {
          if (isOtpSent) {
            if (values.otp == values.dbOtp) {
              setIsOtpVerified(true);
              handleSessionStorage(true);
              toast.success("OTP Verified Successfully");
            } else {
              toast.error("Invalid OTP");
              formik.setErrors({ otp: "Invalid OTP" });
              return;
            }
          } else {
            const res = await axios.post(
              `${API_BASE_URL}/api/user/check-phone/${values.phone}`,
              null
            );
            if (res.status === 200) {
              toast.error("Phone number already exists");
              return;
            } else {
              generateOtp();
            }
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred. Please try again later.");
      }
    },
  });

  const handleSessionStorage = (isOtpVerified: boolean) => {
    sessionStorage.setItem(
      "register",
      JSON.stringify({
        phone: formik.values.phone,
        isOtpVerified: isOtpVerified,
        otpCount: isOtpResent,
      })
    );
  };

  //   retrieve the phone number from sessionStorage on page load
  useEffect(() => {
    const register = sessionStorage.getItem("register");
    if (register) {
      const { phone, isOtpVerified, otpCount } = JSON.parse(register);
      formik.setFieldValue("phone", phone);
      setIsOtpVerified(isOtpVerified);
      setIsOtpResent(otpCount);
    }
  }, []);

  const generateOtp = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/generate-otp`, {
        phone: formik.values.phone,
      });

      formik.values.dbOtp = res.data.otp;
      // console.log(res.data.otp);
      const api_key = "26614D70EA4E26";
      const contact = formik.values.phone;
      // const from = "SHAILUNG POLYCLINIC";
      const message = `Your OTP for Shailung Polyclinic is ${formik.values.dbOtp}`;
      // const api_url = `https://samayasms.com.np/smsapi/index.php?key=${api_key}&campaign=XXXXXX&routeid=XXXXXX&type=text&contacts=${contact}&senderid=${from}&msg=${message}`;
      const api_url = `https://samayasms.com.np/smsapi/index?key=${api_key}&routeid=116&contacts=${contact}&senderid=SMSBit&msg=${message}&responsetype=json`;
      setIsOtpSent(true);
      setIsOtpResent(isOtpResent + 1);
      sessionStorage.setItem(
        "register",
        JSON.stringify({
          phone: formik.values.phone,
          isOtpVerified: false,
          otpCount: isOtpResent,
        })
      );
      toast.success("OTP Sent Successfully");
      const response = await axios.get(api_url);
      console.log(response.data);
      // console.log(formik.values.dbOtp);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  // function to check if email is already registered
  const checkMail = async (email: string) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/user/check-email/${email}`,
        null
      );
      if (res.status === 200) {
        formik.setFieldError(email, "Email is already registered");
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const checkPhone = async (phone: string) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/user/check-phone/${phone}`,
        null
      );
      if (res.status === 200) {
        formik.setFieldError(phone, "Phone number already exists");
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  return (
    <>
      <section className="">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <main className="flex items-center justify-center px-8 py-8 sm:px-12 col-span-full">
            <div className="max-w-sm mx-auto">
              <div className="block text-primary">
                <span className="sr-only">Home</span>
                <img
                  className="mx-auto h-24 w-auto"
                  src="/logo.webp"
                  alt="Shailung Polyclinic"
                />
              </div>

              <h1 className="mt-6 text-2xl font-bold sm:text-3xl md:text-4xl">
                Register into Shailung Polyclinic 🏥
              </h1>

              <p className="mt-4 leading-relaxed">
                Get started by creating an account. Already have an account?{" "}
                <Link to="/auth/login" className="text-primary underline">
                  Log in
                </Link>
                .
              </p>

              <form
                onSubmit={formik.handleSubmit}
                className="mt-8 grid grid-cols-6 gap-6"
              >
                <>
                  <div className="col-span-full">
                    <label htmlFor="phone" className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="input input-bordered w-full"
                      placeholder="eg. 9841234567"
                      value={formik.values.phone}
                      maxLength={10}
                      autoFocus
                      disabled={isOtpSent || isOtpVerified}
                      onChange={async (e) => {
                        formik.handleChange(e);
                        const phone = e.target.value;
                        if (phone === "") return;
                        if (await checkPhone(phone)) {
                          formik.setErrors({
                            phone: "Phone number already exists",
                          });
                        }
                      }}
                    />
                    <label htmlFor="phone" className="label">
                      {/* {formik.errors.phone && formik.touched.phone && ( */}
                      <span className="label-text-alt text-error">
                        {formik.errors.phone}
                      </span>
                      {/* )} */}
                      {(isOtpSent || isOtpVerified) && (
                        <span
                          className="label-text-alt underline"
                          onClick={() => {
                            setIsOtpSent(false);
                            setIsOtpVerified(false);
                            handleSessionStorage(false);
                          }}
                        >
                          Change phone number?{" "}
                        </span>
                      )}
                    </label>
                  </div>
                  {isOtpSent && !isOtpVerified && (
                    <div className={`col-span-full`}>
                      <label htmlFor="otp" className="label">
                        <span className="label-text">OTP</span>
                      </label>
                      <input
                        type="tel"
                        id="otp"
                        name="otp"
                        className="input input-bordered w-full"
                        placeholder="Enter OTP"
                        onChange={formik.handleChange}
                        value={formik.values.otp}
                        maxLength={6}
                        max={999999}
                      />
                      <label className="label">
                        <button
                          className="label-text-alt underline"
                          onClick={(e) => {
                            e.preventDefault();
                            generateOtp();
                          }}
                          hidden={isOtpResent >= 3}
                        >
                          Resend OTP
                        </button>
                        {formik.errors.otp && formik.touched.otp && (
                          <span className="label-text-alt text-error">
                            {formik.errors.otp}
                          </span>
                        )}
                      </label>
                    </div>
                  )}

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
                </>
                {isOtpVerified && (
                  <>
                    <div className="col-span-3">
                      <label htmlFor="name" className="label">
                        <span className="label-text">Name</span>
                      </label>

                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input input-bordered w-full"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <label htmlFor="age" className="label">
                        <span className="label-text">DOB</span>
                      </label>

                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        className="input input-bordered w-full"
                        onChange={formik.handleChange}
                        value={formik.values.dob}
                        required
                      />
                    </div>
                    <div className="col-span-full">
                      <label htmlFor="email" className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        className="input input-bordered w-full"
                        value={formik.values.email}
                        onChange={async (e) => {
                          formik.handleChange(e);
                          const email = e.target.value;
                          if (email === "") return;
                          if (await checkMail(email)) {
                            formik.setErrors({
                              email: "Email is already registered",
                            });
                          }
                        }}
                        required
                      />
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {formik.errors.email}
                        </span>
                      </label>
                    </div>
                    <div className="col-span-full">
                      <label htmlFor="password" className="label">
                        <span className="label-text">Password</span>
                      </label>

                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="input input-bordered w-full"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        required
                      />
                    </div>
                    <div className="col-span-full">
                      <label htmlFor="confirm_password" className="label">
                        <span className="label-text">Confirm Password</span>
                      </label>

                      <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        className="input input-bordered w-full"
                        onChange={formik.handleChange}
                        value={formik.values.confirm_password}
                        required
                      />
                      <label className="label">
                        {formik.errors.confirm_password && (
                          <span className="label-text-alt text-error">
                            {formik.errors.confirm_password}
                          </span>
                        )}
                      </label>
                    </div>
                  </>
                )}
                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={
                      formik.isSubmitting ||
                      formik.errors.email !== undefined ||
                      formik.errors.phone !== undefined
                    }
                  >
                    {formik.isSubmitting ? (
                      <span className="loading loading-dots loading-sm"></span>
                    ) : isOtpVerified ? (
                      "Register"
                    ) : isOtpSent ? (
                      "Verify OTP"
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </section>
    </>
  );
};

export default Register;
