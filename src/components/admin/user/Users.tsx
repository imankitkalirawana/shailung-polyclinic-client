import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";
import {
  EditIcon,
  ExportTableIcon,
  LeftAngle,
  RightAngle,
  SearchIcon,
  TrashXIcon,
} from "../../icons/Icons";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";
import { useFormik } from "formik";
import { Roles } from "../../../utils/config";
import * as XLSX from "xlsx";
import NotFound from "../../NotFound";
import { getAllUnknownUsers, getAllUsers } from "../../../functions/get";
import { deleteUser } from "../../../functions/delete";
import { isLoggedIn } from "../../../utils/auth";
import { User } from "../../../interface/interface";

export const humanReadableDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = isLoggedIn();
  const [searchParams, setSearchParams] = useSearchParams();
  const userType = searchParams.get("type");
  const isPhone = searchParams.get("phone");
  const offset = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [initialItem, setInitialItem] = useState(0);
  const [finalItem, setFinalItem] = useState(offset);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    if (!isPhone) {
      setSearchParams({
        type: "user",
        phone: "true",
      });
    }
  }, []);

  useEffect(() => {
    const fetchAllUsers = async (userType: any) => {
      if (userType === "employee" && user?.role === "admin") {
        const users = await getAllUsers("employee");
        setUsers(users);
      } else if (userType === "employee" && user?.role !== "user") {
        const users = await getAllUsers("user");
        setUsers(users);
      } else if (userType === "user") {
        const users = await getAllUsers("user");
        setUsers(users);
      } else {
        const users = await getAllUsers("all");
        setUsers(users);
      }
    };
    const fetchAllUnknownUsers = async () => {
      const users = await getAllUnknownUsers();
      setUsers(users);
    };
    if (isPhone === "false") {
      fetchAllUnknownUsers();
    } else {
      fetchAllUsers(userType);
    }
  }, [isPhone]);

  const handleSearch = (user: any) => {
    if (searchQuery === "") {
      return user;
    } else if (
      (user.email &&
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.phone &&
        user.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.name &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.address &&
        user.address.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return user;
    }
  };

  // sort users function
  const sortUsers = (type: string) => {
    let sortedUsers = [...users];
    if (type === "name") {
      sortedUsers.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    } else if (type === "email") {
      sortedUsers.sort((a, b) => {
        if (a.email < b.email) {
          return -1;
        }
        if (a.email > b.email) {
          return 1;
        }
        return 0;
      });
    } else if (type === "phone") {
      sortedUsers.sort((a, b) => {
        if (a.phone < b.phone) {
          return -1;
        }
        if (a.phone > b.phone) {
          return 1;
        }
        return 0;
      });
    } else if (type === "role") {
      sortedUsers.sort((a, b) => {
        if (a.role < b.role) {
          return -1;
        }
        if (a.role > b.role) {
          return 1;
        }
        return 0;
      });
    } else if (type === "date") {
      sortedUsers.sort((a, b) => {
        if (a.updatedat < b.updatedat) {
          return 1;
        }
        if (a.updatedat > b.updatedat) {
          return -1;
        }
        return 0;
      });
    }
    setUsers(sortedUsers);
  };

  const handleRowClick = (id: string, e: any) => {
    if (
      e.target.classList.contains("button") ||
      e.target.classList.contains("btn") ||
      e.target.classList.contains("modify") ||
      e.target.nodeName.toLowerCase() === "svg" ||
      e.target.nodeName.toLowerCase() === "path"
    ) {
      return;
    }
    navigate(`/dashboard/users/${id}`);
  };

  const exportToExcel = async () => {
    const fileName = "users";
    let response = await axios.get(
      `${API_BASE_URL}/api/admin/users/export?type=${userType}`,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );
    const data = response.data;

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const loggedUser = user;

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h1 className="my-6 text-2xl font-semibold">
              {userType === "employee"
                ? "Employees"
                : userType === "user"
                ? "Users"
                : "All Users"}
            </h1>
            {isPhone !== "false" && (
              <div className="flex gap-2 flex-row-reverse">
                <Link to={"?action=new"} className="btn btn-primary btn-sm">
                  <span>Add User</span>
                </Link>
                {user?.role === "admin" && (
                  <button
                    className="btn btn-outline hover:btn-primary btn-sm btn-circle tooltip tooltip-bottom flex"
                    data-tip="Export to Excel"
                    onClick={() => {
                      exportToExcel();
                    }}
                  >
                    <ExportTableIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-4 my-8 overflow-x-scroll">
            <Link
              className={`btn btn-sm ${
                isPhone === "true" ? "btn-primary" : ""
              }`}
              to={`/dashboard/users?type=user&phone=true`}
            >
              With Phone
            </Link>
            <Link
              className={`btn btn-sm ${
                isPhone === "false" ? "btn-primary" : ""
              }`}
              to={`/dashboard/users?type=user&phone=false`}
            >
              Without Phone
            </Link>
          </div>
          <div className="relative w-full max-w-md mb-4">
            <input
              type="text"
              className="input input-bordered ml-1 w-full"
              placeholder="Search users"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <SearchIcon className="absolute top-3 right-4 w-6 h-6 text-primary" />
          </div>
          {users.filter((user) => {
            return handleSearch(user);
          }).length > 0 ? (
            <div className={`w-full overflow-x-auto card`}>
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left uppercase border-b bg-primary/20 cursor-pointer">
                    <th
                      className="px-4 py-3 hover:bg-primary/10"
                      onClick={() => {
                        sortUsers("role");
                      }}
                    >
                      Role
                    </th>
                    <th
                      className="px-4 py-3 hover:bg-primary/10"
                      onClick={() => {
                        sortUsers("name");
                      }}
                    >
                      User
                    </th>
                    <th
                      className="px-4 py-3 hover:bg-primary/10"
                      onClick={() => {
                        sortUsers("email");
                      }}
                    >
                      {isPhone === "false" ? "Address" : "Email"}
                    </th>
                    <th
                      className="px-4 py-3 hover:bg-primary/10"
                      onClick={() => {
                        sortUsers("phone");
                      }}
                    >
                      {isPhone === "false" ? "DOB" : "Phone"}
                    </th>
                    {isPhone === "false" && (
                      <th className="px-4 py-3 hover:bg-primary/10">
                        Added By
                      </th>
                    )}

                    <th
                      className="px-4 py-3 hover:bg-primary/10"
                      onClick={() => {
                        sortUsers("date");
                      }}
                    >
                      Date
                    </th>
                    {user?.role === "admin" && (
                      <th className="px-4 py-3">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-primary/10 divide-y">
                  {users
                    .filter((user) => {
                      return handleSearch(user);
                    })
                    .slice(initialItem, finalItem)
                    .map(
                      (user, index) =>
                        user.email !== "divinelydeveloper@gmail.com" && (
                          <tr
                            key={index}
                            className={`${
                              isPhone !== "false" &&
                              "cursor-pointer hover:bg-primary/5"
                            }`}
                            role="button"
                            onClick={(e) => {
                              if (isPhone !== "false") {
                                handleRowClick(user._id, e);
                              }
                            }}
                          >
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`badge tooltip tooltip-right ${
                                  Roles.find((role) => role.value === user.role)
                                    ?.color
                                }`}
                                data-tip={
                                  Roles.find((role) => role.value === user.role)
                                    ?.label
                                }
                              ></span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center text-sm">
                                <div>
                                  <p className="font-semibold text-nowrap">
                                    {user.name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-nowrap">
                              {isPhone === "false"
                                ? user.address
                                : user.email
                                ? user.email
                                : "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-nowrap">
                              {isPhone === "false"
                                ? humanReadableDate(user.dob)
                                : user.phone
                                ? user.phone
                                : "-"}
                            </td>
                            {isPhone === "false" && (
                              <td className="px-4 py-3 text-sm text-nowrap">
                                {user.addedby}
                              </td>
                            )}

                            <td className="px-4 py-3 text-sm text-nowrap">
                              {humanReadableDate(user.updatedat)}
                            </td>
                            {loggedUser?.role === "admin" && (
                              <td className="px-4 py-3 text-sm flex items-center gap-4 justify-center modify">
                                {isPhone !== "false" && (
                                  <Link
                                    to={`/dashboard/users/${user._id}/edit`}
                                    className="btn btn-sm btn-circle tooltip tooltip-info flex items-center justify-center btn-ghost"
                                    aria-label="Edit"
                                    data-tip="Edit"
                                  >
                                    <EditIcon className="w-4 h-4 button" />
                                  </Link>
                                )}
                                <button
                                  className="btn btn-sm btn-circle flex justify-center items-center tooltip-error tooltip btn-ghost hover:btn-outline"
                                  aria-label="Delete"
                                  onClick={() => handleDeleteClick(user)}
                                  data-tip="Delete"
                                >
                                  <TrashXIcon className="w-4 h-4 button" />
                                </button>
                              </td>
                            )}
                          </tr>
                        )
                    )}
                  <tr className="bg-primary/20">
                    <td
                      className="px-4 py-3 text-sm"
                      colSpan={
                        user?.role === "admin"
                          ? isPhone === "false"
                            ? 6
                            : 5
                          : 4
                      }
                    >
                      Showing {initialItem + 1}-{finalItem} of {users.length}
                    </td>
                    <td className="px-4 py-3 text-sm flex justify-end">
                      <button
                        className="btn btn-sm btn-ghost btn-circle"
                        aria-label="Previous"
                        onClick={() => {
                          if (initialItem > 0) {
                            setInitialItem(initialItem - offset);
                            setFinalItem(finalItem - offset);
                          }
                        }}
                      >
                        <LeftAngle className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        className="btn btn-sm btn-ghost btn-circle"
                        aria-label="Next"
                        onClick={() => {
                          if (finalItem < users.length) {
                            setInitialItem(initialItem + offset);
                            setFinalItem(finalItem + offset);
                          }
                        }}
                      >
                        <RightAngle className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <NotFound message="No users found" />
          )}
        </div>
      </div>
      <AddUser />
      {selectedUser && (
        <DeleteModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          setUsers={setUsers}
        />
      )}
    </>
  );
};

interface DeleteModalProps {
  user: User;
  onClose: () => void;
  setUsers: any;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  user,
  onClose,
  setUsers,
}) => {
  const [searchParams] = useSearchParams();
  const isPhone = searchParams.get("phone");
  const handleDelete = async (user: User) => {
    try {
      if (!user.phone) {
        await axios.delete(
          `${API_BASE_URL}/api/admin/unknown-user/${user._id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        fetchUsers();
      } else {
        await deleteUser(user._id).then(() => {
          fetchUsers();
        });
      }
      toast.success("User deleted successfully");
      onClose();
    } catch (error: any) {
      console.log(error.response.data);
      toast.error("Error deleting user");
    }
  };
  const fetchUsers = async () => {
    try {
      if (isPhone !== "false") {
        const users = await getAllUsers("all");
        setUsers(users);
      } else {
        const users = await getAllUnknownUsers();
        setUsers(users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  return (
    <>
      <div
        className="modal modal-open modal-bottom xs:modal-middle backdrop-blur-sm"
        role="dialog"
      >
        <div className="modal-box w-full sm:max-w-sm">
          <h3 className="font-bold text-lg text-center">
            Delete <i>{user.email}</i>
          </h3>
          <p className="py-4">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="modal-action flex flex-col xs:flex-row gap-2">
            <button
              className="btn btn-error flex-1"
              onClick={() => handleDelete(user)}
            >
              Delete
            </button>
            <button className="btn flex-1" onClick={onClose}>
              Close!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const AddUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdding, setIsAdding] = useState(false);
  const { user } = isLoggedIn();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      gender: "male",
      dob: "",
      role: "user",
    },

    onSubmit: async (values) => {
      try {
        setIsAdding(true);
        if (values.phone && !values.phone.startsWith("+")) {
          values.phone = "+" + values.phone;
        }
        await axios.post(`${API_BASE_URL}/api/admin/user`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("User added successfully");
        navigate(0);
      } catch (error: any) {
        toast.error(error.response.data.error);
        console.log(error);
      }
      setIsAdding(false);
    },
  });
  return (
    <>
      <input type="checkbox" id="add_user" className="modal-toggle" />
      <div
        className={`modal modal-bottom xs:modal-middle ${
          action === "new" ? "modal-open" : ""
        } backdrop-blur-sm`}
        role="dialog"
      >
        <div className="modal-box w-full">
          <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
            <form className="w-full max-w-md" onSubmit={formik.handleSubmit}>
              <h3 className="mb-6 text-3xl font-bold text-center">Add User</h3>
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
                >
                  <option disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="dob" className="label">
                  <span className="label-text">DOB</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  name="dob"
                  id="dob"
                  onChange={formik.handleChange}
                  value={formik.values.dob}
                  required
                />
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
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required
                />
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
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  required
                />
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

              <div className="modal-action flex flex-col xs:flex-row gap-2">
                <button
                  className="btn btn-primary flex-1 w-full"
                  type="submit"
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <>
                      <span className="loading loading-dots loading-sm"></span>
                    </>
                  ) : (
                    "Add User"
                  )}
                </button>
                <button
                  className="btn flex-1 w-full"
                  type="button"
                  onClick={() => {
                    const url = location.pathname;
                    url.replace("?action=new", "");
                    navigate(url);
                  }}
                >
                  Cancel!
                </button>
              </div>
            </form>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="add_user">
          Close
        </label>
      </div>
    </>
  );
};

export default Users;
