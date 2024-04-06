import { useEffect, useState } from "react";
import {
  CalendarTimeIcon,
  LeftAngle,
  RightAngle,
  SearchIcon,
  StethoscopeIcon,
  TrashXIcon,
} from "../../icons/Icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { humanReadableDate } from "../user/Users";
import { TestStatus } from "../../../utils/config";
import NotFound from "../../NotFound";
import toast from "react-hot-toast";

interface Test {
  _id: string;
  testid: string;
  userid: string;
  doneby: string;
  status: string;
  isDone: boolean;
  updatedat: string;
  addeddate: string;
  appointmentdate: string;
  testDetail: {
    testData: {
      _id: string;
      name: string;
      price: number;
      duration: number;
    };
    userData: {
      _id: string;
      username: string;
      name: string;
      email: string;
      phone: string;
    };
    doctorData: {
      _id: string;
      username: string;
      name: string;
      email: string;
      phone: string;
    };
  };
}

export const testStatus = async (testId: any, status: string) => {
  try {
    await axios.put(
      `${API_BASE_URL}/api/test/status/${testId}`,
      {
        status: status,
      },
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
    toast.error("Failed to update status");
  }
};

const Tests = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const offset = 10;
  const [initialItem, setInitialItem] = useState(0);
  const [finalItem, setFinalItem] = useState(offset);
  const [selected, setSelected] = useState<Test | null>(null);
  const [isDelete, setIsDelete] = useState(false);
  const [isAssign, setIsAssign] = useState(false);
  const [isSchedule, setIsSchedule] = useState(false);
  const navigate = useNavigate();

  const handleDeleteClick = (test: Test) => {
    setSelected(test);
    setIsDelete(true);
  };

  const handleAssignClick = (test: Test) => {
    setSelected(test);
    setIsAssign(true);
  };

  const handleStatusChange = async (test: Test, status: string) => {
    try {
      if (status === "booked" && test.testDetail.doctorData) {
        toast.error("Doctor is already assigned");
        return;
      }
      if (status === "completed") {
        navigate(`/admin/tests/complete/${test._id}`);
        return;
      }
      await testStatus(test._id, status);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    } finally {
      fetchAllTests();
    }
  };

  // change status to overdue if appointment date is passed
  useEffect(() => {
    tests.forEach(async (test) => {
      if (
        test.appointmentdate &&
        new Date(test.appointmentdate) < new Date() &&
        test.status !== "completed" &&
        test.status !== "overdue"
      ) {
        await testStatus(test._id, "overdue");
        fetchAllTests();
      }
      // set the test status to completed if the test.isDone is true
      if (test.isDone && test.status !== "completed") {
        await testStatus(test._id, "completed");
        fetchAllTests();
      }
    });
  }, [tests]);

  useEffect(() => {
    fetchAllTests();
  }, []);
  const fetchAllTests = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/test/all`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });
    const data = response.data;
    setTests(data);
  };

  const handleSearch = (test: any) => {
    if (searchQuery === "") {
      return test;
    } else if (
      test.testDetail.userData.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      test.testDetail.userData.phone
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      test.testDetail.testData.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (test.testDetail.doctorData &&
        test.testDetail.doctorData.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      test.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      humanReadableDate(test.appointmentdate)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return test;
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h2 className="my-6 text-2xl font-semibold">Tests</h2>
            <div className="flex gap-2 flex-row-reverse">
              <button className="btn btn-outline btn-sm hover:btn-primary">
                Export to Excel
              </button>
            </div>
          </div>
          <div className="relative w-full max-w-md mb-4">
            <input
              type="text"
              className="input input-bordered ml-1 w-full"
              placeholder="Search by name, phone, test, status"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <button className="absolute top-0 -right-1 rounded-l-none btn btn-primary">
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>

          {tests.length > 0 ? (
            <div className={`w-full card overflow-x-auto overflow-y-hidden`}>
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide uppercase text-left border-b bg-primary/20 cursor-pointer">
                    <th className="px-4 py-3 hover:bg-primary/10">Status</th>
                    <th className="px-4 py-3 hover:bg-primary/10">Test</th>
                    <th className="px-4 py-3 hover:bg-primary/10">Patient</th>
                    <th className="px-4 py-3 hover:bg-primary/10">
                      Patient Number
                    </th>
                    <th className="px-4 py-3 hover:bg-primary/10">Doctor</th>
                    <th className="px-4 py-3 hover:bg-primary/10">Added On</th>
                    <th className="px-4 py-3 hover:bg-primary/10">
                      Appointment Date
                    </th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-primary/10 divide-y">
                  {tests
                    .filter((test) => {
                      return handleSearch(test);
                    })
                    .reverse()
                    .slice(initialItem, finalItem)
                    .map((test, index) => (
                      <tr
                        key={index}
                        className={`cursor-pointer hover:bg-primary/5  ${
                          !test.testDetail.doctorData &&
                          "bg-info/10 hover:bg-info/20"
                        }`}
                        role="button"
                      >
                        <td className="px-4 py-3 text-sm dropdown">
                          <span
                            role="button"
                            tabIndex={0}
                            className={`badge tooltip tooltip-right ${
                              TestStatus.find(
                                (status) => status.value === test.status
                              )?.color
                            }`}
                            data-tip={
                              TestStatus.find(
                                (status) => status.value === test.status
                              )?.label
                            }
                            onClick={() => {
                              if (test.status === "overdue") {
                                setSelected(test);
                                setIsSchedule(true);
                              }
                            }}
                          ></span>
                          {test.status != "completed" &&
                            test.status !== "overdue" && (
                              <select
                                tabIndex={0}
                                className="dropdown-content z-[1] menu p-2 select select-bordered shadow bg-base-100 rounded-box w-52"
                                value={test.status}
                                onChange={(e) => {
                                  handleStatusChange(test, e.target.value);
                                }}
                              >
                                {!test.testDetail.doctorData ? (
                                  <>
                                    <option value={"booked"}>Booked</option>
                                    <option value={"cancelled"}>
                                      Cancelled
                                    </option>
                                  </>
                                ) : (
                                  TestStatus.filter(
                                    (status) =>
                                      status.value !== "booked" &&
                                      status.value !== "overdue"
                                  ).map((status, index) => (
                                    <option key={index} value={status.value}>
                                      {status.label}
                                    </option>
                                  ))
                                )}
                              </select>
                            )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {test.testDetail.testData.name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {test.testDetail.userData.name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {test.testDetail.userData.phone}
                        </td>
                        <td className={`px-4 py-3 text-sm`}>
                          {test.testDetail.doctorData
                            ? test.testDetail.doctorData.name
                            : "Not Assigned"}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {humanReadableDate(test.addeddate)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {test.appointmentdate
                            ? humanReadableDate(test.appointmentdate)
                            : "Not Scheduled"}
                        </td>
                        <td className="px-4 py-3 text-sm modify flex gap-2">
                          <button
                            className="btn btn-sm btn-circle btn-ghost hover:btn-outline tooltip flex tooltip-error items-center justify-center"
                            aria-label="Delete"
                            onClick={() => handleDeleteClick(test)}
                            data-tip="Delete"
                          >
                            <TrashXIcon className="w-4 h-4 button" />
                          </button>
                          {test.status !== "completed" && (
                            <button
                              className={`btn btn-sm btn-circle hover:btn-outline tooltip flex ${
                                test.appointmentdate
                                  ? "tooltip-warning btn-ghost"
                                  : "tooltip-info"
                              } items-center justify-center`}
                              aria-label="Schedule"
                              data-tip={`${
                                test.appointmentdate ? "Re" : ""
                              }Schedule Date`}
                              onClick={() => {
                                setSelected(test);
                                setIsSchedule(true);
                              }}
                            >
                              <CalendarTimeIcon className="w-4 h-4 button" />
                            </button>
                          )}

                          {test.status !== "completed" &&
                            test.status !== "cancelled" && (
                              <button
                                className={`btn btn-sm btn-circle ${
                                  !test.testDetail.doctorData
                                    ? "tooltip-primary"
                                    : "tooltip-warning btn-ghost"
                                } hover:btn-outline tooltip flex items-center justify-center`}
                                aria-label="Assign Doctor"
                                onClick={() => {
                                  handleAssignClick(test);
                                }}
                                data-tip={`${
                                  test.testDetail.doctorData ? "Re" : ""
                                }Assign Doctor`}
                              >
                                <StethoscopeIcon className="w-4 h-4 button" />
                              </button>
                            )}
                        </td>
                      </tr>
                    ))}
                  <tr className="bg-primary/20">
                    <td className="px-4 py-3 text-sm" colSpan={7}>
                      Showing {initialItem + 1}-{finalItem} of{" "}
                      {
                        tests.filter((test) => {
                          return handleSearch(test);
                        }).length
                      }
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
                          if (finalItem < tests.length) {
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
            <NotFound message="No tests found" />
          )}
        </div>
      </div>
      {(selected && isDelete && (
        <DeleteModal
          test={selected}
          onClose={() => {
            setSelected(null);
            setIsDelete(false);
          }}
          setTests={setTests}
        />
      )) ||
        (selected && isAssign && (
          <AssignModal
            test={selected}
            onClose={() => {
              setSelected(null);
              setIsAssign(false);
            }}
            setTests={setTests}
          />
        )) ||
        (selected && isSchedule && (
          <ScheduleModal
            test={selected}
            onClose={() => {
              setSelected(null);
              setIsSchedule(false);
            }}
            setTests={setTests}
          />
        ))}
    </>
  );
};

interface DeleteModalProps {
  test: Test;
  onClose: () => void;
  setTests: any;
}

const DeleteModal = ({ test, onClose, setTests }: DeleteModalProps) => {
  const handleDelete = async () => {
    await axios.delete(`${API_BASE_URL}/api/test/${test._id}`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });
    setTests((prev: Test[]) => {
      return prev.filter((prevTest) => prevTest._id !== test._id);
    });
    onClose();
  };

  return (
    <>
      <input type="checkbox" id="delete_test" className="modal-toggle" />
      <div className="modal modal-open backdrop-blur-sm" role="dialog">
        <div className="modal-box max-w-sm">
          <h3 className="font-bold text-lg text-center">
            Delete {test.testDetail.userData.name}'s{" "}
            {test.testDetail.testData.name}
          </h3>
          <p className="py-4">
            Are you sure you want to delete this test? This action cannot be
            undone.
          </p>
          <div className="modal-action flex">
            <button
              className="btn btn-error flex-1"
              onClick={() => handleDelete()}
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
    } catch (err) {
      console.log(err);
    } finally {
      fetchTests();
      onClose();
    }
  };

  const fetchTests = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/test/all`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });
    const data = response.data;
    setTests(data);
  };
  return (
    <>
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
    </>
  );
};

