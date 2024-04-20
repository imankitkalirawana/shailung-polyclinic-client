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

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      bio: "",
      address: "",
      confirmusername: "",
      photo: "profile-default.webp",
      previewPhoto: "",
      dob: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        if (file) {
          await DeleteFile(values.photo);
          const filename = `profile-${values.username}-${Date.now()}.${
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
        username: res.data.username,
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

  const forgotPassword = () => {
    axios
      .post(`${API_BASE_URL}/api/user/forgot-password`, {
        email: formik.values.email,
      })
      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
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
            <h1 className="text-base font-semibold leading-7 text-base-content">
              Profile Information
            </h1>
            <p className="mt-1 text-sm leading-6 text-base-neutral">
              Update your profile information.
            </p>
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

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6 md:w-[50%]">
                <label htmlFor="username" className="label">
                  <span className="label-text">Username</span>
                </label>
                <div className="mt-2">
                  <div className="flex input input-bordered shadow-sm sm:max-w-md">
                    <span className="hidden sm:flex select-none items-center pl-3 text-base-content sm:text-sm">
                      https://{window.location.hostname}/
                    </span>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      autoComplete="username"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-base-content placeholder:text-base-neutral focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
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

              <div className="col-span-full">
                <label htmlFor="bio" className="label">
                  <span className="label-text">bio</span>
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
            <div className="divider"></div>
            <div className="pb-12">
              <h2 className="text-base font-semibold leading-7 text-base-content">
                Personal Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-base-neutral">
                Use a permanent address where you can receive mail.
              </p>

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
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button type="button" className="btn btn-error btn-outline btn-sm">
              <label htmlFor="delete_modal">Delete Account</label>
            </button>
            <div className="flex gap-2">
              {!email.includes("change.this") && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={forgotPassword}
                  type="button"
                >
                  {formik.values.password ? "Forgot" : "Generate"} Password
                </button>
              )}
              <button type="submit" className="btn btn-primary btn-sm">
                Update
              </button>
            </div>
          </div>
          <input type="checkbox" id="delete_modal" className="modal-toggle" />
          <div className="modal" role="dialog">
            <div className="modal-box max-w-96">
              <label htmlFor="city" className="label">
                <span className="label-text">
                  Enter <b>{formik.values.username}</b> to delete
                </span>
              </label>
              <input
                type="text"
                id="delete_confirmation"
                name="confirmusername"
                className="input input-bordered w-full placeholder:text-base-content/40"
                placeholder={formik.values.username}
                disabled={isDeleting}
                onChange={formik.handleChange}
                value={formik.values.confirmusername}
              />
              <div className="flex modal-action">
                <button
                  className="btn btn-primary flex-1"
                  disabled={
                    formik.values.confirmusername !== formik.values.username ||
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
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
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
          <button type="submit" className="btn btn-primary btn-sm">
            Update
          </button>
        </div>
      </form>
    </>
  );
};
