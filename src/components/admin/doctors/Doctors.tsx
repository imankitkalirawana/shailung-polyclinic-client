import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../../utils/auth";
import { Doctor } from "../../../interface/interface";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { getAllDoctors } from "../../../functions/get";
import {
  IconArrowUpRight,
  IconDotsVertical,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useFormik } from "formik";
import { UploadSingleFile } from "../../../utils/FileHandling";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
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
  useDisclosure,
} from "@nextui-org/react";
import * as Yup from "yup";

const Doctors = () => {
  const { user } = isLoggedIn();
  if (!user || user.role !== "admin") {
    window.location.href = "/auth/login";
  }
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const deleteDoctorModal = useDisclosure();
  const addDoctorModal = useDisclosure();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchDoctors = async () => {
      const data = await getAllDoctors();
      setDoctors(data);
    };
    fetchDoctors();
  }, []);

  return (
    <>
      <Helmet>
        <title>Doctors - Shailung Polyclinic</title>
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
        <div className="w-full mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Doctors</h1>
            <div className="flex gap-2 flex-row-reverse">
              <Button
                variant="flat"
                color="primary"
                onClick={addDoctorModal.onOpenChange}
              >
                New Doctor
              </Button>
            </div>
          </div>
        </div>
        <Table
          aria-label="Doctors"
          onRowAction={(key) => {
            navigate(`/dashboard/doctors/${key}`);
          }}
          selectionMode="single"
        >
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
            <TableColumn key="designation">Designation</TableColumn>
            <TableColumn key="email">Email</TableColumn>
            <TableColumn key="phone">Phone Number</TableColumn>
            <TableColumn key="regno">Reg No</TableColumn>
            <TableColumn hidden={user?.role !== "admin"} key="actions">
              Actions
            </TableColumn>
            {/* {user?.role === "admin" && <th>Actions</th>} */}
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {doctors.map((doctor) => (
              <TableRow key={doctor._id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.designation}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.phone}</TableCell>
                <TableCell>{doctor.regno}</TableCell>
                <TableCell hidden={user?.role !== "admin"}>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="light"
                        radius="full"
                        size="sm"
                        isIconOnly
                      >
                        <IconDotsVertical size={16} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Actions">
                      <DropdownItem
                        startContent={<IconArrowUpRight size={16} />}
                        key="view"
                        onClick={() => {
                          navigate(`/dashboard/doctors/${doctor._id}`);
                        }}
                      >
                        View
                      </DropdownItem>
                      <DropdownItem
                        startContent={<IconPencil size={16} />}
                        key="edit"
                        onClick={() => {
                          navigate(`/dashboard/doctors/${doctor._id}/edit`);
                        }}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        color="danger"
                        startContent={<IconTrash size={16} />}
                        key="delete"
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          deleteDoctorModal.onOpenChange();
                        }}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AddUser addDoctorModal={addDoctorModal} />
      {selectedDoctor && (
        <DeleteModal
          doctor={selectedDoctor}
          setDoctors={setDoctors}
          deleteDoctorModal={deleteDoctorModal}
        />
      )}
    </>
  );
};

