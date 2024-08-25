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
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ExportTableIcon } from "../../icons/Icons";
import { useEffect, useState } from "react";
import { isLoggedIn } from "../../../utils/auth";
import { parseDate } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  IconCalendarClock,
  IconDotsVertical,
  IconDownload,
  IconPencil,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { MERAppointment } from "../../../interface/interface";
import axios from "axios";
import { API_BASE_URL, TestStatus } from "../../../utils/config";
import { humanReadableDate } from "../user/Users";
import { toast } from "sonner";
import { data } from "../../../utils/data";
import { getAllMERAppointments } from "../../../functions/get";
import { useFormik } from "formik";
import AppointmentWidget from "./AppointmentWidget";

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = isLoggedIn();
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState<MERAppointment[]>([]);
  const [selected, setSelected] = useState<MERAppointment | null>(null);

  const scheduleTestModal = useDisclosure();
  const deleteTestModal = useDisclosure();

  useEffect(() => {
    if (
      user?.role !== "admin" &&
      user?.role !== "doctor" &&
      user?.role !== "recp"
    ) {
      navigate("/dashboard");
    }
  }, [user]);

  const handleStatusChange = async (
    appointment: MERAppointment,
    status: string
  ) => {
    try {
      if (status === "completed") {
        navigate(
          `/dashboard/medical-examination/new?appointment-id=${appointment._id}&patient-id=${appointment.patientid}`
        );
        return;
      }
      await axios
        .put(
          `${API_BASE_URL}/api/mer/appointments/status/${appointment._id}`,
          { status: status },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          toast.success("Status updated successfully");
        });
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    } finally {
      setAppointments(await getAllMERAppointments());
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setAppointments(await getAllMERAppointments());
    };
    fetchAppointments();
  }, []);
  return (
    <>
      <Helmet>
        <title>Medical Examination Appointments - {data.title}</title>
      </Helmet>
      <div className="mx-auto">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">
              Medical Examination Appointments
            </h1>
            <div className="flex gap-2 flex-row-reverse">
              {(user?.role === "admin" || user?.role === "recp") && (
                <Button
                  variant="flat"
                  color="primary"
                  as={Link}
                  to="/dashboard/medical-examination/"
                >
                  New Appointment
                </Button>
              )}
            </div>
          </div>
          <div className="relative w-full max-w-md my-4">
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
              <TableColumn>Patient Name</TableColumn>
              <TableColumn>Patient Phone</TableColumn>
              <TableColumn>Added By</TableColumn>
              <TableColumn>Appointment Date</TableColumn>
              <TableColumn>Booked On</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No Test to display"}>
              {appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>
                    <Dropdown
                      isDisabled={
                        (user?.role !== "admin" && user?.role !== "doctor") ||
                        appointment.status === "completed" ||
                        appointment.status === "cancelled" ||
                        appointment.status === "hold" ||
                        (user.role === "doctor" &&
                          appointment.status === "overdue")
                      }
                    >
                      <DropdownTrigger>
                        <Chip
                          variant="dot"
                          // @ts-ignore
                          color={
                            TestStatus.find(
                              (status) => status.value === appointment.status
                            )?.color
                          }
                          onClick={() => {
                            if (appointment.status === "overdue") {
                              setSelected(appointment);
                              scheduleTestModal.onOpenChange();
                            }
                          }}
                        >
                          {appointment.status}
                        </Chip>
                      </DropdownTrigger>
                      {appointment.status != "completed" &&
                        appointment.status !== "overdue" &&
                        appointment.status !== "hold" && (
                          <DropdownMenu aria-label="Test Status">
                            {TestStatus.filter(
                              (status) =>
                                status.value !== "overdue" &&
                                status.value !== "hold"
                            ).map((status) => (
                              <DropdownItem
                                key={status.value}
                                onClick={() => {
                                  handleStatusChange(appointment, status.value);
                                }}
                              >
                                {status.label}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        )}
                    </Dropdown>
                  </TableCell>
                  <TableCell>{appointment.name}</TableCell>
                  <TableCell>{appointment.phone}</TableCell>
                  <TableCell>{appointment.addedby}</TableCell>
                  <TableCell>
                    {humanReadableDate(appointment.appointmentdate)}
                  </TableCell>
                  <TableCell>
                    {humanReadableDate(appointment.createdAt)}
                  </TableCell>
                  <TableCell>
                    {((appointment.status !== "cancelled" &&
                      appointment.status !== "hold") ||
                      user?.role === "admin" ||
                      user?.role === "doctor") && (
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
                            user?.role === "doctor"
                              ? ["schedule"]
                              : appointment.status === "completed" ||
                                appointment.status === "cancelled"
                              ? ["schedule", "edit"]
                              : appointment.status === "hold"
                              ? ["schedule"]
                              : ["edit"]
                          }
                        >
                          <DropdownItem
                            className={`${
                              appointment.status === "hold" ? "" : "hidden"
                            }`}
                            key="edit"
                            startContent={<IconPencil size={16} />}
                            onClick={() => {
                              navigate(
                                `/dashboard/tests/complete/report/${appointment._id}`
                              );
                            }}
                            textValue="Edit Test"
                          >
                            Edit Test
                          </DropdownItem>

                          <DropdownItem
                            className={`${
                              appointment.status === "completed" ||
                              appointment.status === "cancelled" ||
                              appointment.status === "hold"
                                ? "hidden"
                                : ""
                            }`}
                            key={"schedule"}
                            onClick={() => {
                              setSelected(appointment);
                              scheduleTestModal.onOpenChange();
                            }}
                            startContent={<IconCalendarClock size={16} />}
                            textValue="Schedule Date"
                          >
                            {appointment.appointmentdate ||
                            appointment.status === "overdue"
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
                              setSelected(appointment);
                              deleteTestModal.onOpenChange();
                            }}
                            textValue="Delete Appointment"
                          >
                            Delete Appointment
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
            setTests={setAppointments}
          />
        )}
      </>
      {selected && (
        <ScheduleModal
          test={selected}
          setTests={setAppointments}
          scheduleTestModal={scheduleTestModal}
        />
      )}
    </>
  );
};

interface DeleteModalProps {
  test: MERAppointment;
  setTests: any;
  deleteTestModal: any;
}

interface ScheduleModalProps {
  test: MERAppointment;
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
        await axios.put(
          `${API_BASE_URL}/api/mer/appointments/reschedule/${test._id}`,
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
        const data = await getAllMERAppointments();
        setTests(data);
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
              <p>Reschedule your appointment for {test.name}</p>
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
                showMonthAndYearPickers
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
                onClick={() => formik.handleSubmit()}
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

const DeleteModal = ({ test, setTests, deleteTestModal }: DeleteModalProps) => {
  const [processing, setProcessing] = useState(false);
  const handleDelete = async () => {
    setProcessing(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/mer/appointments/${test._id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      toast.success("Appointment deleted successfully");
      deleteTestModal.onClose();
    } catch (err) {
      toast.error("Failed to delete appointment");
      console.log(err);
    } finally {
      setProcessing(false);
      const data = await getAllMERAppointments();
      setTests(data);
    }
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
                <p>Are you sure you want to delete this appointment?</p>
              </ModalHeader>
              <ModalBody className="justify-center flex-row">
                {<AppointmentWidget appointment={test} />}
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
                  color="danger"
                  variant="flat"
                  fullWidth
                  isLoading={processing}
                  isDisabled={processing}
                  onPress={handleDelete}
                >
                  Delete Appointment
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Appointments;
