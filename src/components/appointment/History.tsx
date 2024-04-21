import { useEffect, useState } from "react";
import { TestStatus } from "../../utils/config";
import { humanReadableDate } from "../admin/user/Users";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { SearchIcon } from "../icons/Icons";
import { isLoggedIn } from "../../utils/auth";
import { testStatus } from "../admin/tests/Tests";
import NotFound from "../NotFound";
import { Helmet } from "react-helmet-async";
import { IconPlus } from "@tabler/icons-react";

interface Test {
  _id: string;
  status: string;
  addeddate: string;
  appointmentdate: string;
  reportId: string;
  testDetail: {
    userData: {
      name: string;
      phone: string;
    };
    doctorData: {
      name: string;
    };
    testData: {
      name: string;
    };
  };
}

const History = () => {
  const { loggedIn, user } = isLoggedIn();
  const [tests, setTests] = useState<Test[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selected, setSelected] = useState<Test | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  if (!loggedIn) {
    window.location.href = "/auth/login";
  }

  const handleDeleteClick = () => {
    // setSelected(test);
    // setDeleteModal(true);
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/test/my`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        const data = response.data;
        setTests(data.reverse());
      } catch (error) {
        console.log(error);
      }
    };
    fetchTests();
    if (user?.role === "admin" || user?.role === "member") {
      navigate("/dashboard/reports");
    }
  }, []);

  const handleSearch = (test: Test) => {
    if (searchQuery === "") return test;
    else if (
      (test.testDetail.userData &&
        test.testDetail.userData.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (test.testDetail.doctorData &&
        test.testDetail.doctorData.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      test.testDetail.testData.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      test.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      humanReadableDate(test.appointmentdate)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      test._id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Helmet>
        <title>Appointment History - Shailung Polyclinic</title>
        <meta
          name="description"
          content="View your appointment history at Shailung Polyclinic in Itahari, Nepal."
        />
        <meta
          name="keywords"
          content="appointment, history, shailung, polyclinic, itahari, nepal, test, report, schedule, cancel"
        />
        <link
          rel="canonical"
          href="https://report.shailungpolyclinic.com/appointment/history"
        />
      </Helmet>
      <div className="container mx-auto max-w-6xl my-24">
        <div className="flex mb-4 justify-between items-center">
          <h1 className="my-6 sm:text-2xl w-full font-semibold">
            Your Appointment History
          </h1>
          <div className="flex gap-2 flex-row-reverse">
            <Link
              to="/appointment/new"
              className="btn hidden sm:flex btn-primary btn-sm"
            >
              New Appointment
            </Link>
            <Link
              to="/appointment/history"
              className="btn sm:hidden flex items-center justify-center btn-secondary btn-circle btn-sm tooltip tooltip-left tooltip-primary"
              data-tip="New Appointment"
            >
              <IconPlus />
            </Link>
          </div>
        </div>
        <div role="tablist" className="tabs tabs-boxed bg-transparent">
          <div className="relative w-full max-w-md mb-4">
            <input
              type="text"
              className="input input-bordered ml-1 w-full"
              placeholder="Search by name, doctor, date, status"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <SearchIcon className="absolute top-3 right-4 w-6 h-6 text-primary" />
          </div>
          <Link
            to={"/appointment/new"}
            className="btn sm:hidden btn-primary my-4"
          >
            New Appointment
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.length > 0 ? (
              tests
                .filter((test) => {
                  return handleSearch(test);
                })
                .map((test) => (
                  <div
                    className={`h-56 ${
                      test.status === "cancelled"
                        ? "from-error/20 to-error/30"
                        : test.status === "completed"
                        ? "from-success/20 to-success/30"
                        : test.status === "overdue"
                        ? "from-pink-300 to-pink-400"
                        : "from-base-300/80 to-base-300"
                    } bg-gradient-to-br  rounded-xl relative shadow-2xl`}
                    key={test._id}
                  >
                    <div className="w-full p-8">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-light text-xs">Name</p>
                          <p className="font-medium">
                            {test.testDetail.userData.name}
                          </p>
                        </div>
                        <div className="badge badge-primary text-end text-nowrap overflow-hidden text-ellipsis">
                          {test.testDetail.testData.name}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="font-light text-xs">Doctor</p>
                        <p className="font-medium tracking-more-wider">
                          {test.testDetail.doctorData
                            ? test.testDetail.doctorData.name
                            : "Not Assigned"}
                        </p>
                      </div>
                      <div className="pt-6">
                        <div className="flex justify-between">
                          <p className="font-light text-xs">On</p>
                          <div className="flex items-center justify-center gap-2">
                            {test.status === "completed" && (
                              <Link
                                to={`/report/${test.reportId}/download`}
                                className="btn btn-xs mb-1 btn-success"
                              >
                                View Report
                              </Link>
                            )}
                            <div className="dropdown dropdown-left">
                              <p
                                role="button"
                                tabIndex={0}
                                className={`badge tooltip tooltip-left ${
                                  TestStatus.find(
                                    (status) => status.value === test.status
                                  )?.color
                                }`}
                                data-tip={test.status}
                                onClick={() => {
                                  if (test.status === "overdue") {
                                    setScheduleModal(true);
                                    setSelected(test);
                                  } else if (
                                    test.status !== "cancelled" &&
                                    test.status !== "completed"
                                  ) {
                                    handleDeleteClick();
                                  } else {
                                    toast.error(
                                      "Appointment is already completed or cancelled"
                                    );
                                  }
                                }}
                              ></p>
                              {test.status != "completed" &&
                                test.status !== "overdue" &&
                                test.status !== "cancelled" && (
                                  <select
                                    tabIndex={0}
                                    className="dropdown-content z-[1] menu p-2 select select-bordered shadow bg-base-100 rounded-box w-52"
                                    value={""}
                                    onChange={(e) => {
                                      if (e.target.value === "reschedule") {
                                        setScheduleModal(true);
                                        setSelected(test);
                                      } else if (
                                        e.target.value === "cancelled"
                                      ) {
                                        setDeleteModal(true);
                                        setSelected(test);
                                      }
                                    }}
                                  >
                                    <option value="" disabled>
                                      Select Action
                                    </option>
                                    <option value="reschedule">
                                      Reschedule
                                    </option>
                                    <option value="cancelled">Cancel</option>
                                  </select>
                                )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="font-light text-xs">
                            {test.appointmentdate
                              ? humanReadableDate(test.appointmentdate)
                              : "Not Scheduled Yet"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-full">
                <NotFound message="No Appointments Found" />
              </div>
            )}
          </div>
        </div>
      </div>
      {deleteModal && selected && (
        <DeleteModal
          test={selected}
          onClose={() => {
            setDeleteModal(false);
            setSelected(null);
          }}
          setTests={setTests}
          modalDate={{
            title: "Cancel Appointment",
            message: `Are you sure you want to cancel ${selected.testDetail.userData.name}'s ${selected.testDetail.testData.name} appointment?`,
            button: "Cancel Appointment",
          }}
        />
      )}
      {scheduleModal && selected && (
        <ScheduleModal
          test={selected}
          onClose={() => {
            setScheduleModal(false);
            setSelected(null);
          }}
          setTests={setTests}
        />
      )}
    </>
  );
};

