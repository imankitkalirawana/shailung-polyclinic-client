import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../../../utils/config";
import { isLoggedIn } from "../../../utils/auth";
import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import FormTable from "./FormTable";

const EditAvailableTest = () => {
  const { user } = isLoggedIn();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "doctor") {
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
    },

    onSubmit: async (values) => {
      try {
        await axios.put(
          `${API_BASE_URL}/api/available-test/${id}`,
          { values, formData },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Updated Successfully");
        // navigate("/dashboard/tests/available-tests");
      } catch (error: any) {
        console.log(error.message);
        toast.error(error.message);
      }
    },
  });

  useEffect(() => {
    if (location.hash === "#formtable") {
      const element = document.getElementById("formtable");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const [formData, setFormData] = useState<{ [key: string]: any }[]>([]);

  const handleDataChange = (values: { [key: string]: any }, formid: string) => {
    setFormData((prevData) => {
      const updatedData = [...prevData];
      const dataIndex = updatedData.findIndex((data) => data.formid === formid);

      if (dataIndex !== -1) {
        updatedData[dataIndex] = { ...values, formid };
      } else {
        updatedData.push({ ...values, formid });
      }

      return updatedData;
    });
  };

  console.log(formData);
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
          </div>
        </Card>
      </form>

      <Card className="mt-8 p-4" id="formtable">
        <FormTable
          tableid={formik.values._id}
          onDataChange={handleDataChange}
        />
        {/* )} */}
      </Card>
    </>
  );
};

export default EditAvailableTest;
