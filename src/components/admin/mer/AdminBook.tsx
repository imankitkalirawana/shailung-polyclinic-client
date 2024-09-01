import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Tooltip,
} from "@nextui-org/react";
import {
  IconHistory,
  IconReport,
  IconUserEdit,
  IconUserPlus,
} from "@tabler/icons-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { calculateAge } from "../../../functions/agecalculator";
import { API_BASE_URL } from "../../../utils/config";
import { humanReadableDate } from "../user/Users";
import { useState, useEffect } from "react";
import { getBothUsers, getUserWithId } from "../../../functions/get";
import { User } from "../../../interface/interface";
import { isLoggedIn } from "../../../utils/auth";
import axios from "axios";
import { toast } from "sonner";
import * as Yup from "yup";
import { useFormik } from "formik";

const AdminBook = () => {
  const { user } = isLoggedIn();

  const [searchParams, setSearchParams] = useSearchParams();
  const userType = searchParams.get("user");
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "recp") {
      navigate("/dashboard");
    }
  }, [user]);

  useEffect(() => {
    if (!userType) {
      navigate("/dashboard/medical-examination?user=new");
    }
  }, [userType]);

  // fetch users if userType is existing
  useEffect(() => {
    if (userType === "existing") {
      fetchUsers();
    }
  }, [userType]);

  const fetchUsers = async () => {
    await getBothUsers().then((data) => {
      setUsers(data);
    });
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

  const handleBooking = async () => {
    if (selectedUser) {
      await axios
        .post(
          `${API_BASE_URL}/api/mer/book-appointment`,
          {
            patientid: selectedUser._id,
            name: selectedUser.name,
            age: calculateAge(selectedUser.dob),
            phone: selectedUser.phone,
            appointmentdate: new Date().toISOString().split("T")[0],
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          //   toast.success("Application submitted successfully");
          toast("Application submitted successfully", {
            action: {
              label: "View",
              onClick: () =>
                navigate("/dashboard/medical-examination/appointments"),
            },
          });
        })
        .catch(() => {
          toast.error("Failed to submit application");
        });
    }
  };

  return (
    <>
      <div className="mx-auto">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">
              New Medical Examination Appointment
            </h1>
            <div className="flex gap-4">
              <Tooltip content="Reports">
                <Button
                  variant="bordered"
                  isIconOnly
                  as={Link}
                  to={"/dashboard/medical-examination/reports"}
                >
                  <IconReport size={16} />
                </Button>
              </Tooltip>
              <Button
                variant="flat"
                color="primary"
                as={Link}
                to={"/dashboard/medical-examination/appointments"}
                startContent={<IconHistory size={16} />}
              >
                Appointment History
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 py-8">
            <div className="max-w-md mx-auto flex flex-col-reverse sm:flex-row-reverse gap-6">
              <Tabs selectedKey={userType} fullWidth>
                <Tab
                  key="existing"
                  title={
                    <div className="flex items-center space-x-2">
                      <IconUserEdit />
                      <span>Existing User</span>
                    </div>
                  }
                  href="/dashboard/medical-examination?user=existing"
                />
                <Tab
                  key="new"
                  title={
                    <div className="flex items-center space-x-2">
                      <IconUserPlus />
                      <span>New User</span>
                    </div>
                  }
                  href="/dashboard/medical-examination?user=new&phone=true"
                />
              </Tabs>
            </div>
            {userType === "new" && <AddUser />}
            {userType === "existing" && (
              <>
                <div className="flex justify-center">
                  <Autocomplete
                    label="Select a user"
                    className="max-w-sm"
                    selectedKey={selectedUser?._id}
                    onSelectionChange={(key) => {
                      const user = users.find((user) => user._id === key);
                      setSelectedUser(user || null);
                    }}
                  >
                    {users.map((user) => (
                      <AutocompleteItem key={user._id} value={user._id}>
                        {user.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                {selectedUser && (
                  <>
                    <Card className="my-10 mx-auto w-[400px]">
                      <CardHeader className="relative flex h-[100px] flex-col justify-end overflow-visible bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
                        <Avatar
                          className="h-20 w-20 translate-y-12"
                          src={`${API_BASE_URL}/api/upload/single/${selectedUser.photo}`}
                        />
                        {user?.role === "admin" && (
                          <Button
                            as={Link}
                            className="absolute right-3 top-3 bg-white/20 text-white dark:bg-black/20"
                            radius="full"
                            size="sm"
                            variant="light"
                            to={`/dashboard/users/${selectedUser._id}/edit`}
                          >
                            Edit Profile
                          </Button>
                        )}
                      </CardHeader>
                      <CardBody>
                        <div className="pb-4 pt-6">
                          <p className="text-large capitalize font-medium">
                            {selectedUser.name}
                          </p>
                          <p className="max-w-[90%] text-small text-default-400">
                            {selectedUser.email &&
                              `${selectedUser.email} | ${selectedUser.phone}`}
                          </p>
                          <div className="flex gap-2 pb-1 pt-2">
                            {selectedUser.dob && (
                              <Chip variant="flat">
                                {calculateAge(selectedUser.dob)} years
                              </Chip>
                            )}
                            <Chip variant="flat" className="capitalize">
                              {selectedUser.role}
                            </Chip>
                            {selectedUser.gender &&
                              selectedUser.gender !== "-" && (
                                <Chip variant="flat" className="capitalize">
                                  {selectedUser.gender}
                                </Chip>
                              )}
                          </div>
                          <p
                            title="Bio"
                            className="py-2 text-small text-foreground"
                          >
                            {selectedUser.bio}
                          </p>
                          <p
                            title="Address"
                            className="py-2 text-small text-foreground"
                          >
                            {selectedUser.address}
                          </p>
                          <div className="flex gap-2">
                            <p>
                              <span className="text-small text-default-400">
                                Created on:{" "}
                                {selectedUser.addeddate &&
                                  humanReadableDate(selectedUser.addeddate)}
                                {selectedUser.addedby &&
                                  " by " + selectedUser.addedby}
                              </span>
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleBooking()}
                          variant="flat"
                          color="primary"
                          fullWidth
                        >
                          Book an Appointment
                        </Button>
                      </CardBody>
                    </Card>
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

export const AddUser = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isPhone = searchParams.get("phone");

  // useEffect to add phone number to true if not presend in searchparams
  useEffect(() => {
    if (!isPhone) {
      setSearchParams({ user: "new", phone: "true" });
    }
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters")
      .required("Name is required"),
    gender: Yup.string().required("Gender is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      gender: "male",
      role: "user",
      dob: "",
      address: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsAdding(true);
        if (values.phone && !values.phone.startsWith("+")) {
          values.phone = "+977" + values.phone;
        }
        await axios
          .post(
            `${API_BASE_URL}/api/admin/user`,
            {
              ...values,
              isPhone: isPhone === "true",
            },
            {
              headers: {
                Authorization: `${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            toast.success("User added successfully");
            window.location.href = `/dashboard/medical-examination?user=existing&userId=${res.data._id}`;
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
      <Card
        as={"form"}
        className="w-full mx-auto max-w-md mt-8 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <CardBody className="space-y-4">
          <RadioGroup
            label="Appointment with:"
            value={isPhone === "true" ? "with-phone" : "without-phone"}
            onChange={(e) => {
              setSearchParams({
                user: e.target.value === "with-phone" ? "new" : "new",
                phone: e.target.value === "with-phone" ? "true" : "false",
              });
            }}
          >
            <Radio value="with-phone">With Phone Number</Radio>
            <Radio value="without-phone">Without Phone number</Radio>
          </RadioGroup>
          <Input
            type="text"
            label="Patient Name"
            placeholder="Enter patient name"
            name="name"
            id="name"
            isRequired
            onChange={formik.handleChange}
            value={formik.values.name}
            isInvalid={formik.touched.name && !!formik.errors.name}
            errorMessage={formik.errors.name}
          />

          <Select
            name="gender"
            label={"Choose Gender"}
            onChange={formik.handleChange}
            value={formik.values.gender}
            isRequired
            isInvalid={formik.touched.gender && !!formik.errors.gender}
            errorMessage={formik.errors.gender}
          >
            <SelectItem key="male">Male</SelectItem>
            <SelectItem key="female">Female</SelectItem>
            <SelectItem key="other">Other</SelectItem>
          </Select>

          {isPhone !== "true" && (
            <Input
              type="text"
              label="Address"
              placeholder="Enter patient address"
              name="address"
              id="address"
              onChange={formik.handleChange}
              value={formik.values.address}
              isRequired
            />
          )}
          {isPhone === "true" && (
            <>
              <Input
                type="text"
                label="Phone Number"
                placeholder="Enter patient phone number"
                name="phone"
                id="phone"
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
                isInvalid={formik.errors.phone ? true : false}
                errorMessage={formik.errors.phone}
              />
              <Input
                type="text"
                name="email"
                label="Email"
                placeholder="Enter patient email"
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
                isInvalid={formik.errors.email ? true : false}
                errorMessage={formik.errors.email}
              />
            </>
          )}
        </CardBody>

        <CardFooter>
          <Button
            type="submit"
            isDisabled={
              isAdding ||
              !formik.values.name ||
              (isPhone === "true" && !formik.values.phone)
            }
            isLoading={isAdding}
            fullWidth
            variant="flat"
            color="primary"
          >
            Register Patient
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default AdminBook;
