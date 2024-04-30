import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  IconChevronDown,
  IconUserEdit,
  IconUserPlus,
} from "@tabler/icons-react";
import { getAllUsers, getUserWithId } from "../../../functions/get";
import { CheckIcon } from "../../icons/Icons";
import { calculateAge } from "../../../functions/agecalculator";
import { User } from "../../../interface/interface";
import { isLoggedIn } from "../../../utils/auth";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "sonner";
import { API_BASE_URL, Roles } from "../../../utils/config";

const NewAppointment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userType = searchParams.get("user");
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!userType) {
      navigate("/dashboard/tests/appointment?user=new");
    }
  }, [userType]);

  // fetch users if userType is existing
  useEffect(() => {
    if (userType === "existing") {
      fetchUsers();
    }
  }, [userType]);

  const fetchUsers = async () => {
    await getAllUsers("user").then((data) => {
      setUsers(data);
    });
  };

  const handleSearch = (user: any) => {
    if (query === "") {
      return user;
    } else if (
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.phone.toLowerCase().includes(query.toLowerCase())
    ) {
      return user;
    }
  };

  const fetchUserById = async (id: string) => {
    await getUserWithId(id).then((response) => {
      setSelectedUser(response.data);
    });
  };

  useEffect(() => {
    // set search param userId to selectedUser._id
    if (selectedUser) {
      setSearchParams({ user: "existing", userId: selectedUser._id });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (searchParams.get("userId")) {
      const userId = searchParams.get("userId");
      const user = users.find((user) => user._id === userId);
      if (user) {
        setSelectedUser(user);
      } else {
        fetchUserById(userId || "");
      }
    }
  }, []);

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">New Appointment</h1>
          </div>
          <div className="flex flex-col gap-4 py-8">
            <div className="max-w-md mx-auto flex flex-col-reverse sm:flex-row-reverse gap-6">
              <a
                href="/dashboard/tests/appointment?user=new"
                className={`flex items-center cursor-pointer select-none p-4 shadow-xs bg-primary/10 w-56 card ${
                  userType === "new" && "ring-2"
                } ring-offset-2 ring-offset-base-100 ring-primary flex-row from-primary/20 to-secondary/30 transition-all`}
              >
                <div className="p-3 mr-4 bg-primary rounded-full text-base-100">
                  <IconUserPlus />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">New User</p>
                </div>
              </a>
              <a
                href="/dashboard/tests/appointment?user=existing"
                className={`flex items-center p-4 shadow-xs bg-primary/10 w-56 card ${
                  userType === "existing" && "ring-2"
                } ring-offset-2 ring-offset-base-100 cursor-pointer select-none ring-primary flex-row from-primary/20 to-secondary/30 transition-all`}
              >
                <div className="p-3 mr-4 bg-primary rounded-full text-base-100">
                  <IconUserEdit />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Existing User</p>
                </div>
              </a>
            </div>
            {userType === "new" && <AddUser />}
            {userType === "existing" && (
              <>
                <div className="flex justify-center">
                  <Combobox value={selectedUser} onChange={setSelectedUser}>
                    <div className="relative mt-8">
                      <div className="relative w-72 px-2">
                        <Combobox.Input
                          className="input input-bordered w-72"
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Search by name or phone"
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <IconChevronDown className="h-5 w-5" />
                        </Combobox.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                      >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-72 ml-2 overflow-auto rounded-md bg-base-300 z-10 py-1 backdrop-blur-lg text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                          {users.filter(handleSearch).length === 0 &&
                          query !== "" ? (
                            <div className="relative cursor-default select-none px-4 py-2">
                              No User Found
                            </div>
                          ) : (
                            users
                              .filter(handleSearch)
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((user) => (
                                <Combobox.Option
                                  key={user._id}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? "bg-primary text-white" : ""
                                    }`
                                  }
                                  value={user}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {user.name}
                                      </span>
                                      {selected ? (
                                        <span
                                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                            active
                                              ? "text-white"
                                              : "text-primary"
                                          }`}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))
                          )}
                        </Combobox.Options>
                      </Transition>
                    </div>
                  </Combobox>
                </div>
                {selectedUser && (
                  <>
                    <div className="relative block overflow-hidden rounded-lg border border-base-content/20 border-b-0 p-4 sm:p-6 lg:p-8">
                      <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-primary via-blue-500 to-purple-600"></span>

                      <div className="flex justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold sm:text-xl">
                            {selectedUser.name}
                          </h3>

                          <p className="mt-1 text-xs font-medium">
                            {selectedUser.phone}
                          </p>
                        </div>
                        <div className="block sm:shrink-0">
                          <Link
                            to={`/dashboard/users/${selectedUser._id}/edit`}
                            className="btn btn-sm"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-pretty text-sm">
                          {selectedUser.email}
                        </p>
                      </div>

                      <dl className="mt-6 flex gap-4 sm:gap-6">
                        <div className="flex flex-col">
                          <dt className="text-sm font-medium">Age</dt>
                          <dd className="text-xs text-center">
                            {selectedUser.dob && selectedUser.dob !== "0"
                              ? calculateAge(selectedUser.dob)
                              : "-"}
                          </dd>
                        </div>

                        {selectedUser.address && (
                          <div className="flex flex-col">
                            <dt className="text-sm font-medium">Address</dt>
                            <dd className="text-xs">{selectedUser.address}</dd>
                          </div>
                        )}
                      </dl>
                      <div className="flex justify-between items-end">
                        <div className="flex justify-end mt-4">
                          <Link
                            to={`/appointment/new?user=${selectedUser._id}`}
                            className="btn btn-sm btn-primary"
                          >
                            Create Appointment
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const AddUser = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { user } = isLoggedIn();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      gender: "male",
      age: 0,
      role: "user",
    },

    onSubmit: async (values) => {
      try {
        setIsAdding(true);
        if (values.phone && !values.phone.startsWith("+")) {
          values.phone = "+977" + values.phone;
        }
        await axios
          .post(`${API_BASE_URL}/api/admin/user`, values, {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            toast.success("User added successfully");
            window.location.href = `/appointment/new?user=${res.data._id}`;
          });
      } catch (error: any) {
        toast.error(error.response.data.error);
        console.log(error);
      } finally {
        setIsAdding(false);
      }
    },
  });

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
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <form className="w-full max-w-md" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="name" className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              name="name"
              id="name"
              required
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </div>
          <div>
            <label htmlFor="gender" className="label">
              <span className="label-text">Gender</span>
            </label>
            <select
              className="select select-bordered w-full"
              name="gender"
              onChange={formik.handleChange}
              value={formik.values.gender}
              required
            >
              <option disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              name="email"
              id="email"
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
          <div>
            <label htmlFor="phone" className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              name="phone"
              id="phone"
              placeholder="e.g. +1234567890"
              value={formik.values.phone}
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
              required
            />
            <label className="label">
              <span className="label-text-alt text-error">
                {formik.errors.phone}
              </span>
            </label>
          </div>
          {user?.role === "admin" && (
            <div>
              <label htmlFor="role" className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                className="select select-bordered w-full"
                name="role"
                id="role"
                onChange={formik.handleChange}
                value={formik.values.role}
              >
                <option disabled>Select Role for user</option>
                {Roles.map((role) => (
                  <option value={role.value} key={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="modal-action flex">
            <button
              className="btn btn-primary flex-1"
              type="submit"
              disabled={
                isAdding ||
                !formik.values.name ||
                !formik.values.email ||
                !formik.values.phone
              }
            >
              {isAdding ? (
                <>
                  <span className="loading loading-dots loading-sm"></span>
                </>
              ) : (
                "Add User"
              )}
            </button>
            <label htmlFor="add_user" className="btn flex-1">
              Cancel!
            </label>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewAppointment;
