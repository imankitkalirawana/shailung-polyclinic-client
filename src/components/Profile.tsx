import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useFormik } from "formik";
import { API_BASE_URL } from "../utils/config";
import { isLoggedIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { UploadSingleFile, DeleteFile } from "../utils/FileHandling";
import { getLoggedUser } from "../functions/get";
import { deleteSelf } from "../functions/delete";
import { Helmet } from "react-helmet-async";

const Profile = () => {
  const navigate = useNavigate();
  const { loggedIn } = isLoggedIn();
  // const [user, setUser] = useState<User>({} as User);
  const [isDeleting, setIsDeleting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [forgotProcessing, setForgotProcessing] = useState(false);
  const [updateProcessing, setUpdateProcessing] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      bio: "",
      address: "",
      photo: "profile-default.webp",
      previewPhoto: "",
      dob: "",
      password: "",
      confirmemail: "",
    },
    onSubmit: async (values) => {
      try {
        setUpdateProcessing(true);
        if (file) {
          await DeleteFile(values.photo);
          const filename = `profile-${values.email}-${Date.now()}.${
            file.name.split(".").pop() || "jpg"
          }`;
          await UploadSingleFile(file, filename);
          values.photo = filename;
        }
        const res = await axios.put(
          `${API_BASE_URL}/api/user/profile`,
          values,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success(res.data.message);
        fetchUser();
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
      setUpdateProcessing(false);
    },
  });

  useEffect(() => {
    if (!loggedIn) {
      navigate("/auth/login");
    }
  }, []);

  useEffect(() => {
    // fetch user data
    fetchUser();
  }, []);
  const fetchUser = async () => {
    try {
      const res = await getLoggedUser();
      setEmail(res.data.email);
      formik.setValues({
        ...formik.values,
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        bio: res.data.bio,
        address: res.data.address,
        photo: res.data.photo,
        dob: res.data.dob,
        password: res.data.password,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSelf().then(() => {
        toast.success("Account deleted successfully");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
        navigate("/auth/login");
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile: File = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        formik.setValues({
          ...formik.values,
          previewPhoto: imageData,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const forgotPassword = async () => {
    setForgotProcessing(true);
    try {
      await axios
        .post(`${API_BASE_URL}/api/user/forgot-password`, {
          id: formik.values.email,
        })
        .then((response) => {
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
    setForgotProcessing(false);
  };

  return (
    <>
      <Helmet>
        <title>Profile - Shailung Polyclinic</title>
        <meta
          name="description"
          content="Update your profile information. Use a permanent address where you can receive mail."
        />
        <meta
          name="keywords"
          content="Shailung Polyclinic, Profile, Update Profile, User Profile, Shailung Polyclinic Profile, Shailung Polyclinic User Profile, Shailung Polyclinic Profile Update, nepal, itahari, sunsari, shailung, polyclinic, hospital, health, health care, health care center, health care center in itahari, health care center in sunsari, health care center in nepal, health care center in shailung, health care center in polyclinic, health care center in shailung polyclinic, shailung polyclinic health care center, shailung polyclinic health care center in itahari, shailung polyclinic health care center in sunsari, shailung polyclinic health care center in nepal, shailung polyclinic health care center in shailung, shailung polyclinic health care center in polyclinic"
        />
        <link
          rel="canonical"
          href="https://report.shailungpolyclinic.com/profile"
        />
      </Helmet>
      <div className="col-span-full lg:col-span-9 max-w-6xl mx-auto my-24 px-8">
        <form className="px-4 sm:px-0" onSubmit={formik.handleSubmit}>
          <div>
            {formik.values.email.includes("change.this") && (
              <div
                role="alert"
                className="alert mt-4 bg-error/20 col-span-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-error shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  You need to update your email address to recieve
                  notifications.{" "}
                  <a href="#email-section" className="link link-error">
                    Update Now
                  </a>
                </span>
              </div>
            )}

            <div className="pb-12">
              <h2 className="text-base font-semibold leading-7 text-base-content">
                Personal Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-base-neutral">
                Use a permanent address where you can receive mail.
              </p>

              {/* profile section */}
              <div className="col-span-full mt-8">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6"
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <img
                    src={
                      formik.values.previewPhoto
                        ? formik.values.previewPhoto
                        : `${API_BASE_URL}/api/upload/single/${formik.values.photo}`
                    }
                    className="h-12 w-12 rounded-full object-cover"
                    alt={formik.values.name}
                    title="profile"
                    width={40}
                    height={40}
                    loading="eager"
                  />
                  <label
                    htmlFor="photo"
                    className="btn btn-outline hover:btn-primary btn-sm"
                  >
                    Change
                  </label>
                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e)}
                  />
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="name" className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="given-name"
                      className="input input-bordered w-full"
                      onChange={formik.handleChange}
                      value={formik.values.name}
                      required
                    />
                  </div>
                </div>

                <div
                  className="col-span-6 sm:col-span-3 scroll-m-52"
                  id="email-section"
                >
                  <label htmlFor="email" className="label">
                    <span className="label-text">Email address</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`input input-bordered w-full ${
                        formik.values.email.includes("change.this")
                          ? "input-error"
                          : ""
                      }`}
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      required
                    />
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="phone" className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="phone"
                      className="input input-bordered w-full"
                      onChange={formik.handleChange}
                      value={formik.values.phone}
                      disabled
                      required
                    />
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                  <label htmlFor="address" className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="address"
                      name="address"
                      type="address"
                      autoComplete="address"
                      className="input input-bordered w-full"
                      onChange={formik.handleChange}
                      value={formik.values.address}
                      required
                    />
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                  <label htmlFor="dob" className="label">
                    <span className="label-text">Date of Birth</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      className="input input-bordered w-full"
                      onChange={formik.handleChange}
                      value={formik.values.dob}
                      required
                    />
                  </div>
                </div>
                <div className="col-span-6">
                  <label htmlFor="bio" className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      className="textarea textarea-bordered block w-full h-28 bg-base-100 py-1.5 text-base-content shadow-sm placeholder:text-neutral focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      onChange={formik.handleChange}
                      value={formik.values.bio}
                    />
                  </div>
                  <div className="label">
                    <span className="label-text-alt">
                      Write a few sentences bio yourself.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-col-reverse sm:flex-row justify-between gap-2">
            <button
              type="button"
              className="btn btn-error btn-outline sm:btn-sm w-full sm:w-auto"
            >
              <label htmlFor="delete_modal">Delete Account</label>
            </button>
            <div className="flex w-full sm:w-auto flex-col-reverse sm:flex-row gap-2">
              {!email.includes("change.this") && (
                <button
                  className="btn sm:btn-sm"
                  onClick={forgotPassword}
                  type="button"
                  disabled={forgotProcessing}
                >
                  {forgotProcessing ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : formik.values.password ? (
                    "Forgot Password"
                  ) : (
                    "Generate Password"
                  )}{" "}
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary sm:btn-sm w-full sm:w-auto"
                disabled={updateProcessing}
              >
                {updateProcessing ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </div>
          <input type="checkbox" id="delete_modal" className="modal-toggle" />
          <div className="modal" role="dialog">
            <div className="modal-box max-w-96">
              <label htmlFor="city" className="label">
                <span className="label-text">
                  Enter <b>{formik.values.email}</b> to delete
                </span>
              </label>
              <input
                type="text"
                id="delete_confirmation"
                name="confirmemail"
                className="input input-bordered w-full placeholder:text-base-content/40"
                placeholder={formik.values.email}
                disabled={isDeleting}
                onChange={formik.handleChange}
                value={formik.values.confirmemail}
              />
              <div className="flex modal-action">
                <button
                  className="btn btn-primary flex-1"
                  disabled={
                    formik.values.confirmemail !== formik.values.email ||
                    isDeleting
                  }
                  onClick={handleDelete}
                >
                  {isDeleting ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : (
                    "Delete"
                  )}
                </button>
                <label className="btn flex-1" htmlFor="delete_modal">
                  Cancel
                </label>
              </div>
            </div>

            <label className="modal-backdrop" htmlFor="delete_modal">
              Close
            </label>
          </div>
        </form>
        <div className="divider my-12"></div>
        {formik.values.password && <Security />}
      </div>
    </>
  );
};

export default Profile;

const Security = () => {
  const [updateProcessing, setUpdateProcessing] = useState(false);
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      setUpdateProcessing(true);
      try {
        const res = await axios.put(
          `${API_BASE_URL}/api/user/profile/password`,
          values,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success(res.data.message);
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
      setUpdateProcessing(false);
    },
    validate: (values) => {
      const errors: any = {};
      if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      return errors;
    },
  });

  return (
    <>
      <form className="px-4 sm:px-0" onSubmit={formik.handleSubmit}>
        <h2 className="text-base font-semibold leading-7 text-base-content">
          Security
        </h2>
        <p className="mt-1 text-sm leading-6 text-base-neutral">
          Change your password and set up authentication.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-6 md:w-[50%]">
            <label htmlFor="current_password" className="label">
              <span className="label-text">Current Password</span>
            </label>
            <input
              id="current_password"
              type="password"
              name="oldPassword"
              required
              className="input input-bordered w-full"
              onChange={formik.handleChange}
              value={formik.values.oldPassword}
            />
          </div>
          <div className="sm:col-span-6 md:w-[50%]">
            <label htmlFor="new_password" className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              id="new_password"
              type="password"
              name="newPassword"
              required
              className="input input-bordered w-full"
              onChange={formik.handleChange}
              value={formik.values.newPassword}
            />
          </div>
          <div className="sm:col-span-6 md:w-[50%]">
            <label htmlFor="confirm_password" className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              id="confirm_password"
              name="confirmPassword"
              type="password"
              required
              className={`input input-bordered w-full ${
                formik.errors.confirmPassword ? "input-error" : ""
              }`}
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
            />
            {formik.errors.confirmPassword && (
              <p className="mt-1 text-xs text-error">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
        <div className="divider my-10"></div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="submit"
            className="btn btn-primary sm:btn-sm w-full sm:w-auto"
            disabled={updateProcessing}
          >
            {updateProcessing ? (
              <span className="loading loading-dots loading-sm"></span>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </>
  );
};
