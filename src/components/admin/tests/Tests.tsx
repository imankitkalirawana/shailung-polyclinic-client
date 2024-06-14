import { useEffect, useState } from "react";
import { ExportTableIcon } from "../../icons/Icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { humanReadableDate } from "../user/Users";
import { TestStatus } from "../../../utils/config";
import { toast } from "sonner";
import { getAllTests } from "../../../functions/get";
import { isLoggedIn } from "../../../utils/auth";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Test } from "../../../interface/interface";
import { useFormik } from "formik";
import {
  IconCalendarClock,
  IconDotsVertical,
  IconDownload,
  IconPencil,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { parseDate } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  Button,
  Chip,
  DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";

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
  const [selected, setSelected] = useState<Test | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryStatus = searchParams.get("status");
  const scheduleTestModal = useDisclosure();
  const deleteTestModal = useDisclosure();
  const exportModal = useDisclosure();

  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "member") {
      navigate("/dashboard");
    }
  }, [user]);

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
      <div className="mx-auto">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Tests</h1>
            <div className="flex gap-2 flex-row-reverse">
              <Button
                variant="flat"
                color="primary"
                as={Link}
                to="/dashboard/tests/appointment"
              >
                New Test
              </Button>

              <Tooltip content="Export to Excel">
                <Button
                  radius="full"
                  variant="bordered"
                  data-tip="Export to Excel"
                  onClick={() => {
                    exportModal.onOpenChange();
                  }}
                  isIconOnly
                >
                  <ExportTableIcon className="w-4 h-4" />
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className="flex gap-4 my-8 overflow-x-scroll">
            <Chip
              as={Link}
              color={queryStatus === "all" ? "primary" : "default"}
              variant={queryStatus === "all" ? "flat" : "bordered"}
              to={`/dashboard/tests?status=all`}
            >
              All
            </Chip>
            {TestStatus.sort((a, b) => (a.value > b.value ? 1 : -1)).map(
              (status, index) => (
                <Chip
                  as={Link}
                  key={index}
                  color={queryStatus === status.value ? "primary" : "default"}
                  variant={queryStatus === status.value ? "flat" : "bordered"}
                  to={`/dashboard/tests?status=${status.value}`}
                >
                  {status.label}
                </Chip>
              )
            )}
          </div>
          <div className="relative w-full max-w-md mb-4">
            <Input
              type="text"
              placeholder={`Search by name, phone, test`}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              value={searchQuery}
              endContent={<IconSearch size={16} />}
            />
          </div>

          <Table aria-label="Tests" className="w-full whitespace-no-wrap">
            <TableHeader>
              <TableColumn>Status</TableColumn>
              <TableColumn>Test</TableColumn>
              <TableColumn>Patient</TableColumn>
              <TableColumn>Patient Number</TableColumn>
              <TableColumn>Added By</TableColumn>
              <TableColumn>Added On</TableColumn>
              <TableColumn>Appointment Date</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No Test to display"}>
              {tests
                .filter((test) => {
                  return handleSearch(test);
                })
                .map((test, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Chip
                            variant="dot"
                            // @ts-ignore
                            color={
                              TestStatus.find(
                                (status) => status.value === test.status
                              )?.color
                            }
                            onClick={() => {
                              if (test.status === "overdue") {
                                setSelected(test);
                                scheduleTestModal.onOpenChange();
                              }
                            }}
                          >
                            {test.status}
                          </Chip>
                        </DropdownTrigger>
                        {test.status != "completed" &&
                          test.status !== "overdue" &&
                          test.status !== "hold" && (
                            <DropdownMenu aria-label="Test Status">
                              {TestStatus.filter(
                                (status) =>
                                  status.value !== "overdue" &&
                                  status.value !== "hold"
                              ).map((status, index) => (
                                <DropdownItem
                                  key={index}
                                  onClick={() => {
                                    handleStatusChange(test, status.value);
                                  }}
                                >
                                  {status.label}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          )}
                      </Dropdown>
                    </TableCell>
                    <TableCell>{test.testDetail.testData.name}</TableCell>
                    <TableCell>{test.testDetail.userData.name}</TableCell>
                    <TableCell>{test.testDetail.userData.phone}</TableCell>
                    <TableCell>{test.addedby}</TableCell>
                    <TableCell>{humanReadableDate(test.addeddate)}</TableCell>
                    <TableCell>
                      {test.appointmentdate
                        ? humanReadableDate(test.appointmentdate)
                        : "Not Scheduled"}
                    </TableCell>
                    <TableCell className="flex items-center">
                      {(test.status !== "cancelled" ||
                        user?.role === "admin") && (
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              variant="light"
                              isIconOnly
                              radius="full"
                              aria-label="Actions"
                              size="sm"
                            >
                              <IconDotsVertical size={16} />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Test Actions"
                            disabledKeys={
                              test.status === "completed" ||
                              test.status === "cancelled"
                                ? ["schedule", "edit"]
                                : test.status === "hold"
                                ? ["schedule"]
                                : ["edit"]
                            }
                          >
                            <DropdownItem
                              className={`${
                                test.status === "hold" ? "" : "hidden"
                              }`}
                              key="edit"
                              startContent={<IconPencil size={16} />}
                              onClick={() => {
                                navigate(
                                  `/dashboard/tests/complete/report/${test._id}`
                                );
                              }}
                              textValue="Edit Test"
                            >
                              Edit Test
                            </DropdownItem>
                            <DropdownItem
                              className={`${
                                test.status === "completed" ? "" : "hidden"
                              }`}
                              key="download"
                              startContent={<IconDownload size={16} />}
                              onClick={() => {
                                navigate(`/report/${test.reportId}/download`);
                              }}
                              textValue="Download Report"
                            >
                              Download Report
                            </DropdownItem>
                            <DropdownItem
                              className={`${
                                test.status === "completed" ||
                                test.status === "cancelled" ||
                                test.status === "hold"
                                  ? "hidden"
                                  : ""
                              }`}
                              key={"schedule"}
                              onClick={() => {
                                setSelected(test);
                                scheduleTestModal.onOpenChange();
                              }}
                              startContent={<IconCalendarClock size={16} />}
                              textValue="Schedule Date"
                            >
                              {test.appointmentdate || test.status === "overdue"
                                ? "Re-"
                                : ""}
                              Schedule Date
                            </DropdownItem>
                            <DropdownItem
                              className={`text-danger ${
                                user?.role === "admin" ? "" : "hidden"
                              }`}
                              key="delete"
                              color="danger"
                              startContent={<IconTrash size={16} />}
                              onClick={() => {
                                setSelected(test);
                                deleteTestModal.onOpenChange();
                              }}
                              textValue="Delete Test"
                            >
                              Delete Test
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <>
        {selected && (
          <DeleteModal
            test={selected}
            deleteTestModal={deleteTestModal}
            setTests={setTests}
          />
        )}
      </>
      {selected && (
        <ScheduleModal
          test={selected}
          setTests={setTests}
          scheduleTestModal={scheduleTestModal}
        />
      )}
      <ExportModal tests={tests} exportModal={exportModal} />
    </>
  );
};

interface ExportModalProps {
  tests: Test[];
  exportModal: any;
}
interface FormValues {
  testIds: string[];
}

const ExportModal = ({ tests, exportModal }: ExportModalProps) => {
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
        }, 2000);
        exportModal.onClose();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <Modal
        isOpen={exportModal.isOpen}
        onOpenChange={exportModal.onOpenChange}
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 pb-0">
            <p>Export Tests</p>
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
            <div className="divider my-0"></div>
          </ModalHeader>
          <ModalBody className="gap-0">
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
          </ModalBody>
          <ModalFooter className="flex-col-reverse sm:flex-row">
            <Button
              fullWidth
              onClick={() => {
                exportModal.onClose();
              }}
              isDisabled={formik.isSubmitting}
            >
              Close!
            </Button>
            <Button
              color="primary"
              variant="flat"
              type="submit"
              fullWidth
              onClick={() => {
                formik.handleSubmit();
                toast.success("Exporting tests", {
                  id: "exporting-tests",
                });
              }}
              isLoading={formik.isSubmitting}
              isDisabled={formik.isSubmitting}
            >
              Export
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

interface DeleteModalProps {
  test: Test;
  setTests: any;
  deleteTestModal: any;
}

const DeleteModal = ({ test, setTests, deleteTestModal }: DeleteModalProps) => {
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
      deleteTestModal.onClose();
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
      <Modal
        isOpen={deleteTestModal.isOpen}
        onOpenChange={deleteTestModal.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <p>
                  Are you sure you want to delete{" "}
                  {test?.testDetail.testData.name}
                </p>
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
                    handleDelete();
                  }}
                  isLoading={processing}
                  isDisabled={processing}
                >
                  Delete Test
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

interface ScheduleModalProps {
  test: Test;
  setTests: any;
  scheduleTestModal: any;
}

const ScheduleModal = ({
  test,
  setTests,
  scheduleTestModal,
}: ScheduleModalProps) => {
  const formik = useFormik({
    initialValues: {
      appointmentdate: test.appointmentdate.split("T")[0],
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.appointmentdate) {
        errors.appointmentdate = "Please select a date";
      } else if (
        today(getLocalTimeZone()) > parseDate(values.appointmentdate)
      ) {
        errors.appointmentdate = "Please select a date in the future";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        if (test.status === "overdue") {
          await testStatus(test._id, "confirmed");
        }
        await axios.put(
          `${API_BASE_URL}/api/test/schedule/${test._id}`,
          {
            appointmentdate: values.appointmentdate,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Appointment Scheduled Successfully");
        scheduleTestModal.onClose();
      } catch (err) {
        toast.error("Failed to Schedule Appointment");
        console.log(err);
      } finally {
        const response = await axios.get(`${API_BASE_URL}/api/test/my`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        const data = response.data;
        setTests(data.reverse());
      }
    },
  });

  return (
    <Modal
      isOpen={scheduleTestModal.isOpen}
      onOpenChange={scheduleTestModal.onOpenChange}
      backdrop="blur"
    >
      <ModalContent
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        {(onClose) => (
          <>
            <ModalHeader>
              <p>
                Reschedule your appointment for {test?.testDetail.testData.name}
              </p>
            </ModalHeader>
            <ModalBody>
              <DatePicker
                fullWidth
                isRequired
                aria-label="Select Date"
                label="Select Date"
                value={parseDate(formik.values.appointmentdate)}
                // minValue={today(getLocalTimeZone())}
                // set minvalue to a day before today
                minValue={today(getLocalTimeZone())}
                onChange={(date) => {
                  formik.setFieldValue("appointmentdate", date.toString());
                }}
                isInvalid={formik.errors.appointmentdate ? true : false}
                errorMessage={formik.errors.appointmentdate}
              />
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
                type="submit"
                isLoading={formik.isSubmitting}
                isDisabled={formik.isSubmitting}
                fullWidth
              >
                Reschedule
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Tests;