interface AssignModalProps {
  test: Test;
  onClose: () => void;
  setTests: any;
}

const AssignModal = ({ test, onClose, setTests }: AssignModalProps) => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  useEffect(() => {
    const fetchAllDoctors = async () => {
      const response = await axios.get(`${API_BASE_URL}/api/user/doctors`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      setDoctors(data);
    };

    fetchAllDoctors();
  }, []);

  const fetchTests = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/test/all`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });
    const data = response.data;
    setTests(data);
  };

  const handleAssign = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/test/assign/${test._id}`,
        {
          doctorid: selectedDoctor,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      fetchTests();
      onClose();
    }
  };

  return (
    <>
      <div className="modal modal-open backdrop-blur-sm" role="dialog">
        <a
          href="#close"
          className="absolute top-0 right-0 m-6"
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          &times;
        </a>
        <div className="modal-box max-w-sm">
          <h3 className="font-bold text-lg text-center">
            Assign Doctor to {test.testDetail.userData.name}'s{" "}
            {test.testDetail.testData.name}
          </h3>
          <p className="py-4">
            <select
              className="input input-bordered w-full"
              onChange={(e) => {
                setSelectedDoctor(e.target.value);
              }}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </p>
          <div className="modal-action flex">
            <button
              className="btn btn-primary flex-1"
              onClick={() => handleAssign()}
            >
              Assign
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

export default Tests;
