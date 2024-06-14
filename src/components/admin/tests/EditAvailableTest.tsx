import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../../../utils/config";
import { PlusIcon, XIcon } from "../../icons/Icons";
import { isLoggedIn } from "../../../utils/auth";
import { getAllDoctors } from "../../../functions/get";
import { Doctor } from "../../../interface/interface";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";

const EditAvailableTest = () => {
  const { user } = isLoggedIn();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "member") {
      navigate("/dashboard");
    }
  }, [user]);
  const { id }: any = useParams();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(
        `${API_BASE_URL}/api/available-test/${id}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      formik.setValues(data);
      const res2 = await getAllDoctors();
      setDoctors(res2);
    };
    fetchUser();
  }, []);

  const formik = useFormik({
    initialValues: {
      _id: "",
      uniqueid: "",
      name: "",
      description: "",
      price: "0",
      duration: "",
      status: "active",
      doctors: [] as string[],
      summary: "",
      testProps: Array.from({ length: 1 }, () => ({
        investigation: "",
        referenceValue: "",
        unit: "",
      })),
    },
    validate: (values) => {
      const errors: any = {};
      if (values.doctors.length === 0) {
        errors.doctors = "Select atleast one doctor";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await axios.put(`${API_BASE_URL}/api/available-test/${id}`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("Updated Successfully");
        navigate("/dashboard/tests/available-tests");
      } catch (error: any) {
        console.log(error.message);
        toast.error(error.message);
      }
    },
  });

  const addNewRow = () => {
    formik.setValues((prevValues) => ({
      ...prevValues,
      testProps: [
        ...prevValues.testProps,
        {
          investigation: "",
          referenceValue: "",
          unit: "",
        },
      ],
    }));
  };

  const removeRow = (index: number) => {
    formik.setValues((prevValues) => ({
      ...prevValues,
      testProps: prevValues.testProps.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-base font-semibold leading-7 text-base-content"
                data-tip="Test Title"
              >
                Test Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-base-neutral">
                Update your Test information.
              </p>
            </div>
            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              isDisabled={formik.isSubmitting}
              variant="flat"
              color="primary"
            >
              Update
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-6 sm:col-span-2">
              <Input
                type="text"
                name="uniqueid"
                id="uniqueid"
                label="Unique Test ID"
                placeholder="eg: 001"
                onChange={formik.handleChange}
                value={formik.values.uniqueid}
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <Input
                type="text"
                name="name"
                id="name"
                label="Test Name"
                placeholder="Enter Test Name"
                autoComplete="given-name"
                onChange={formik.handleChange}
                value={formik.values.name}
                isRequired
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <Input
                type="text"
                name="price"
                id="price"
                label="Test Price"
                placeholder="Enter Price"
                onChange={formik.handleChange}
                value={formik.values.price}
                isRequired
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <Input
                type="text"
                name="duration"
                id="duration"
                label="Test Duration"
                placeholder="Enter Duration"
                autoComplete="duration"
                onChange={formik.handleChange}
                value={formik.values.duration}
              />
            </div>

            <div className="col-span-6">
              <Textarea
                id="description"
                name="description"
                label="Description"
                placeholder="Enter Description"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </div>
            <div className="col-span-6">
              <Textarea
                id="summary"
                name="summary"
                label="Summary"
                placeholder="Enter Summary"
                onChange={formik.handleChange}
                value={formik.values.summary}
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <Select
                id="status"
                name="status"
                label="Test Status"
                onChange={formik.handleChange}
                selectedKeys={[formik.values.status]}
              >
                <SelectItem key="active">Available</SelectItem>
                <SelectItem key="inactive">Not Available</SelectItem>
              </Select>
            </div>
            <div className="col-span-2">
              <label htmlFor="doctors" className="label">
                <span className="label-text">Doctors</span>
              </label>
              <div className="max-h-48 p-2 overflow-y-scroll">
                {doctors.map((doctor: Doctor, index) => (
                  <div className="form-control" key={index}>
                    <Checkbox
                      name="doctors"
                      className="mb-1"
                      value={doctor._id}
                      isSelected={formik.values.doctors.includes(
                        doctor._id as string
                      )}
                      onChange={formik.handleChange}
                    >
                      {doctor.name}
                    </Checkbox>
                  </div>
                ))}
                {formik.errors.doctors && (
                  <label htmlFor="doctors" className="label">
                    <span className="label-text text-error">
                      {formik.errors.doctors}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </Card>
        <Card className="mt-8">
          <CardHeader className="justify-between">
            <h2
              className="text-base font-semibold leading-7 text-base-content"
              data-tip="Test Title"
            >
              Test Properties
            </h2>
            <Button
              isIconOnly
              variant="flat"
              radius="full"
              type="button"
              onClick={addNewRow}
              data-tip="Add Row"
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardBody className="flex flex-col">
            <Table removeWrapper>
              <TableHeader>
                <TableColumn key="investigation">Investigation</TableColumn>
                <TableColumn key="referenceValue">Reference Value</TableColumn>
                <TableColumn key="unit">Unit</TableColumn>
              </TableHeader>
              <TableBody>
                {formik.values.testProps.map((testProp, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Textarea
                        type="text"
                        aria-label="Investigation"
                        // className="input focus:outline-none focus:border-none rounded-none w-full"
                        name={`testProps[${index}].investigation`}
                        id="investigation"
                        placeholder="Hemoglobin"
                        onChange={formik.handleChange}
                        value={testProp.investigation}
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        // className="input focus:outline-none focus:border-none rounded-none w-full"
                        name={`testProps[${index}].referenceValue`}
                        aria-label="Reference Value"
                        id="referenceValue"
                        placeholder="13.0 - 17.0"
                        onChange={formik.handleChange}
                        value={testProp.referenceValue}
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-end text-sm font-medium flex items-center">
                      <Textarea
                        type="text"
                        aria-label="Unit"
                        // className="input focus:outline-none focus:border-none rounded-none w-full"
                        name={`testProps[${index}].unit`}
                        id="unit"
                        placeholder="g/dL"
                        onChange={formik.handleChange}
                        value={testProp.unit}
                      />
                      {formik.values.testProps.length > 1 && (
                        <Button
                          isIconOnly
                          variant="flat"
                          radius="full"
                          type="button"
                          onClick={() => removeRow(index)}
                          className="btn btn-sm btn-ghost btn-circle opacity-0 mr-1 group-hover:opacity-100"
                        >
                          <XIcon className="w-5 h-5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </form>
    </>
  );
};

export default EditAvailableTest;
