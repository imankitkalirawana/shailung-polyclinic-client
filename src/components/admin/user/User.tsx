import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL, Roles } from "../../../utils/config";
import axios from "axios";
import { toast } from "sonner";
import { isLoggedIn } from "../../../utils/auth";
import NotFound from "../../NotFound";
import { Helmet } from "react-helmet-async";
import { UploadSingleFile } from "../../../utils/FileHandling";

const User = () => {
  const navigate = useNavigate();
  const { user } = isLoggedIn();
  const [file, setFile] = useState<File | null>(null);

  if (user?.role !== "admin") {
    return (
      <div className="my-24" onLoad={() => {}}>
        <NotFound message="You are not allowed to access this page" />
      </div>
    );
  }
  const { id }: any = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`${API_BASE_URL}/api/admin/user/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      formik.setValues(data);
    };
    fetchUser();
  }, []);

  const formik = useFormik({
    initialValues: {
      _id: "",
      name: "",
      email: "",
      photo: "",
      bio: "",
      role: "",
      gender: "",
      dob: "",
      phone: "",
      address: "",
      confirmemail: "",
      isDoctor: false,
      previewPhoto: "",
    },
    onSubmit: async (values) => {
      try {
        if (file) {
          const filename = `profile-${values.email}-${Date.now()}.${
            file.name.split(".").pop() || "jpg"
          }`;
          await UploadSingleFile(file, filename);
          values.photo = filename;
        }
        const response = await axios.put(
          `${API_BASE_URL}/api/admin/user/${id}`,
          values,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success(response.data.message);
        navigate("/dashboard/users");
      } catch (error: any) {
        console.log(error.message);
        toast.error(error.message);
      }
    },
  });

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

  console.log(formik.values);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/admin/user/${id}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      navigate("/dashboard/users");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  return (
    <>
      <Helmet>
        <title>Manage {`${formik.values.name}`} - Shailung Polyclinic</title>
        <meta
          name="description"
          content={`Manage ${formik.values.name}'s information on Shailung Polyclinic in Itahari, Nepal`}
        />
        <meta
          name="keywords"
          content="Shailung Polyclinic, Shailung, Polyclinic, Hospital, Clinic, Health, Health Care, Medical, Medical Care, Itahari, Nepal, User, User Information, User Details, User Profile, User Profile Information, User Profile Details, User Profile Information Details, User Profile Information Details Page, User Profile Information Details Page of Shailung Polyclinic, User Profile Information Details Page of Shailung Polyclinic in Itahari, User Profile Information Details Page of Shailung Polyclinic in Itahari, Nepal, Shailung Polyclinic User Profile Information Details Page, Shailung Polyclinic User Profile Information Details Page in Itahari, Shailung Polyclinic User Profile Information Details Page in Itahari, Nepal"
        />
        <link
          rel="canonical"
          href={`https://report.shailungpolyclinic.com/admin/user/${id}/edit`}
        />
      </Helmet>
      <div className="col-span-full lg:col-span-9">
        <form className="px-4 sm:px-0" onSubmit={formik.handleSubmit}>
          <div>
            <h2 className="text-base font-semibold leading-7 text-base-content">
              Update User
            </h2>
            <p className="mt-1 text-sm leading-6 text-base-neutral">
              Update user details
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                    className="h-12 w-12 rounded-full aspect-square object-cover"
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
              <h1 className="text-base font-semibold leading-7 text-base-content">
                Personal Information
              </h1>
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
                <div className="col-span-6 sm:col-span-2">
                  <label htmlFor="gender" className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    className="select select-bordered w-full mt-2"
                    name="gender"
                    onChange={formik.handleChange}
                    value={formik.values.gender}
                  >
                    <option disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <label htmlFor="role" className="label">
                    <span className="label-text">Role</span>
                  </label>
                  <select
                    className="select select-bordered w-full mt-2"
                    name="role"
                    onChange={formik.handleChange}
                    value={formik.values.role}
                  >
                    <option disabled>Select Role</option>
                    {Roles.map((role, index) => (
                      <option value={role.value} key={index}>
                        {role.label}
                      </option>
                    ))}
                  </select>
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
                <div className="col-span-6 sm:col-span-3 lg:col-span-3 hidden flex-row-reverse justify-end">
                  <label htmlFor="isDoctor" className="label">
                    <span className="label-text">Assign as Doctor</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="checkbox"
                      name="isDoctor"
                      id="isDoctor"
                      className="checkbox checked:checkbox-primary"
                      onChange={formik.handleChange}
                      checked={formik.values.isDoctor}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="btn btn-error btn-outline hover:btn-primary btn-sm"
            >
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
            <div className="modal-box w-full sm:max-w-sm">
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
                // disabled={isDeleting}
                onChange={formik.handleChange}
                value={formik.values.confirmemail}
              />
              <div className="flex modal-action">
                <button
                  className="btn btn-primary flex-1"
                  type="button"
                  disabled={formik.values.confirmemail !== formik.values.email}
                  onClick={handleDelete}
                >
                  Delete
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
      </div>
      <div className="divider my-12"></div>
      {<Security id={id} />}
    </>
  );
};

interface SecurityProps {
  id: string;
}

const Security = ({ id }: SecurityProps) => {
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      try {
        const res = await axios.put(
          `${API_BASE_URL}/api/admin/user/reset-password/${id}`,
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
          Update User's Password
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-full md:col-span-1">
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
          <div className="col-span-full md:col-span-1">
            <label htmlFor="confirm_password" className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              id="confirm_password"
              name="confirmPassword"
              type="password"
              required
              className={`input input-bordered w-full ${
                formik.errors.confirmPassword && formik.touched.confirmPassword
                  ? "input-error"
                  : ""
              }`}
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
            />
            {formik.errors.confirmPassword &&
              formik.touched.confirmPassword && (
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

export default User;
