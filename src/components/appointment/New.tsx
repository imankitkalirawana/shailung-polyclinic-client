import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DoctorSVG from "../icons/DoctorSVG";
import { HistoryIcon, SquareCrossIcon } from "../icons/Icons";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../../utils/config";
import { isLoggedIn } from "../../utils/auth";
import { Helmet } from "react-helmet-async";
import { calculateAge } from "../../functions/agecalculator";
import { User } from "../../interface/interface";
import { IconInfoCircleFilled, IconXboxXFilled } from "@tabler/icons-react";
import { getUserWithId } from "../../functions/get";

interface Tests {
  _id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

const New = () => {
  const { loggedIn } = isLoggedIn();
  const navigate = useNavigate();
  const [tests, setTests] = useState<Tests[]>([]);
  const [lUser, setUser] = useState<User>({} as User);
  const [selectedTest, setSelectedTest] = useState<Tests>({} as Tests);
  const [submitting, setSubmitting] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");

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
    if (userId) {
      fetchUserById();
    } else {
      fetchUserByProfile();
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      testids: [],
      appointmentdate: "",
      phone: "",
      name: "",
      email: "",
      age: 0,
    },
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
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
          .then(() => {
            setIsConfirm(false);
            setIsModal(true);

            formik.resetForm();
          })
          .catch((error) => {
            toast.error("Failed to book appointment");
            console.error(error);
          });
      } catch (error) {
        toast.error("Failed to book appointment");
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // console.log(formik.values.doctors);

  const fetchSelectedTest = async (id: string) => {
    try {
      if (id === "") return setSelectedTest({} as Tests);
      const { data } = await axios.get(
        `${API_BASE_URL}/api/available-test/${id}`
      );
      setSelectedTest(data);
    } catch (error) {
      toast.error("Failed to fetch test");
      console.error(error);
    }
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
      <div className="container mx-auto p-4 my-24">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Book an Test Appointment</h1>
            <div className="flex gap-2 flex-row-reverse">
              <Link
                to={"/appointment/history"}
                className="btn btn-outline btn-sm hover:btn-primary"
              >
                <HistoryIcon className="h-5 w-5" />
                Appointment History
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse justify-between items-center mt-12 gap-8">
            <div className="flex-1 md:max-w-[50%]">
              <DoctorSVG className="w-full" />
            </div>
            <form
              className="grid grid-cols-2 gap-4 w-full md:max-w-[50%]"
              onSubmit={formik.handleSubmit}
            >
              <>
                {!lUser.name || !calculateAge(lUser.dob || "") ? (
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
                      {userId ? "User" : "You"} have incomplete profile.{" "}
                      <Link
                        to={
                          userId
                            ? `/dashboard/users/${lUser._id}/edit`
                            : "/profile"
                        }
                        className="link"
                      >
                        Update Now
                      </Link>
                    </span>
                  </div>
                ) : (
                  <div
                    role="alert"
                    className="alert mt-4 bg-info/20 col-span-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-info shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>
                      You can update your profile if below information is not
                      displayed or incorrect.{" "}
                      <Link
                        to={
                          userId
                            ? `/dashboard/users/${lUser._id}/edit`
                            : "/profile"
                        }
                        className="link"
                      >
                        Update Now
                      </Link>
                    </span>
                  </div>
                )}
                <div className="form-control col-span-2">
                  <label htmlFor="name" className="label">
                    <span className="label-text">Patient Name</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input input-bordered"
                    placeholder="Patient Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="form-control col-span-2">
                  <label htmlFor="phone" className="label">
                    <span className="label-text">Patient Phone</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="input input-bordered"
                    placeholder="Patient phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    disabled
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      Patient number will be same as registered by the user
                    </span>
                  </label>
                </div>
                {/* patient age */}
                <div className="form-control col-span-2 md:col-span-1">
                  <label htmlFor="age" className="label">
                    <span className="label-text">Patient Age</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    name="age"
                    placeholder="Patient Age"
                    value={formik.values.age}
                    onChange={formik.handleChange}
                  />
                </div>
              </>
              <>
                <div className="form-control col-span-2 md:col-span-1">
                  <label className="label">
                    <span className="label-text">Select Appointment Date</span>
                  </label>
                  <input
                    type="date"
                    name="appointmentdate"
                    className="input input-bordered"
                    placeholder="Select Date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={formik.handleChange}
                    value={formik.values.appointmentdate}
                    required
                  />
                </div>
                <div className="form-control col-span-2">
                  <label className="label">
                    <span className="label-text">Select Tests</span>
                  </label>
                  <div className="m max-h-40 overflow-y-scroll">
                    {tests
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((test, index) => (
                        <div
                          className="flex items-center justify-between"
                          key={index}
                        >
                          <label className="label cursor-pointer flex-row-reverse justify-end gap-4">
                            <span className="label-text">{test.name}</span>
                            <input
                              type="checkbox"
                              className="checkbox checked:checkbox-primary"
                              name="testids"
                              value={test._id}
                              onChange={formik.handleChange}
                            />
                          </label>
                          <button
                            className="btn btn-sm btn-circle"
                            type="button"
                            onClick={() => fetchSelectedTest(test._id)}
                          >
                            <IconInfoCircleFilled
                              className={`${
                                selectedTest._id === test._id
                                  ? "text-info"
                                  : "text-gray-500"
                              } h-6 w-6`}
                            />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
                {selectedTest && selectedTest.name && (
                  <div className="stats bg-base-300 col-span-full w-full">
                    <div className="stat">
                      <div className="stat-title">Test Name</div>
                      <div className="stat-value text-2xl">
                        {selectedTest.name}
                      </div>
                      <div className="stat-actions">
                        <div className="btn btn-sm btn-success">Available</div>
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-title flex items-center justify-between">
                        <span>Current price</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-ghost btn-circle"
                          onClick={() => setSelectedTest({} as Tests)}
                        >
                          <IconXboxXFilled />
                        </button>
                      </div>
                      <div className="stat-value text-2xl">
                        {selectedTest.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </div>
                      <div className="stat-actions">
                        <div className="btn btn-sm">
                          {selectedTest.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="form-control col-span-2">
                  <button
                    className="btn btn-primary w-full"
                    type="button"
                    onClick={() => setIsConfirm(true)}
                    disabled={
                      formik.values.testids.length < 1 ||
                      formik.values.appointmentdate === "" ||
                      formik.values.age === 0 ||
                      formik.values.name === ""
                    }
                  >
                    Book Appointment
                  </button>
                </div>
              </>
            </form>
          </div>
        </div>
      </div>
      {isModal && <SubmittedModal onClose={() => setIsModal(false)} />}
      {isConfirm && (
        <ConfirmModal
          onClose={() => setIsConfirm(false)}
          onConfirm={formik.handleSubmit}
          isLoading={submitting}
        />
      )}
    </>
  );
};

interface ModalProps {
  onClose: () => void;
}

// submitted modal
const SubmittedModal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <>
      <div className="modal modal-open backdrop-blur-md" role="dialog">
        <div className="modal-box">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">
              Appointment Booked Successfully!
            </h3>
            <button className="rounded-2xl" onClick={onClose}>
              <SquareCrossIcon className="h-8 w-8" />
            </button>
          </div>
          <p className="py-4">
            Your appointment has been booked successfully. You can check your
            appointment history by clicking the button below.
          </p>
          <div className="modal-action">
            <Link to="/appointment/history" className="btn btn-primary">
              View Appointment History
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

interface ConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

// confirm modal
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onClose,
  onConfirm,
  isLoading,
}) => {
  return (
    <>
      <div className="modal modal-open backdrop-blur-md" role="dialog">
        <div className="modal-box max-w-md">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Confirm Appointment</h3>
          </div>
          <p className="py-4">
            Are you sure you want to book this appointment? Please confirm.
          </p>
          <div className="modal-action flex">
            <button
              className="btn btn-primary flex-1"
              onClick={() => {
                onConfirm();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                "Confirm"
              )}
            </button>
            <button
              className="btn flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default New;
