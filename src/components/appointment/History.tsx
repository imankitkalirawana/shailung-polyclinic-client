import { useEffect, useState } from "react";
import { TestStatus } from "../../utils/config";
import { humanReadableDate } from "../admin/user/Users";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";
import { testStatus } from "../admin/tests/Tests";
import NotFound from "../NotFound";
import { Helmet } from "react-helmet-async";
import { IconSearch } from "@tabler/icons-react";
import { Test } from "../../interface/interface";
import { parseDate } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";

import {
  Button,
  Card,
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
  useDisclosure,
} from "@nextui-org/react";

const History = () => {
  const { loggedIn, user } = isLoggedIn();
  const [tests, setTests] = useState<Test[]>([]);
  const [selected, setSelected] = useState<Test | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const deleteTestModal = useDisclosure();
  const scheduleTestModal = useDisclosure();

  if (!loggedIn) {
    window.location.href = "/auth/login";
  }

  const handleDeleteClick = () => {
    // setSelected(test);
    // setDeleteModal(true);
  };
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

  useEffect(() => {
    fetchTests();
    if (user?.role === "admin" || user?.role === "member") {
      navigate("/dashboard/tests");
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

  const handleDelete = async (test: any) => {
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
      fetchTests();
      toast.success("Appointment Cancelled Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Cancel Appointment!");
    }
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
      <div className="mx-auto max-w-6xl my-24">
        <div className="flex mb-4 justify-between items-center">
          <h1 className="my-6 sm:text-2xl w-full font-semibold">
            Your Appointment History
          </h1>
          <div className="flex gap-2 flex-row-reverse">
            <Button
              variant="flat"
              color="primary"
              as={Link}
              to="/appointment/new"
              className="hidden sm:flex"
            >
              New Appointment
            </Button>
          </div>
        </div>
        <div role="tablist" className="tabs tabs-boxed bg-transparent">
          <div className="relative w-full max-w-md mb-4">
            <Input
              type="text"
              placeholder="Search by name, doctor, date, status"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              endContent={<IconSearch />}
            />
          </div>
          <Button
            as={Link}
            variant="flat"
            color="primary"
            to={"/appointment/new"}
            className="sm:hidden"
          >
            New Appointment
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.length > 0 ? (
              tests
                .filter((test) => {
                  return handleSearch(test);
                })
                .map((test) => (
                  <Card key={test._id}>
                    <div className="w-full p-8">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-light text-xs">Name</p>
                          <p className="font-medium">
                            {test.testDetail.userData.name}
                          </p>
                        </div>
                        <Chip
                          size="sm"
                          variant="flat"
                          // @ts-ignore
                          // color={
                          //   TestStatus.find(
                          //     (status) => status.value === test.status
                          //   )?.color
                          // }
                          className="text-end text-nowrap overflow-hidden text-ellipsis"
                        >
                          {test.testDetail.testData.name}
                        </Chip>
                      </div>

                      <div className="mt-4">
                        <p className="font-light text-xs">Status</p>
                        <p className="font-medium tracking-more-wider capitalize">
                          {test.status}
                        </p>
                      </div>
                      <div className="pt-6">
                        <div className="flex justify-between">
                          <p className="font-light text-xs">Appointment On</p>
                          <div className="flex items-center justify-center gap-2">
                            {test.status === "completed" && (
                              <Link
                                to={`/report/${test.reportId}/download`}
                                className="btn btn-xs mb-1 btn-success"
                              >
                                View Report
                              </Link>
                            )}
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
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => {
                                    if (test.status === "overdue") {
                                      setSelected(test);
                                      scheduleTestModal.onOpenChange();
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
                                ></Chip>
                              </DropdownTrigger>
                              {test.status != "completed" &&
                                test.status !== "overdue" &&
                                test.status !== "cancelled" && (
                                  <DropdownMenu aria-label="Status">
                                    <DropdownItem
                                      onClick={() => {
                                        setSelected(test);
                                        scheduleTestModal.onOpenChange();
                                      }}
                                    >
                                      Reschedule
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => {
                                        setSelected(test);
                                        deleteTestModal.onOpenChange();
                                      }}
                                    >
                                      Cancel
                                    </DropdownItem>
                                  </DropdownMenu>
                                )}
                            </Dropdown>
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
                  </Card>
                ))
            ) : (
              <div className="col-span-full">
                <NotFound message="No Appointments Found" />
              </div>
            )}
          </div>
        </div>
      </div>
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
                  Are you sure you want to cancel your appointment for{" "}
                  {selected?.testDetail.testData.name}
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
                    handleDelete(selected);
                    deleteTestModal.onClose();
                  }}
                >
                  Cancel Appointment
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {selected && (
        <ScheduleModal
          test={selected}
          scheduleTestModal={scheduleTestModal}
          setTests={setTests}
        />
      )}
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
  const [date, setDate] = useState<string>(test.appointmentdate.split("T")[0]);
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
  };
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
          handleSchedule();
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
                label="Select Date"
                value={parseDate(date)}
                minValue={today(getLocalTimeZone())}
                onChange={(date) => {
                  setDate(date.toString());
                }}
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
              <Button color="primary" variant="flat" type="submit" fullWidth>
                Reschedule
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default History;
