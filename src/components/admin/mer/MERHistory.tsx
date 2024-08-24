import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MERAppointment } from "../../../interface/interface";
import AppointmentWidget from "./AppointmentWidget";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { useFormik } from "formik";
import { toast } from "sonner";

const MERHistory = () => {
  const [selectedMer, setSelectedMer] = useState<MERAppointment | null>(null);
  const confirmModal = useDisclosure();

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/mer/appointments/my`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      formik.setValues({
        appointments: response.data.reverse(),
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  const formik = useFormik({
    initialValues: {
      appointments: [],
    },
    onSubmit: async () => {
      try {
        await axios
          .put(
            `${API_BASE_URL}/api/mer/appointments/status/${selectedMer?._id}`,
            {
              status: "cancelled",
            },
            {
              headers: {
                Authorization: `${localStorage.getItem("token")}`,
              },
            }
          )
          .then(() => {
            toast.success("Application status updated");
            fetchAppointments();
            confirmModal.onClose();
          });
      } catch (error: any) {
        toast.error(error.response.data.error);
        console.error(error);
      }
    },
  });

  return (
    <>
      <div className="w-full">
        <h3>Your Previous Examinations</h3>

        <ScrollShadow className="w-full flex justify-center items-start mt-4 h-[50vh]">
          {formik.values.appointments.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4">
              {formik.values.appointments.map(
                (merAppointment: MERAppointment) => (
                  <div
                    key={merAppointment._id}
                    onClick={() => {
                      if (
                        merAppointment.status === "booked" ||
                        merAppointment.status === "confirmed" ||
                        merAppointment.status === "inprogress" ||
                        merAppointment.status === "hold"
                      ) {
                        setSelectedMer(merAppointment);
                        confirmModal.onOpenChange();
                      }
                    }}
                  >
                    <AppointmentWidget
                      key={merAppointment._id}
                      appointment={merAppointment}
                    />
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-center mt-24">No previous examinations found.</p>
          )}
        </ScrollShadow>
      </div>
      <Modal
        isOpen={selectedMer !== null && confirmModal.isOpen}
        onOpenChange={() => {
          setSelectedMer(null);
          confirmModal.onOpenChange();
        }}
        backdrop="opaque"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <p>Are you sure you want to cancel this appointment?</p>
              </ModalHeader>
              <ModalBody className="justify-center flex-row">
                {selectedMer && <AppointmentWidget appointment={selectedMer} />}
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
                  onPress={() => formik.handleSubmit()}
                  isLoading={formik.isSubmitting}
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

export default MERHistory;
