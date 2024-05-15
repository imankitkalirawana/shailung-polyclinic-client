import { useEffect, useState } from "react";
import {
  CalendarTimeIcon,
  DownloadIcon,
  LeftAngle,
  RightAngle,
  SearchIcon,
  TrashXIcon,
} from "../../icons/Icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { humanReadableDate } from "../user/Users";
import { TestStatus } from "../../../utils/config";
import NotFound from "../../NotFound";
import { toast } from "sonner";
import { getAllTests } from "../../../functions/get";
import { isLoggedIn } from "../../../utils/auth";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Test } from "../../../interface/interface";
import { useFormik } from "formik";

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
  const { user } = isLoggedIn();
  const [searchQuery, setSearchQuery] = useState("");
  const offset = 10;
  const [initialItem, setInitialItem] = useState(0);
  const [finalItem, setFinalItem] = useState(offset);
  const [selected, setSelected] = useState<Test | null>(null);
  const [isDelete, setIsDelete] = useState(false);
  const [isSchedule, setIsSchedule] = useState(false);
  const [isExport, setIsExport] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryStatus = searchParams.get("status");

  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "member") {
      navigate("/dashboard");
    }
  }, [user]);

  const handleDeleteClick = (test: Test) => {
    setSelected(test);
    setIsDelete(true);
  };

  const handleStatusChange = async (test: Test, status: string) => {
    try {
      if (status === "completed") {
        navigate(`/dashboard/tests/complete/${test._id}`);
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

  useEffect(() => {
    tests.forEach(async (test) => {
      const appointmentDate = new Date(test.appointmentdate);
      appointmentDate.setHours(appointmentDate.getHours() + 18);
      if (
        test.appointmentdate &&
        appointmentDate < new Date() &&
        test.status !== "completed" &&
        test.status !== "overdue" &&
        test.status !== "cancelled"
      ) {
        await testStatus(test._id, "overdue");
        fetchAllTests();
      }
      if (test.isDone && test.status !== "completed") {
        await testStatus(test._id, "completed");
        fetchAllTests();
      }
    });
  }, [tests]);

  useEffect(() => {
    if (queryStatus == null) {
      window.location.href = "/dashboard/tests?status=all";
    }
    fetchAllTests();
  }, [queryStatus]);
  const fetchAllTests = async () => {
    const data = await getAllTests(queryStatus);
    setTests(data);
  };

  const handleSearch = (test: any) => {
    if (searchQuery === "") {
      return test;
    } else if (
      (test.testDetail.userData.name &&
        test.testDetail.userData.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (test.testDetail.userData.phone &&
        test.testDetail.userData.phone
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (test.testDetail.testData.name &&
        test.testDetail.testData.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (test.status &&
        test.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
      test._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      humanReadableDate(test.appointmentdate)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      humanReadableDate(test.addeddate)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return test;
    }
  };

  // handle sorting

  return (
    <>
      <Helmet>
        <title>Tests - Shailung Polyclinic</title>
        <meta
          name="description"
          content="View all tests and their status. You can also assign doctors, schedule appointments and update status of tests."
        />
        <meta
          name="keywords"
          content="tests, test, status, assign, doctor, schedule, appointment, update, view, view tests, assign doctor, schedule appointment, update status"
        />
        <link
          rel="canonical"
          href={`https://report.shailungpolyclinic.com/admin/tests`}
        />
      </Helmet>
      <div className="container mx-auto p-4">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Tests</h1>
            <div className="flex gap-2 flex-row-reverse">
              <Link
                to="/dashboard/tests/appointment"
                className="btn btn-primary btn-sm"
              >
                New Test
              </Link>
              <button
                className="btn btn-outline btn-sm hover:btn-primary"
                onClick={() => setIsExport(true)}
                // onClick={exportToExcel}
              >
                Export to Excel
              </button>
            </div>
          </div>
          <div className="flex gap-4 my-8 overflow-x-scroll">
            <Link
              className={`btn btn-sm ${
                queryStatus === "all" ? "btn-primary" : "btn-outline"
              }`}
              to={`/dashboard/tests?status=all`}
            >
              All
            </Link>
            {TestStatus.sort((a, b) => (a.value > b.value ? 1 : -1)).map(
              (status, index) => (
                <Link
                  key={index}
                  className={`btn btn-sm  ${
                    queryStatus === status.value ? "btn-primary" : "btn-outline"
                  }`}
                  to={`/dashboard/tests?status=${status.value}`}
                >
                  {status.label}
                </Link>
              )
            )}
          </div>
          <div className="relative w-full max-w-md mb-4">
            <input
              type="text"
              className="input input-bordered ml-1 w-full"
              placeholder={`Search by name, phone, test`}
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
                  <tr className="text-xs font-semibold tracking-wide uppercase text-left border-b bg-primary/20">
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Test</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Patient Number</th>
                    <th className="px-4 py-3">Added By</th>
                    <th className="px-4 py-3">Added On</th>
                    <th className="px-4 py-3">Appointment Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-primary/10 divide-y">
                  {tests
                    .filter((test) => {
                      return handleSearch(test);
                    })
                    .slice(initialItem, finalItem)
                    .map((test, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 pt-5 text-sm h-full dropdown">
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
                                {TestStatus.filter(
                                  (status) => status.value !== "overdue"
                                ).map((status, index) => (
                                  <option key={index} value={status.value}>
                                    {status.label}
                                  </option>
                                ))}
                              </select>
                            )}
                        </td>
                        <td className="px-4 py-3 text-sm text-nowrap">
                          {test.testDetail.testData.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-nowrap">
                          {test.testDetail.userData.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-nowrap">
                          {test.testDetail.userData.phone}
                        </td>
                        <td className={`px-4 py-3 text-sm text-nowrap`}>
                          {test.addedby}
                        </td>

                        <td className="px-4 py-3 text-sm text-nowrap">
                          {humanReadableDate(test.addeddate)}
                        </td>
                        <td className="px-4 py-3 text-sm text-nowrap">
                          {test.appointmentdate
                            ? humanReadableDate(test.appointmentdate)
                            : "Not Scheduled"}
                        </td>
                        <td className="px-4 py-3 text-sm modify justify-end flex gap-2">
                          {test.status !== "completed" &&
                            test.status !== "cancelled" && (
                              <button
                                className={`btn btn-sm btn-circle hover:btn-outline tooltip flex ${
                                  test.appointmentdate
                                    ? "tooltip-warning btn-ghost"
                                    : "tooltip-info"
                                } items-center justify-center`}
                                aria-label="Schedule"
                                data-tip={`${
                                  test.appointmentdate ||
                                  test.status === "overdue"
                                    ? "Re"
                                    : ""
                                }Schedule Date`}
                                onClick={() => {
                                  setSelected(test);
                                  setIsSchedule(true);
                                }}
                              >
                                <CalendarTimeIcon className="w-4 h-4 button" />
                              </button>
                            )}

                          {test.status === "completed" && (
                            <Link
                              to={`/report/${test.reportId}/download`}
                              className="btn btn-sm btn-circle btn-ghost flex items-center justify-center tooltip tooltip-success"
                              data-tip="Download"
                            >
                              <DownloadIcon className="w-4 h-4" />
                            </Link>
                          )}
                          {user?.role === "admin" && (
                            <>
                              <div className="divider divider-horizontal mx-0"></div>
                              <button
                                className="btn btn-sm btn-circle btn-ghost hover:btn-outline tooltip flex tooltip-error items-center justify-center"
                                aria-label="Delete"
                                onClick={() => handleDeleteClick(test)}
                                data-tip="Delete"
                              >
                                <TrashXIcon className="w-4 h-4 button" />
                              </button>
                            </>
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
      {isExport && (
        <ExportModal
          tests={tests}
          onClose={() => {
            setIsExport(false);
          }}
        />
      )}
    </>
  );
};

interface ExportModalProps {
  tests: Test[];
  onClose: () => void;
}
interface FormValues {
  testIds: string[];
}

const ExportModal = ({ tests, onClose }: ExportModalProps) => {
  const formik = useFormik<FormValues>({
    initialValues: {
      testIds: [],
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/export/tests`,
          {
            testIds: values.testIds,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
            responseType: "blob",
          }
        );
        console.log(response.data);
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "exported_tests.csv");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        // wait for 2 seconds before closing the modal
        setTimeout(() => {
          toast.success("Tests exported successfully", {
            id: "exporting-tests",
          });
          onClose();
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <div
        className="modal modal-open modal-bottom xs:modal-middle backdrop-blur-sm"
        role="dialog"
      >
        <div className="modal-box w-full sm:max-w-sm">
          <h3 className="font-bold text-lg text-center">Export Tests</h3>
          <div className="py-4 max-h-48 overflow-y-scroll">
            {/* checkbox to select all */}
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Select All</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  name="selectAll"
                  onChange={(e) => {
                    if (e.target.checked) {
                      formik.setFieldValue(
                        "testIds",
                        tests.map((test) => test._id)
                      );
                    } else {
                      formik.setFieldValue("testIds", []);
                    }
                  }}
                  checked={formik.values.testIds.length === tests.length}
                />
              </label>
            </div>
            {tests
              .sort((a, b) =>
                a.testDetail.userData.name.localeCompare(
                  b.testDetail.userData.name
                )
              )
              .map((test, index) => (
                <div className="form-control" key={index}>
                  <label className="label cursor-pointer">
                    <span className="label-text">
                      {test.testDetail.userData.name}
                    </span>
                    <input
                      type="checkbox"
                      className="checkbox"
                      name="testIds"
                      value={test._id}
                      onChange={formik.handleChange}
                      checked={formik.values.testIds.includes(test._id)}
                    />
                  </label>
                </div>
              ))}
          </div>
          <div className="modal-action flex flex-col xs:flex-row">
            <button
              className="btn btn-info flex-1"
              type="submit"
              onClick={() => {
                formik.handleSubmit();
                toast.success("Exporting tests", {
                  id: "exporting-tests",
                });
              }}
            >
              Export
            </button>
            <button
              className="btn flex-1"
              onClick={() => {
                onClose();
              }}
            >
              Close!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

interface DeleteModalProps {
  test: Test;
  onClose: () => void;
  setTests: any;
}

const DeleteModal = ({ test, onClose, setTests }: DeleteModalProps) => {
  const [processing, setProcessing] = useState(false);
  const handleDelete = async () => {
    setProcessing(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/test/${test._id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      if (test.status === "completed" && test.reportId) {
        await axios.delete(`${API_BASE_URL}/api/report/${test.reportId}`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
      }
      fetchTests();
      toast.success("Test deleted successfully");
      onClose();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete test");
    }
    setProcessing(false);
  };

  const fetchTests = async () => {
    const data = await getAllTests("all");
    setTests(data);
  };

  return (
    <>
      <div
        className="modal modal-open modal-bottom xs:modal-middle backdrop-blur-sm"
        role="dialog"
      >
        <div className="modal-box w-full sm:max-w-sm">
          <h3 className="font-bold text-lg text-center">
            Delete {test.testDetail.userData.name}'s{" "}
            {test.testDetail.testData.name}
          </h3>
          <p className="py-4">
            Are you sure you want to delete this test? This action cannot be
            undone.
          </p>
          <div className="modal-action flex flex-col xs:flex-row gap-2">
            <button
              className="btn btn-error flex-1"
              onClick={() => handleDelete()}
              disabled={processing}
            >
              {processing ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                "Delete"
              )}
            </button>
            <button
              className="btn flex-1"
              onClick={onClose}
              disabled={processing}
            >
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
  const [searchParams] = useSearchParams();
  const queryStatus = searchParams.get("status");

  const [date, setDate] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const handleSchedule = async () => {
    setProcessing(true);
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
      toast.message("Appointment scheduled successfully", {
        description: `On ${date}`,
      });
    } catch (err) {
      toast.error("Failed to schedule appointment");
      console.log(err);
    } finally {
      const data = await getAllTests(queryStatus);
      setTests(data);
      onClose();
      setProcessing(false);
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
          <div className="modal-action flex flex-col xs:flex-row gap-2">
            <button
              className="btn btn-info flex-1"
              onClick={() => handleSchedule()}
              disabled={processing}
            >
              {processing ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                "Schedule"
              )}
            </button>
            <button
              className="btn flex-1"
              onClick={onClose}
              disabled={processing}
            >
              Close!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tests;