interface DeleteModalProps {
  doctor: Doctor;
  setDoctors: any;
  deleteDoctorModal: any;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  doctor,
  setDoctors,
  deleteDoctorModal,
}) => {
  const [processing, setProcessing] = useState(false);
  const handleDelete = async (doctor: Doctor) => {
    setProcessing(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/doctor/doctor/${doctor._id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      toast.success("Doctor deleted successfully");
      deleteDoctorModal.onClose();
      fetchDoctors();
    } catch (error: any) {
      console.log(error.response.data);
      toast.error("Error deleting doctor");
    }
    setProcessing(false);
  };
  const fetchDoctors = async () => {
    try {
      const doctors = await getAllDoctors();
      setDoctors(doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  return (
    <>
      <Modal
        isOpen={deleteDoctorModal.isOpen}
        onOpenChange={deleteDoctorModal.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <p>Are you sure you want to delete {doctor?.name}</p>
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
                  isLoading={processing}
                  isDisabled={processing}
                  onPress={() => {
                    handleDelete(doctor);
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

interface AddUserProps {
  addDoctorModal: any;
}

const AddUser = ({ addDoctorModal }: AddUserProps) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const doctorSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Too short")
      .max(50, "Too long"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    designation: Yup.string().required("Designation is required"),
    regno: Yup.string().required("Registration number is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      designation: "",
      regno: "",
      sign: "",
      previewSign: "",
    },
    validationSchema: doctorSchema,
    onSubmit: async (values) => {
      try {
        if (values.phone && !values.phone.startsWith("+")) {
          values.phone = "+977" + values.phone;
        }
        if (file) {
          const filename = `sign-${values.email}.${
            file.name.split(".").pop() || "jpg"
          }`;
          await UploadSingleFile(file, filename);
          values.sign = filename;
        }
        await axios.post(`${API_BASE_URL}/api/doctor/doctor`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("Doctor added successfully");
        addDoctorModal.onOpenChange();
        navigate("/dashboard/doctors");
      } catch (error: any) {
        toast.error(error.response.data.error);
        console.log(error);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile: File = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        formik.setValues({
          ...formik.values,
          previewSign: imageData,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  return (
    <>
      <Modal
        isOpen={addDoctorModal.isOpen}
        onOpenChange={addDoctorModal.onOpenChange}
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Register New Doctor
          </ModalHeader>
          <ModalBody
            as={"form"}
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            <Input
              type="text"
              name="name"
              id="name"
              label="Doctor Name"
              placeholder="e.g. Dr. John Doe"
              isRequired
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={formik.touched.name && !!formik.errors.name}
              errorMessage={formik.errors.name}
            />

            <Input
              type="text"
              name="email"
              id="email"
              label="Email"
              placeholder="e.g. johndoe@example.com"
              onChange={formik.handleChange}
              value={formik.values.email}
              isRequired
              isInvalid={formik.touched.email && !!formik.errors.email}
              errorMessage={formik.errors.email}
            />

            <Input
              type="text"
              name="phone"
              id="phone"
              label="Phone Number"
              placeholder="e.g. 9841234567"
              onChange={formik.handleChange}
              value={formik.values.phone}
              isRequired
              description="Please don't include country code"
              isInvalid={formik.touched.phone && !!formik.errors.phone}
              errorMessage={formik.errors.phone}
            />

            <Input
              type="text"
              name="designation"
              id="designation"
              label="Designation"
              placeholder="e.g. General Physician"
              onChange={formik.handleChange}
              value={formik.values.designation}
              isRequired
              isInvalid={
                formik.touched.designation && !!formik.errors.designation
              }
              errorMessage={formik.errors.designation}
            />

            <Input
              type="text"
              name="regno"
              id="regno"
              label="Registration Number"
              placeholder="e.g. 1234"
              onChange={formik.handleChange}
              value={formik.values.regno}
              isRequired
              isInvalid={formik.touched.regno && !!formik.errors.regno}
              errorMessage={formik.errors.regno}
            />

            <label className="label">
              <span className="label-text">Doctor's Sign</span>
            </label>
            <label
              htmlFor="sign"
              className="w-full flex items-center justify-center"
            >
              <div
                tabIndex={0}
                className="grid w-full focus:outline-none overflow-hidden relative bg-default-100 hover:bg-default-200 rounded-lg p-2"
              >
                <div className="relative w-full cursor-pointer ">
                  <div
                    className="w-full rounded-lg duration-300 ease-in-out border-default-900 outline-dashed"
                    role="presentation"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                      <svg
                        className="w-8 h-8 mb-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-1 text-sm">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs">SVG, PNG or JPG</p>
                    </div>
                  </div>
                </div>
                <div
                  className="w-full px-1"
                  aria-description="content file holder"
                >
                  <input
                    type="file"
                    name="sign"
                    id="sign"
                    className="file-input file-input-bordered w-full"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e)}
                    hidden
                  />
                </div>
              </div>
            </label>
            <div>
              <label className="label">
                <span className="label-text">Sign Preview</span>
              </label>
              <div className="bg-white mx-auto rounded-xl w-full shadow-lg">
                <Image
                  src={
                    formik.values.previewSign
                      ? formik.values.previewSign
                      : `${API_BASE_URL}/api/upload/single/${formik.values.sign}`
                  }
                  className="object-contain mx-auto w-auto aspect-square h-48 card mix-blend-darken"
                  alt={formik.values.name}
                  title="profile"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex-col-reverse sm:flex-row">
            <Button
              variant="flat"
              onClick={addDoctorModal.onOpenChange}
              type="button"
              fullWidth
              isDisabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={formik.isSubmitting}
              isLoading={formik.isSubmitting}
              color="primary"
              variant="flat"
              fullWidth
              onClick={() => formik.handleSubmit()}
            >
              Add Doctor
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Doctors;
