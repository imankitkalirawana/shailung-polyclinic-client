import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { humanReadableDate } from "../user/Users";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { useFormik } from "formik";
import { getAllAvailableTests } from "../../../functions/get";
import { isLoggedIn } from "../../../utils/auth";
import { AvailableTest as Test } from "../../../interface/interface";
import * as Yup from "yup";
import {
  Button,
  Chip,
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
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import {
  IconDotsVertical,
  IconArrowUpRight,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import FormTable from "./FormTable";

const AvailableTests = () => {
  const { user } = isLoggedIn();
  const [tests, setTests] = useState<Test[]>([]);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Test | null>(null);
  const deleteTestModal = useDisclosure();
  const newServiceModal = useDisclosure();

  const fetchTests = async () => {
    try {
      const data = await getAllAvailableTests();
      setTests(data);
    } catch (error: any) {
      toast.error(error.response.statusText);
    }
  };
  useEffect(() => {
    fetchTests();
  }, []);

  const handleDelete = async (test: Test) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/available-test/${test._id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      await fetchTests();
      toast.success("Test deleted successfully");
      deleteTestModal.onClose();
    } catch (error: any) {
      console.log(error.response.data);
      toast.error("Error deleting user");
    }
  };

  return (
    <>
      <section>
        <div className="w-full shadow-xs">
          <div className="flex justify-between items-center">
            <h2 className="my-6 text-2xl font-semibold">Available Services</h2>
            {user?.role === "admin" && (
              <Button
                variant="flat"
                color="primary"
                onClick={newServiceModal.onOpenChange}
              >
                <span>New Service</span>
              </Button>
            )}
          </div>
          <Table
            topContent={
              <span className="text-default-400 text-small">
                Total {tests.length} services
              </span>
            }
            aria-label="Users"
            onRowAction={(key) => {
              navigate(`/dashboard/tests/available-tests/${key}`);
            }}
            selectionMode="single"
          >
            <TableHeader>
              <TableColumn key="status">Status</TableColumn>
              <TableColumn key="uniqueid">Unique ID</TableColumn>
              <TableColumn key="name">Name</TableColumn>
              <TableColumn key="price">Price</TableColumn>
              <TableColumn key="duration">Duration</TableColumn>
              <TableColumn key="date">Added On</TableColumn>
              <TableColumn key="modify" hidden={user?.role !== "admin"}>
                Actions
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No Available services"} items={tests}>
              {(test) => (
                <TableRow key={test._id}>
                  <TableCell>
                    <Chip
                      variant="dot"
                      color={test.status === "active" ? "success" : "danger"}
                    >
                      {test.status}
                    </Chip>
                  </TableCell>
                  <TableCell>{test.uniqueid || "-"}</TableCell>
                  <TableCell>{test.name}</TableCell>
                  <TableCell>{test.price}</TableCell>
                  <TableCell>{test.duration}</TableCell>
                  <TableCell>{humanReadableDate(test.updatedat)}</TableCell>
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
                          onPress={() =>
                            navigate(
                              `/dashboard/tests/available-tests/${test._id}`
                            )
                          }
                        >
                          View test
                        </DropdownItem>
                        <DropdownItem
                          startContent={<IconPencil size={16} />}
                          key="edit"
                          onPress={() =>
                            navigate(
                              `/dashboard/tests/available-tests/${test._id}/edit`
                            )
                          }
                        >
                          Edit Test
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<IconTrash size={16} />}
                          onPress={() => {
                            deleteTestModal.onOpen();
                            setSelected(test);
                          }}
                        >
                          Delete file
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
      <AddTest newServiceModal={newServiceModal} />
      <Modal
        isOpen={deleteTestModal.isOpen}
        onOpenChange={deleteTestModal.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <p>Are you sure you want to delete {selected?.name}</p>
              </ModalHeader>
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
                    handleDelete(selected as Test);
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

interface AddTestProps {
  newServiceModal: any;
}

const AddTest = ({ newServiceModal }: AddTestProps) => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    price: Yup.string().required("Price is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      uniqueid: "",
      description: "",
      price: "",
      duration: "",
      summary: "",
      doctors: [] as string[],
      serviceid: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values", values);
    },
  });

  const handleTableSubmit = async (values: any) => {
    try {
      await handleFormikSubmit(values, formik.values);
      // console.log("values", values);
    } catch (error: any) {
      toast.error("Error submitting data");
      console.error("Error submitting data:", error);
    }
  };
  const handleFormikSubmit = async (values: any, formikData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/available-test`,
        {
          data: values,
          values: formikData,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      navigate(
        `/dashboard/tests/available-tests/${response.data._id}/edit#formtable`
      );
      toast.success("Please fill the form table to complete the process");
      console.log("Data submitted successfully:", response.data);
    } catch (error: any) {
      toast.error("Error submitting data");
      console.error("Error submitting data:", error);
    }
  };

  return (
    <>
      <Modal
        isOpen={newServiceModal.isOpen}
        onOpenChange={newServiceModal.onOpenChange}
        backdrop="blur"
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">New Service</ModalHeader>
          <ModalBody className="grid sm:grid-cols-2">
            <Input
              type="text"
              name="uniqueid"
              id="uniqueid"
              label="Unique Test ID"
              placeholder="eg: 001"
              onChange={formik.handleChange}
              value={formik.values.uniqueid}
            />
            <Input
              type="text"
              name="name"
              id="name"
              label="Name"
              isRequired
              placeholder="eg: Blood Test - CBC"
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={formik.touched.name && !!formik.errors.name}
              errorMessage={formik.errors.name}
            />

            <Input
              type="text"
              name="price"
              label="Price"
              placeholder="eg: NPR 1000"
              id="price"
              onChange={formik.handleChange}
              value={formik.values.price}
              isRequired
              isInvalid={formik.touched.price && !!formik.errors.price}
              errorMessage={formik.errors.price}
            />

            <Input
              type="text"
              name="duration"
              label="Duration"
              id="duration"
              placeholder="eg: 1hr 30mins"
              onChange={formik.handleChange}
              value={formik.values.duration}
            />
            <Textarea
              name="description"
              id="description"
              label="Description"
              placeholder="eg: Done on Automated Chemiluminescence ANALYER By CLA Method"
              description="This will be displayed on top of the investigation report table in the report. (Just after the patient details)"
              onChange={formik.handleChange}
              value={formik.values.description}
            />

            <Textarea
              name="summary"
              label="Summary"
              id="summary"
              placeholder="eg: 1hr 30mins"
              description="This will be displayed at the bottom of the investigation report table in the report. (Just before the doctor's signature)"
              onChange={formik.handleChange}
              value={formik.values.summary}
            />
            <div className="form-control col-span-full">
              <FormTable onSubmit={handleTableSubmit} isHidden />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AvailableTests;
