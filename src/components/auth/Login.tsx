import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../utils/config";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import { Helmet } from "react-helmet-async";

interface Country {
  name: string;
  dial_code: string;
  code: string;
}

const Login = () => {
  const navigate = useNavigate();
  // const
  const [isLogging, setIsLogging] = useState(false);
  const [isOfficial, setIsOfficial] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countryData, setCountryData] = useState<Country[]>([]);
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  // const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpResent, setIsOtpResent] = useState(0);

  const validationSchema = Yup.object().shape({
    email: (isOfficial
      ? Yup.string()
          .email("Invalid Email Address")
          .required("Email is required")
      : undefined) as Yup.StringSchema<string, Yup.AnyObject, undefined, "">,
    password: (isOfficial
      ? Yup.string().required("Password is required")
      : undefined) as Yup.StringSchema<string, Yup.AnyObject, undefined, "">,
    phone: (!isOfficial
      ? Yup.string().required("Phone number is required")
      : undefined) as Yup.StringSchema<string, Yup.AnyObject, undefined, "">,
    otp: (isOtpSent
      ? Yup.string()
          .matches(/^\d{6}$/, "OTP must be 6 digits")
          .required("OTP is required")
      : undefined) as Yup.StringSchema<string, Yup.AnyObject, undefined, "">,
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      phone: "",
      dbOtp: "",
      otp: "",
      country: "+977",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        setIsLogging(true);
        if (isOfficial) {
          try {
            await axios
              .post(`${API_BASE_URL}/api/user/login`, values)
              .then((res) => {
                const { data } = res;
                if (data) {
                  localStorage.setItem("token", data.token);
                  localStorage.setItem("userData", JSON.stringify(data));
                  localStorage.setItem("userId", data.user._id);
                  window.location.href = redirectUrl;
                }
                //   formik.resetForm();
              });
          } catch (e) {
            console.log(e);
            toast.error("Invalid Email or Password");
          }
        } else {
          if (isOtpSent) {
            if (values.otp == values.dbOtp) {
              await axios
                .post(`${API_BASE_URL}/api/user/login`, {
                  phone: values.country + values.phone,
                })
                .then((res) => {
                  const { data } = res;
                  if (data) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userData", JSON.stringify(data));
                    localStorage.setItem("userId", data.user._id);
                    window.location.href = "/dashboard";
                  }
                  //   formik.resetForm();
                });
            } else {
              toast.error("Invalid OTP");
            }
          } else {
            generateOtp();
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLogging(false);
      }
    },
  });

  const generateOtp = async () => {
    try {
      setIsLogging(true);
      const res = await axios.post(`${API_BASE_URL}/api/user/generate-otp`, {
        phone: formik.values.phone,
      });

      formik.values.dbOtp = res.data.otp;
      console.log(res.data.otp);
      const api_key = "26614D70EA4E26";
      const contact = formik.values.phone;
      // const from = "SHAILUNG POLYCLINIC";
      const message = `Your OTP for Shailung Polyclinic is ${formik.values.dbOtp}`;
      // const api_url = `https://samayasms.com.np/smsapi/index.php?key=${api_key}&campaign=XXXXXX&routeid=XXXXXX&type=text&contacts=${contact}&senderid=${from}&msg=${message}`;
      const api_url = `https://samayasms.com.np/smsapi/index?key=${api_key}&routeid=116&contacts=${contact}&senderid=SMSBit&msg=${message}&responsetype=json`;
      setIsOtpSent(true);
      setIsOtpResent(isOtpResent + 1);
      toast.success("OTP Sent Successfully");
      const response = await axios.get(api_url);
      console.log(response.data);
      // console.log(formik.values.dbOtp);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLogging(false);
    }
  };

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/country/`);
        setCountryData(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchCountryCode();
    if (isOtpResent > 3) {
      toast.error("You have exceeded the limit of OTP resend");
    }
  }, [isOtpResent]);

  return (
    <>
      <Helmet>
        <title>Login - Shailung Polyclinic</title>
        <meta
          name="description"
          content="Login to your account to access your reports, appointments and more."
        />
        <meta
          name="keywords"
          content="login, shailung polyclinic, reports, appointments, healthcare, hospital, clinic"
        />
        <link
          rel="canonical"
          href={`https://report.shailungpolyclinic.com/auth/login`}
        />
      </Helmet>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-24 w-auto"
            src="/logo.webp"
            alt="Shailung Polyclinic"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            {isOfficial
              ? "Login To Your Account"
              : isOtpSent
              ? "Enter OTP to Login"
              : "Login With Phone Number"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={formik.handleSubmit}>
            {isOfficial ? (
              <>
                <div>
                  <label htmlFor="email" className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`input input-bordered w-full ${
                      formik.errors.email && formik.touched.email
                        ? "input-error"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  <label className="label">
                    {formik.errors.email && formik.touched.email && (
                      <span className="label-text-alt text-error">
                        {formik.errors.email}
                      </span>
                    )}
                    <span
                      className="label-text-alt link"
                      onClick={() => {
                        setIsOfficial(false);
                      }}
                    >
                      Login With Phone Number
                    </span>
                  </label>
                </div>

                <div>
                  <label htmlFor="password" className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    className={`input input-bordered w-full ${
                      formik.errors.password && formik.touched.password
                        ? "input-error"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  <label className="label">
                    {formik.errors.password && formik.touched.password && (
                      <span className="label-text-alt text-error">
                        {formik.errors.password}
                      </span>
                    )}
                    <span
                      className="label-text-alt link"
                      onClick={() => {
                        navigate("/auth/forgot-password");
                      }}
                    >
                      Forgot Password?
                    </span>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="phone" className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <div className="flex items-center join">
                    <select
                      id="country"
                      name="country"
                      className="select select-bordered max-w-24 join-item"
                      onChange={formik.handleChange}
                      value={formik.values.country}
                      disabled
                    >
                      <option disabled>Select Country Code</option>
                      {countryData.map((country, index) => (
                        <option key={index} value={country.dial_code}>
                          {country.dial_code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="phone"
                      name="phone"
                      type="number"
                      autoComplete="phone"
                      className={`input input-bordered w-full join-item ${
                        formik.errors.phone && formik.touched.phone
                          ? "input-error"
                          : ""
                      }`}
                      onChange={(e) => {
                        const phoneValue = e.target.value
                          .trim()
                          .replace(/\s/g, "");
                        formik.setFieldValue("phone", phoneValue);
                      }}
                      value={formik.values.phone}
                      disabled={isOtpSent}
                      maxLength={10}
                      min={0}
                    />
                  </div>
                  <label className="label">
                    {formik.errors.phone && formik.touched.phone && (
                      <span className="label-text-alt text-error">
                        {formik.errors.phone}
                      </span>
                    )}
                    <span
                      className="label-text-alt link"
                      onClick={() => {
                        setIsOfficial(true);
                      }}
                    >
                      Login With Email
                    </span>
                    {isOtpSent && (
                      <span
                        className="label-text-alt link"
                        onClick={() => setIsOtpSent(false)}
                      >
                        Edit Number
                      </span>
                    )}
                  </label>
                </div>
                {isOtpSent && (
                  <div>
                    <label htmlFor="otp" className="label">
                      <span className="label-text">Otp</span>
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="number"
                      required
                      className={`input input-bordered w-full ${
                        formik.errors.otp && formik.touched.otp
                          ? "input-error"
                          : ""
                      }`}
                      maxLength={6}
                      onChange={formik.handleChange}
                      value={formik.values.otp}
                    />
                    <label className="label">
                      {formik.errors.otp && formik.touched.otp && (
                        <span className="label-text-alt text-error">
                          {formik.errors.otp}
                        </span>
                      )}
                      <button
                        className="label-text-alt link"
                        onClick={() => {
                          if (isOtpResent < 3) {
                            generateOtp();
                          } else {
                            toast.error(
                              "You have exceeded the limit of OTP resend"
                            );
                          }
                        }}
                        type="button"
                        disabled={isLogging || isOtpResent > 3}
                      >
                        Resend OTP
                      </button>
                    </label>
                  </div>
                )}
              </>
            )}
            <div className="flex items-center justify-between mt-4">
              <button
                className="btn btn-primary w-full"
                disabled={isLogging}
                type="submit"
              >
                {isLogging ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : isOfficial ? (
                  "Login"
                ) : isOtpSent ? (
                  "Verify OTP"
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
