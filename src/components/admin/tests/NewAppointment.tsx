import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  IconChevronDown,
  IconEdit,
  IconUserEdit,
  IconUserPlus,
} from "@tabler/icons-react";
import { getAllUsers } from "../../../functions/get";
import { CheckIcon } from "../../icons/Icons";
import { API_BASE_URL } from "../../../utils/config";
import { humanReadableDate } from "../user/Users";
import { calculateAge } from "../../../functions/agecalculator";

interface User {
  _id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  dob: string;
  address: string;
  role: string;
  status: string;
  addeddate: string;
  updatedAt: string;
  photo: string;
}

const NewAppointment = () => {
  const [searchParams] = useSearchParams();
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

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">New Appointment</h1>
          </div>
          <div className="flex flex-col gap-4 py-8">
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-6">
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
            {userType === "new" && null}
            {userType === "existing" && (
              <>
                <Combobox value={selectedUser} onChange={setSelectedUser}>
                  <div className="relative mt-8">
                    <div className="relative w-72 px-2">
                      <Combobox.Input
                        className="input input-bordered w-72"
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search User"
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
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {user.name}
                                    </span>
                                    {selected ? (
                                      <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                          active ? "text-white" : "text-primary"
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
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Date</span>
                          </label>
                          <input
                            type="date"
                            className="input input-bordered"
                            placeholder="Select Date"
                          />
                        </div>
                        <div className="flex justify-end p-4 sm:p-6 lg:p-8">
                          <button className="btn btn-sm">
                            Create Appointment
                          </button>
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

export default NewAppointment;
