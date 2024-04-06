import { Link } from "react-router-dom";
import DoctorSVG from "../icons/DoctorSVG";
import { HistoryIcon, SquareCrossIcon } from "../icons/Icons";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../../utils/config";
import { isLoggedIn } from "../../utils/auth";

interface Tests {
  _id: number;
  name: string;
  price: number;
  duration: string;
  description: string;
}

interface User {
  _id: string;
  name: string;
  phone: string;
  address: string;
  age: number;
  email: string;
}

const New = () => {
  const { loggedIn } = isLoggedIn();

  const [tests, setTests] = useState<Tests[]>([]);
  const [user, setUser] = useState<User>({} as User);
  const [selectedTest, setSelectedTest] = useState<Tests>({} as Tests);
  const [submitting, setSubmitting] = useState(false);
  const [isModal, setIsModal] = useState(false);

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
    const fetchUser = async () => {
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
        });
      } catch (error) {
        toast.error("Failed to fetch user");
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const formik = useFormik({
    initialValues: {
      testfor: "",
      testid: "",
      appointmentdate: "",
      phone: "",
      name: "",
      email: "",
      age: 0,
    },
    onSubmit: (values) => {
      try {
        setSubmitting(true);
        axios
          .post(
            `${API_BASE_URL}/api/test`,
            {
              testfor: values.testfor,
              testid: values.testid,
              appointmentdate: values.appointmentdate,
              phone: user.phone,
              name: values.name,
              age: values.age,
              email: user.email,
            },
            {
              headers: {
                Authorization: `${localStorage.getItem("token")}`,
              },
            }
          )
          .then(() => {
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

  const handleTestFor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    formik.setFieldValue("testfor", e.target.value);
    // reset form values except phonenumber and testfor value on change
    formik.setValues({
      testfor: e.target.value,
      testid: "",
      appointmentdate: "",
      phone: user.phone,
      name: "",
      age: 0,
      email: user.email,
    });
  };

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
      <div className="container mx-auto p-4 my-24">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">New Appointment</h2>
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
          {/*  */}

          <div className="flex flex-col md:flex-row-reverse justify-between items-center mt-12 gap-8">
            <div className="flex-1 md:max-w-[50%]">
              <DoctorSVG className="w-full" />
            </div>
            <form
              className="grid grid-cols-2 gap-4 w-full md:max-w-[50%]"
              onSubmit={formik.handleSubmit}
            >
              <div className="form-control col-span-2">
                <label className="label" htmlFor="testfor">
                  <span className="label-text">Test For</span>
                </label>
                <select
                  className="select select-bordered"
                  defaultValue={"Select Test"}
                  name="testfor"
                  id="testfor"
                  onChange={handleTestFor}
                  value={formik.values.testfor}
                >
                  <option value={""} disabled>
                    Select Test
                  </option>
                  <option value="self">For Myself</option>
                  <option value="family">For Family</option>
                </select>
              </div>
              {formik.values.testfor === "self" && (
                <>
                  <div
                    role="alert"
                    className="alert mt-4 bg-base-300 col-span-full"
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
                      displayed or incorrect{" "}
                      <Link to="/profile" className="link">
                        Update Now
                      </Link>
                    </span>
                  </div>
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
                      value={user.name}
                      disabled
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
                      value={user.phone}
                      disabled
                    />
                  </div>
                  {/* patient age */}
                  <div className="form-control col-span-2 md:col-span-1">
                    <label htmlFor="number" className="label">
                      <span className="label-text">Patient Age</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      placeholder="Patient Age"
                      max={100}
                      min={0}
                      id="age"
                      name="age"
                      value={user.age}
                      disabled
                    />
                  </div>
                </>
              )}

              {formik.values.testfor === "family" && (
                <>
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
                      required
                      minLength={3}
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
                  </div>
                  {/* patient age */}
                  <div className="form-control col-span-2 md:col-span-1">
                    <label htmlFor="number" className="label">
                      <span className="label-text">Patient Age</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      placeholder="Patient Age"
                      max={100}
                      min={0}
                      id="age"
                      name="age"
                      value={formik.values.age}
                      onChange={formik.handleChange}
                      required
                      minLength={1}
                    />
                  </div>
                </>
              )}

              {formik.values.testfor !== "" && (
                <>
                  <div className="form-control col-span-2 md:col-span-1">
                    <label className="label">
                      <span className="label-text">
                        Select Appointment Date
                      </span>
                    </label>
                    <input
                      type="date"
                      name="appointmentdate"
                      className="input input-bordered"
                      placeholder="Select Date"
                      min={new Date().toISOString().split("T")[0]}
                      onChange={formik.handleChange}
                      value={formik.values.appointmentdate}
                    />
                    <label className="label">
                      <span className="label-text-alt">(Optional)</span>
                    </label>
                  </div>
                  <div className="form-control col-span-2">
                    <label className="label">
                      <span className="label-text">Select Test</span>
                    </label>
                    <select
                      className="select select-bordered"
                      defaultValue={"Select Test"}
                      name="testid"
                      id="test"
                      onChange={(e) => {
                        formik.handleChange(e);
                        fetchSelectedTest(e.target.value);
                      }}
                      value={formik.values.testid}
                    >
                      <option value={""} disabled>
                        Select Test
                      </option>
                      {tests.map((test) => (
                        <option key={test._id} value={test._id}>
                          {test.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedTest && selectedTest.name && (
                    <div className="stats bg-base-300 col-span-full w-full">
                      <div className="stat">
                        <div className="stat-title">Test Name</div>
                        <div className="stat-value text-2xl">
                          {selectedTest.name}
                        </div>
                        <div className="stat-actions">
                          <div className="btn btn-sm btn-success">
                            Available
                          </div>
                        </div>
                      </div>

                      <div className="stat">
                        <div className="stat-title">Current price</div>
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
                  {/* submit button */}
                  <div className="form-control col-span-2">
                    <button
                      className="btn btn-primary w-full"
                      type="submit"
                      disabled={
                        formik.values.testid === "" ||
                        formik.values.testfor === "" ||
                        submitting
                      }
                    >
                      {submitting ? (
                        <span className="loading loading-dots loading-sm"></span>
                      ) : (
                        "Book Appointment "
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
      {isModal && <SubmittedModal onClose={() => setIsModal(false)} />}
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

export default New;
