import {
  Button,
  Card,
  CardBody,
  Chip,
  DatePicker,
  Input,
  Modal,
  ModalBody,
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

const UserMer = () => {
  const confirmModal = useDisclosure();
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
            name: data.name,
            age: data.age,
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
    phone: Yup.string().matches(
      /^(\+\d{1,3}[- ]?)?\d{10}$/,
      "Invalid phone number format"
    ),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
      phone: "",
      appointmentdate: new Date().toISOString().split("T")[0],
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });
  return (
    <>
      <Card className="p-4">
        <CardBody className="flex flex-row justify-between gap-8">
          <div className="w-full">
            <h3>Apply for New Medical Examination Test </h3>
            <div className="mt-4 flex flex-col gap-4">
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
                label="Age"
                name="age"
                onChange={formik.handleChange}
                value={formik.values.age}
                type="number"
                isInvalid={
                  formik.touched.age && formik.errors.age ? true : false
                }
                errorMessage={formik.errors.age}
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
          <div className="w-full">
            <h3>Your Previous Examinations</h3>
            <div className="mt-4">
              <Card>
                <CardBody>THis is your last test report</CardBody>
              </Card>
            </div>
          </div>
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

export default UserMer;
