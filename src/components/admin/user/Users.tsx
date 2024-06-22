import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";
import { ExportTableIcon } from "../../icons/Icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useFormik } from "formik";
import { Roles } from "../../../utils/config";
import * as XLSX from "xlsx";
import { getAllUnknownUsers, getAllUsers } from "../../../functions/get";
import { deleteUser } from "../../../functions/delete";
import { isLoggedIn } from "../../../utils/auth";
import { User } from "../../../interface/interface";
import { parseDate } from "@internationalized/date";
import * as yup from "yup";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dropdown,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Tooltip,
  Select,
  SelectItem,
  DatePicker,
} from "@nextui-org/react";
import {
  IconArrowUpRight,
  IconCalendarClock,
  IconDotsVertical,
  IconPencil,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const deleteAccountModal = useDisclosure();
  const addUserModal = useDisclosure();

  const handleDelete = async (user: User | null) => {
    try {
      if (!user?.phone) {
        await axios
          .delete(`${API_BASE_URL}/api/admin/unknown-user/${user?._id}`, {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          })
          .then(() => {
            fetchAllUnknownUsers();
            toast.success(`${user?.name} was deleted successfully`);
          });
      } else {
        await deleteUser(user._id).then(() => {
          fetchAllUsers(userType);
          toast.success(`${user?.name} was deleted successfully`);
        });
      }
    } catch (error: any) {
      console.log(error.response.data);
      toast.error("Error deleting user");
    }
  };

  useEffect(() => {
    if (!isPhone) {
      setSearchParams({
        type: "all",
        phone: "true",
      });
    }
  }, []);

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

  useEffect(() => {
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
  // @ts-ignore
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

  const handleRowClick = (id: any) => {
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
      <div className="mx-auto">
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
                <Button
                  as={Link}
                  variant="flat"
                  color="primary"
                  to={"?action=new"}
                  onClick={addUserModal.onOpenChange}
                >
                  Add User
                </Button>
                {user?.role === "admin" && (
                  <Tooltip content="Export to Excel">
                    <Button
                      radius="full"
                      variant="bordered"
                      data-tip="Export to Excel"
                      onClick={() => {
                        exportToExcel();
                      }}
                      isIconOnly
                    >
                      <ExportTableIcon className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-4 my-8 overflow-x-scroll">
            <Chip
              as={Link}
              radius="sm"
              color={isPhone !== "false" ? "success" : "default"}
              to={`/dashboard/users?type=all&phone=true`}
            >
              With Phone
            </Chip>
            <Chip
              radius="sm"
              as={Link}
              color={isPhone === "false" ? "success" : "default"}
              to={`/dashboard/users?type=user&phone=false`}
            >
              Without Phone
            </Chip>
          </div>
          <div className="relative w-full max-w-md mb-4">
            <Input
              type="text"
              placeholder="Search users"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              endContent={<IconSearch size={16} />}
            />
          </div>
          <Table
            topContent={
              <span className="text-default-400 text-small">
                Total{" "}
                {
                  users.filter((user) => {
                    return handleSearch(user);
                  }).length
                }{" "}
                users
              </span>
            }
            aria-label="Users"
            onRowAction={(key) => handleRowClick(key)}
            selectionMode="single"
          >
            <TableHeader>
              <TableColumn allowsSorting key="role">
                Role
              </TableColumn>
              <TableColumn allowsSorting key="name">
                Name
              </TableColumn>
              <TableColumn key="email">Email</TableColumn>
              <TableColumn key="phone">Phone</TableColumn>
              <TableColumn key="date">Added On</TableColumn>
              <TableColumn key="modify">Actions</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={"No rows to display."}
              items={users.filter((user) => {
                return handleSearch(user);
              })}
            >
              {(user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Chip
                      variant="dot"
                      // @ts-ignore
                      color={
                        Roles.find((role) => role.value === user.role)?.color
                      }
                    >
                      {user.role}
                    </Chip>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{humanReadableDate(user.updatedat)}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="light"
                          radius="full"
                          size="sm"
                          isIconOnly
                        >
                          <IconDotsVertical size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Actions">
                        <DropdownItem
                          startContent={<IconArrowUpRight size={16} />}
                          key="view"
                          onPress={() => handleRowClick(user._id)}
                        >
                          View User
                        </DropdownItem>
                        <DropdownItem
                          startContent={<IconCalendarClock size={16} />}
                          key="create-appointment"
                          color="success"
                          onPress={() => {
                            navigate(
                              `/appointment/new?user=${user._id}&phone=${isPhone}`
                            );
                          }}
                        >
                          Create an Appointment
                        </DropdownItem>
                        <DropdownItem
                          startContent={<IconPencil size={16} />}
                          key="edit"
                          color="warning"
                          onPress={() =>
                            navigate(`/dashboard/users/${user._id}/edit`)
                          }
                          className={`${
                            loggedUser?.role !== "admin" && "hidden"
                          }`}
                        >
                          Edit User
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className={`text-danger ${
                            loggedUser?.role !== "admin" && "hidden"
                          }`}
                          color="danger"
                          startContent={<IconTrash size={16} />}
                          onPress={() => {
                            deleteAccountModal.onOpen();
                            setSelectedUser(user);
                          }}
                        >
                          Delete User
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <AddUser addUserModal={addUserModal} />

      <Modal
        isOpen={deleteAccountModal.isOpen}
        onOpenChange={deleteAccountModal.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <p>Are you sure you want to delete {selectedUser?.name}</p>
              </ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter className="flex-col-reverse sm:flex-row">
                <Button
                  color="default"
                  fullWidth
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  fullWidth
                  onPress={() => {
                    handleDelete(selectedUser);
                    deleteAccountModal.onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

interface AddUserProps {
  addUserModal: any;
}

const AddUser = ({ addUserModal }: AddUserProps) => {
  const { user } = isLoggedIn();

  const userSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters")
      .required("Name is required"),
    email: yup.string().email().required("Email is required"),
    phone: yup.string().required("Phone is required"),
    dob: yup.string().required("Date of birth is required"),
    gender: yup.string().required("Gender is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      gender: "",
      dob: "2000-01-01",
      role: "user",
      isPhone: true,
    },
    validationSchema: userSchema,

    onSubmit: async (values) => {
      try {
        if (values.phone && !values.phone.startsWith("+")) {
          values.phone = "+" + values.phone;
        }
        console.log(values);
        await axios.post(`${API_BASE_URL}/api/admin/user`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("User added successfully");
        addUserModal.onOpenChange();
        // navigate(0);
      } catch (error: any) {
        toast.error(error.response.data.error);
        console.log(error);
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
      <Modal
        isOpen={addUserModal.isOpen}
        onOpenChange={addUserModal.onOpenChange}
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Register New User
          </ModalHeader>
          <ModalBody
            as={"form"}
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit;
            }}
          >
            <Input
              label="Name"
              placeholder="Enter name"
              type="text"
              name="name"
              id="name"
              isRequired
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={
                formik.touched.name && formik.errors.name ? true : false
              }
              errorMessage={formik.errors.name}
            />

            <Select
              name="gender"
              id="gender"
              isRequired
              onChange={formik.handleChange}
              value={formik.values.gender}
              label="Gender"
              selectedKeys={[formik.values.gender]}
              isInvalid={
                formik.touched.gender && formik.errors.gender ? true : false
              }
              errorMessage={formik.errors.gender}
            >
              <SelectItem key="male">Male</SelectItem>
              <SelectItem key="female">Female</SelectItem>
              <SelectItem key="other">Other</SelectItem>
            </Select>
            <DatePicker
              label="Date of Birth"
              onChange={(date) => {
                formik.setFieldValue("dob", date.toString().split("T")[0]);
              }}
              value={parseDate(formik.values.dob)}
              name="dob"
              id="dob"
              isRequired
              isInvalid={formik.errors.dob ? true : false}
              errorMessage={formik.errors.dob}
              showMonthAndYearPickers
            />

            <Input
              type="text"
              name="email"
              placeholder="eg: johndoe@example.com"
              label="Email"
              id="email"
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
              value={formik.values.email}
              isRequired
              isInvalid={
                formik.touched.email && formik.errors.email ? true : false
              }
              errorMessage={formik.errors.email}
            />

            <Input
              type="text"
              name="phone"
              id="phone"
              label="Phone"
              placeholder="e.g. 987654321"
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
              isRequired
              isInvalid={
                formik.touched.phone && formik.errors.phone ? true : false
              }
              errorMessage={formik.errors.phone}
              description="Please don't include country code"
            />
            {user?.role === "admin" && (
              <Select
                name="role"
                id="role"
                isRequired
                onChange={formik.handleChange}
                value={formik.values.role}
                label="Role"
                selectedKeys={[formik.values.role]}
              >
                {Roles.map((role) => (
                  <SelectItem key={role.value}>{role.label}</SelectItem>
                ))}
              </Select>
            )}
          </ModalBody>
          <ModalFooter className="flex-col-reverse sm:flex-row">
            <Button
              variant="flat"
              onClick={addUserModal.onOpenChange}
              type="button"
              fullWidth
              isDisabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={formik.isSubmitting}
              isLoading={formik.isSubmitting}
              color="primary"
              variant="flat"
              fullWidth
              onClick={() => formik.handleSubmit()}
            >
              Add User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Users;
