import {
  Button,
  Card,
  CardBody,
  DatePicker,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { useEffect } from "react";
import { toast } from "sonner";
import MERHistory from "./MERHistory";
import { useNavigate } from "react-router-dom";

const SelfBook = () => {
  const confirmModal = useDisclosure();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserByProfile = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        formik.setValues((previousValues) => {
          return {
            ...previousValues,
            patientid: data._id,
            name: data.name,
            phone: data.phone.replace(/^\+977/, ""),
          };
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    };
    fetchUserByProfile();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, "Name is too short"),
    age: Yup.number()
      .min(1, "You are too young to apply")
      .max(120, "Age too large"),
    phone: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      patientid: "",
      name: "",
      phone: "",
      appointmentdate: new Date().toISOString().split("T")[0],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios
          .post(`${API_BASE_URL}/api/mer/book-appointment`, values, {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          })
          .then(() => {
            toast.success("Application submitted successfully");
            confirmModal.onOpenChange();
            navigate(0);
          });
      } catch (error: any) {
        toast.error(error.response.data.error);
        console.error(error);
      }
    },
  });
  return (
    <>
      <Card className="p-4">
        <CardBody className="flex md:flex-row flex-col justify-between h-full gap-8">
          <div className="w-full sm:min-w-[350px]">
            <h3>Apply for New Medical Examination Test </h3>
            <div className="mt-4 flex justify-between h-[90%] flex-col gap-4">
              <div className="flex flex-col gap-4">
                <Input
                  label="Name"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  isInvalid={
                    formik.touched.name && formik.errors.name ? true : false
                  }
                  errorMessage={formik.errors.name}
                />

                <Input
                  label="Mobile Number"
                  name="phone"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  isInvalid={
                    formik.touched.phone && formik.errors.phone ? true : false
                  }
                  errorMessage={formik.errors.phone}
                />
                <DatePicker
                  label="Date of Appointment"
                  onChange={(date) => {
                    formik.setFieldValue(
                      "appointmentdate",
                      date.toString().split("T")[0]
                    );
                  }}
                  value={parseDate(formik.values.appointmentdate)}
                  minValue={today(getLocalTimeZone())}
                  isInvalid={formik.errors.appointmentdate ? true : false}
                  errorMessage={formik.errors.appointmentdate}
                  showMonthAndYearPickers
                />
              </div>
              <Button
                color="primary"
                variant="flat"
                onPress={confirmModal.onOpenChange}
                isLoading={formik.isSubmitting}
              >
                Submit Appointment
              </Button>
            </div>
          </div>
          <div className="border-default rounded-full border-2"></div>
          <MERHistory />
        </CardBody>
      </Card>
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
              {/* <ModalBody></ModalBody> */}
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

export default SelfBook;