interface DeleteModalProps {
  test: Test;
  onClose: () => void;
  setTests: any;
  modalDate: {
    title: string;
    message: string;
    button: string;
  };
}

const DeleteModal = ({
  test,
  onClose,
  setTests,
  modalDate,
}: DeleteModalProps) => {
  const handleDelete = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/test/status/${test._id}`,
        {
          status: "cancelled",
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      fetchAllTests();
      onClose();
      toast.success("Appointment Cancelled Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Cancel Appointment!");
    }
  };

  const fetchAllTests = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/test/my`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });
    const data = response.data;
    setTests(data.reverse());
  };

  return (
    <>
      <div className="modal modal-open backdrop-blur-sm" role="dialog">
        <div className="modal-box max-w-sm">
          <h3 className="font-bold text-lg text-center">{modalDate.title}</h3>
          <p className="py-4">{modalDate.message}</p>
          <div className="modal-action flex">
            <button
              className="btn btn-error flex-1 whitespace-nowrap"
              onClick={() => handleDelete()}
            >
              {modalDate.button}
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

interface ScheduleModalProps {
  test: Test;
  onClose: () => void;
  setTests: any;
}

const ScheduleModal = ({ test, onClose, setTests }: ScheduleModalProps) => {
  const [date, setDate] = useState<string>("");
  const handleSchedule = async () => {
    try {
      if (test.status === "overdue") {
        await testStatus(test._id, "confirmed");
      }
      await axios.put(
        `${API_BASE_URL}/api/test/schedule/${test._id}`,
        {
          appointmentdate: date,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Appointment Scheduled Successfully");
    } catch (err) {
      console.log(err);
    } finally {
      const response = await axios.get(`${API_BASE_URL}/api/test/my`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      setTests(data.reverse());
      setTests(data);
      onClose();
    }
  };
  return (
    <div className="modal modal-open backdrop-blur-sm" role="dialog">
      <div className="modal-box max-w-sm">
        <h3 className="font-bold text-lg text-center">
          Schedule {test.testDetail.userData.name}'s{" "}
          {test.testDetail.testData.name}
        </h3>
        <p className="py-4">
          <input
            type="date"
            className="input input-bordered w-full"
            placeholder="Select Date"
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </p>
        <div className="modal-action flex">
          <button
            className="btn btn-info flex-1"
            onClick={() => handleSchedule()}
          >
            Schedule
          </button>
          <button className="btn flex-1" onClick={onClose}>
            Close!
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
