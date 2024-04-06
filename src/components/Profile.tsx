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

const Profile = () => {
  const navigate = useNavigate();
  const { loggedIn } = isLoggedIn();
  // const [user, setUser] = useState<User>({} as User);
  const [isDeleting, setIsDeleting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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
    const fetchUser = async () => {
      try {
        const res = await getLoggedUser();
        formik.setValues({
          ...formik.values,
          name: res.data.name,
          username: res.data.username,
          email: res.data.email,
          phone: res.data.phone,
          bio: res.data.bio,
          address: res.data.address,
          photo: res.data.photo,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  console.log();

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

  // if (!user) return <>Not Logged IN</>;

  return (
    <div className="col-span-full lg:col-span-9 max-w-6xl mx-auto my-24 px-8">
      <form className="px-4 sm:px-0" onSubmit={formik.handleSubmit}>
        <div>
          <h2 className="text-base font-semibold leading-7 text-base-content">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-base-neutral">
            This information will be displayed publicly so be careful what you
            share.
          </p>

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
                      : `${API_BASE_URL}/api/upload/${formik.values.photo}`
                  }
                  className="h-12 w-12 rounded-full object-cover"
                  alt={formik.values.name}
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
                  />
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="email" className="label">
                  <span className="label-text">Email address</span>
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="input input-bordered w-full"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    disabled
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
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pb-12 hidden">
            <h2 className="text-base font-semibold leading-7 text-base-content">
              Notifications
            </h2>
            <p className="mt-1 text-sm leading-6 text-base-neutral">
              We'll always let you know bio important changes, but you pick what
              else you want to hear bio.
            </p>

            <div className="mt-10 space-y-10">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-base-content">
                  By Email
                </legend>
                <div className="mt-6 space-y-6">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        type="checkbox"
                        id="updates"
                        name="updates"
                        className="checkbox"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="updates"
                        className="font-medium text-base-content"
                      >
                        Updates
                      </label>
                      <p className="text-base-neutral">
                        Get notified when we make there are new features or
                        change in features.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        type="checkbox"
                        id="announcements"
                        name="announcements"
                        className="checkbox"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="announcements"
                        className="font-medium text-base-content"
                      >
                        Announcements and DL's
                      </label>
                      <p className="text-base-content">
                        Get notified when a new announcement or DL is posted.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        type="checkbox"
                        id="offers"
                        name="offers"
                        className="checkbox"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="offers"
                        className="font-medium text-base-content"
                      >
                        Offers
                      </label>
                      <p className="text-base-content">
                        Get notified when a candidate accepts or rejects an
                        offer.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-base-content">
                  Push Notifications
                </legend>
                <p className="mt-1 text-sm leading-6 text-base-neutral">
                  These are delivered via SMS to your mobile phone.
                </p>
                <div className="mt-6 space-y-6">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-everything"
                      type="radio"
                      name="push-notifications"
                      className="radio"
                    />

                    <label
                      htmlFor="push-everything"
                      className="block text-sm font-medium leading-6 text-base-content"
                    >
                      Everything
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-email"
                      type="radio"
                      name="push-notifications"
                      className="radio"
                    />
                    <label
                      htmlFor="push-email"
                      className="block text-sm font-medium leading-6 text-base-content"
                    >
                      Same as email
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-nothing"
                      type="radio"
                      name="push-notifications"
                      className="radio"
                    />
                    <label
                      htmlFor="push-nothing"
                      className="block text-sm font-medium leading-6 text-base-content"
                    >
                      No push notifications
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button type="button" className="btn btn-error btn-outline btn-sm">
            <label htmlFor="delete_modal">Delete Account</label>
          </button>
          <div className="flex gap-2">
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
      {formik.values.email && <Security />}
    </div>
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
