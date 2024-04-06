import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL, Roles } from "../../../utils/config";
import axios from "axios";
import { toast } from "sonner";

const User = () => {
  const navigate = useNavigate();
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
      username: "",
      email: "",
      photo: "",
      bio: "",
      role: "",
      gender: "",
      age: 0,
      phone: "",
      address: "",
      confirmusername: "",
      isDoctor: false,
    },
    onSubmit: async (values) => {
      try {
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
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        formik.setValues({
          ...formik.values,
          photo: imageData,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
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
                      formik.values.photo
                        ? formik.values.photo
                        : "https://ui-avatars.com/api/?name=" +
                          formik.values.name
                    }
                    className="h-12 w-12 rounded-full"
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
                    />
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label htmlFor="age" className="label">
                    <span className="label-text">Age</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="age"
                      id="age"
                      autoComplete="age"
                      className="input input-bordered w-full"
                      onChange={formik.handleChange}
                      value={formik.values.age}
                      min={0}
                      max={100}
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
                <div className="col-span-6 sm:col-span-3 lg:col-span-3 flex flex-row-reverse justify-end">
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
                // disabled={isDeleting}
                onChange={formik.handleChange}
                value={formik.values.confirmusername}
              />
              <div className="flex modal-action">
                <button
                  className="btn btn-primary flex-1"
                  // disabled={
                  //   formik.values.confirmusername !== formik.values.username ||
                  //   isDeleting
                  // }
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
    </>
  );
};

export default User;
