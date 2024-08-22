import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { HistoryIcon } from "../icons/Icons";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../../utils/config";
import { isLoggedIn } from "../../utils/auth";
import { Helmet } from "react-helmet-async";
import { calculateAge } from "../../functions/agecalculator";
import { User } from "../../interface/interface";
import { parseDate } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import * as Yup from "yup";

import { IconHistory, IconInfoCircle, IconXboxX } from "@tabler/icons-react";
import { getUnknownUser, getUserWithId } from "../../functions/get";
import {
  Button,
  Card,
  Chip,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Link as NextLink,
  Tooltip,
  CardBody,
  CardFooter,
  ScrollShadow,
} from "@nextui-org/react";

interface Tests {
  _id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

const New = () => {
  const { loggedIn, user } = isLoggedIn();
  const navigate = useNavigate();
  const [tests, setTests] = useState<Tests[]>([]);
  const [lUser, setUser] = useState<User>({} as User);
  const [selectedTest, setSelectedTest] = useState<Tests>({} as Tests);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");
  const isPhone = searchParams.get("phone");
  const [searchQuery, setSearchQuery] = useState("");
  const confirmModal = useDisclosure();

  useEffect(() => {
    if (!loggedIn) {
      window.location.href = "/auth/login";
    }
    const fetchTests = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/available-test/active`
        );
        setTests(data);
      } catch (error) {
        toast.error("Failed to fetch tests");
        console.error(error);
      }
    };
    fetchTests();
    const fetchUserByProfile = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        setUser(data);
        formik.setValues({
          ...formik.values,
          phone: data.phone,
          email: data.email,
          name: data.name,
          age: calculateAge(data.dob || ""),
        });
        if (data.name === "" || data.phone === "") {
          toast.error("Please update your profile to continue", {
            id: "update-profile",
          });
          navigate("/profile");
        }
      } catch (error) {
        toast.error("Failed to fetch user");
        console.error(error);
      }
    };
    const fetchUserById = async () => {
      try {
        const { data } = await getUserWithId(userId as string);
        setUser(data);
        formik.setValues({
          ...formik.values,
          phone: data.phone,
          email: data.email,
          name: data.name,
          age: calculateAge(data.dob),
        });
      } catch (error) {
        toast.error("Failed to fetch user");
        console.error(error);
      }
    };

    const fetchUnknownUserById = async () => {
      const data = await getUnknownUser(userId as string);
      setUser(data);
      formik.setValues({
        ...formik.values,
        name: data.name,
        age: calculateAge(data.dob),
      });
    };
    if (userId) {
      if (isPhone === "false") {
        fetchUnknownUserById();
      } else {
        fetchUserById();
      }
    } else {
      fetchUserByProfile();
    }
  }, []);

  const validationSchema = Yup.object().shape({
    age: Yup.number().required("Age is required").min(1, "Age should be 1+"),
    name: Yup.string().required("Name is required"),
    appointmentdate: Yup.string().required("Appointment date is required"),
    testids: Yup.array()
      .of(Yup.string())
      .min(1)
      .max(5)
      .required("Select at least one test"),
  });

  const formik = useFormik({
    initialValues: {
      testids: [],
      appointmentdate: new Date().toISOString().split("T")[0],
      phone: "",
      name: "",
      email: "",
      age: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await axios
          .post(
            `${API_BASE_URL}/api/test`,
            {
              testids: values.testids,
              appointmentdate: values.appointmentdate,
              phone: lUser.phone,
              name: values.name,
              age: values.age,
              email: lUser.email,
            },
            {
              headers: {
                Authorization: `${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            console.log(res.data);
            confirmModal.onClose();
            toast("Appointment Booked Succesfully", {
              action: {
                label: "View",
                onClick: () => {
                  navigate(
                    `${
                      user?.role === "user"
                        ? "/appointment/history"
                        : "/dashboard/tests?status=booked"
                    }`
                  );
                },
              },
              duration: Infinity,
            });
          })
          .catch((error) => {
            toast.error("Failed to book appointment");
            console.error(error);
          });
      } catch (error) {
        toast.error("Failed to book appointment");
        console.error(error);
      }
    },
  });

  // const fetchSelectedTest = async (id: string) => {
  //   try {
  //     if (id === "") return setSelectedTest({} as Tests);
  //     const { data } = await axios.get(
  //       `${API_BASE_URL}/api/available-test/${id}`
  //     );
  //     setSelectedTest(data);
  //   } catch (error) {
  //     toast.error("Failed to fetch test");
  //     console.error(error);
  //   }
  // };

  const handleSearch = (test: any) => {
    if (searchQuery === "") return true;
    if (
      (test.name &&
        test.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (test.uniqueid &&
        test.uniqueid.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Helmet>
        <title>New Appointment - Shailung Polyclinic</title>
        <meta
          name="description"
          content="Book an appointment for a test at Shailung Polyclinic in Itahari, Nepal"
        />
        <meta
          name="keywords"
          content="appointment, book, test, shailung polyclinic, itahari, nepal, health, medical, clinic"
        />
        <link
          rel="canonical"
          href="https://report.shailungpolyclinic.com/appointment/new"
        />
      </Helmet>
      <div className="w-full p-4 mt-24 max-w-6xl mx-auto shadow-xs">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Book an Test Appointment</h1>
          {user?.role === "user" && (
            <div className="flex gap-2 flex-row-reverse">
              <Button
                as={Link}
                to={"/appointment/history"}
                variant="bordered"
                className="hidden sm:flex"
                startContent={<HistoryIcon className="h-5 w-5" />}
              >
                Appointment History
              </Button>
              <Tooltip content="Appointment History" color="primary">
                <Button
                  as={Link}
                  isIconOnly
                  radius="full"
                  variant="flat"
                  color="primary"
                  to="/appointment/history"
                  className="sm:hidden flex items-center justify-center"
                >
                  <IconHistory className="h-5 w-5" />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between items-center mt-12 gap-8">
          <Card
            as={"form"}
            className="grid p-4 grid-cols-2 gap-4 w-full"
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit;
            }}
          >
            {isPhone !== "false" && (
              <>
                {!lUser.name || !calculateAge(lUser.dob || "") ? (
                  <div
                    role="alert"
                    className="alert mt-4 bg-error/20 col-span-full"
                  >
                    <IconInfoCircle className="stroke-danger" />
                    <span>
                      {userId ? "User" : "You"} have incomplete profile.{" "}
                      <NextLink
                        as={Link}
                        underline="hover"
                        color="danger"
                        to={
                          userId
                            ? `/dashboard/users/${lUser._id}/edit`
                            : "/profile"
                        }
                      >
                        Update Now
                      </NextLink>
                    </span>
                  </div>
                ) : (
                  <Card
                    role="alert"
                    className="alert mt-4 flex-row col-span-full"
                    shadow="lg"
                  >
                    <IconInfoCircle className="stroke-warning" />
                    <span>
                      You can update your profile if below information is not
                      displayed or incorrect.{" "}
                      <NextLink
                        as={Link}
                        underline="hover"
                        color="warning"
                        to={
                          userId
                            ? `/dashboard/users/${lUser._id}/edit`
                            : "/profile"
                        }
                      >
                        Update Now
                      </NextLink>
                    </span>
                  </Card>
                )}
              </>
            )}
            <>
              <div className="col-span-2">
                <Input
                  type="text"
                  id="name"
                  name="name"
                  label="Patient Name"
                  placeholder="Patient name"
                  variant="bordered"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  isRequired
                  isInvalid={
                    formik.touched.name && formik.errors.name ? true : false
                  }
                  errorMessage={formik.touched.name && formik.errors.name}
                />
              </div>
              {isPhone !== "false" && (
                <div className="col-span-2">
                  <Input
                    type="text"
                    id="phone"
                    name="phone"
                    label="Patient Phone"
                    placeholder="Patient phone"
                    variant="bordered"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    description="Patient phone number will be same as registered by the user"
                  />
                </div>
              )}
              <div className="col-span-2 md:col-span-1">
                <Input
                  type="number"
                  name="age"
                  id="age"
                  label="Patient Age"
                  placeholder="Patient Age"
                  variant="bordered"
                  isRequired
                  // @ts-ignore
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  min={0}
                  isInvalid={
                    formik.touched.age && formik.errors.age ? true : false
                  }
                  errorMessage={formik.touched.age && formik.errors.age}
                />
              </div>
            </>
            <>
              <div className="col-span-2 md:col-span-1">
                <DatePicker
                  name="appointmentdate"
                  label="Appointment Date"
                  variant="bordered"
                  value={parseDate(formik.values.appointmentdate)}
                  minValue={today(getLocalTimeZone())}
                  onChange={(date) => {
                    formik.setFieldValue(
                      "appointmentdate",
                      date.toString().split("T")[0]
                    );
                  }}
                  isRequired
                  showMonthAndYearPickers
                  isInvalid={
                    formik.touched.appointmentdate &&
                    formik.errors.appointmentdate
                      ? true
                      : false
                  }
                  errorMessage={
                    formik.touched.appointmentdate &&
                    formik.errors.appointmentdate
                  }
                />
              </div>
              <div className="form-control col-span-2">
                <Input
                  type="text"
                  placeholder="Search Tests By Name, Unique ID"
                  variant="bordered"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {tests.filter((test) => handleSearch(test)).length < 1 ? (
                  <p className="text-sm mt-4 text-center text-gray-500">
                    No tests available
                  </p>
                ) : (
                  <>
                    <label className="label">
                      <span className="label-text">Select Tests</span>
                    </label>
                    <ScrollShadow className="h-48 overflow-y-scroll">
                      {tests
                        .filter((test) => handleSearch(test))
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((test) => (
                          <div className="form-control" key={test._id}>
                            <label className="label cursor-pointer">
                              <span className="label-text">{test.name}</span>
                              <input
                                type="checkbox"
                                className="checkbox"
                                name="testids"
                                value={test._id}
                                onChange={formik.handleChange}
                                checked={formik.values.testids.includes(
                                  // @ts-ignore
                                  test._id
                                )}
                              />
                            </label>
                          </div>
                        ))}
                    </ScrollShadow>
                    {formik.touched.testids && formik.errors.testids && (
                      <label className="label">
                        <span className="label-text text-error">
                          {formik.errors.testids}
                        </span>
                      </label>
                    )}
                  </>
                )}
              </div>
              {selectedTest && selectedTest.name && (
                <Card
                  className="mx-auto mt-8 col-span-full border-small border-default-100 p-3"
                  shadow="sm"
                >
                  <CardBody className="px-4 pb-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex max-w-[80%] flex-col gap-1">
                        <p className="text-sm sm:text-medium font-medium">
                          {selectedTest.name}
                        </p>
                        <Chip>
                          NPR{" "}
                          {selectedTest.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Chip>
                      </div>
                      <Button
                        variant="flat"
                        size="sm"
                        isIconOnly
                        radius="full"
                        onClick={() => setSelectedTest({} as Tests)}
                      >
                        <IconXboxX />
                      </Button>
                    </div>
                  </CardBody>
                  <CardFooter className="justify-between gap-2">
                    <Button size="sm" variant="faded">
                      Done within {selectedTest.duration}
                    </Button>
                    <Chip color="success" variant="dot">
                      Available
                    </Chip>
                  </CardFooter>
                </Card>
              )}
              {formik.values.testids.length > 0 && (
                <div className="col-span-2">
                  <label className="label">
                    <span className="label-text">Selected Tests</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {formik.values.testids.map((testid, index) => {
                      const test = tests.find((t) => t._id === testid);
                      return (
                        <Chip
                          key={index}
                          variant="flat"
                          className="flex items-center justify-between"
                          onClose={() => {
                            formik.setFieldValue(
                              "testids",
                              formik.values.testids.filter(
                                (tid) => tid !== testid
                              )
                            );
                          }}
                        >
                          <span>{test?.name}</span>
                        </Chip>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="form-control col-span-2">
                <Button
                  variant="flat"
                  color="primary"
                  onClick={confirmModal.onOpenChange}
                >
                  Book Appointment
                </Button>
              </div>
            </>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onOpenChange={confirmModal.onOpenChange}
        backdrop="opaque"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <p>Are you sure you want to book this appointment?</p>
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-2 flex-wrap">
                  {formik.values.testids.map((testid, index) => {
                    const test = tests.find((t) => t._id === testid);
                    return (
                      <Chip
                        key={index}
                        variant="flat"
                        className="flex items-center justify-between"
                      >
                        <span>{test?.name}</span>
                      </Chip>
                    );
                  })}
                </div>
              </ModalBody>
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
                  color="primary"
                  variant="flat"
                  fullWidth
                  isDisabled={formik.isSubmitting}
                  isLoading={formik.isSubmitting}
                  onPress={() => {
                    formik.handleSubmit();
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default New;
