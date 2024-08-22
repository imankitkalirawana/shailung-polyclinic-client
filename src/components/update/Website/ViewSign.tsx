import { useFormik } from "formik";
import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";

type reportDetails = {
  docName: string;
  docDesignation: string;
  docReg: string;
  docSign: string;
};
const ViewSign = () => {
  const formik = useFormik({
    initialValues: {
      reportDetails: [] as reportDetails[],
    },
    onSubmit: async (values) => {
      try {
        await axios.put(`${API_BASE_URL}/api/doctors/report`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("Message sent successfully");
      } catch (error) {
        toast.error("Error Updating Details");
      } finally {
      }
    },
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/website/report`);
        formik.setValues({
          reportDetails: response.data,
        });
      } catch (error) {
        toast.error("Error Updating Details");
      }
    };
    fetchReport();
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        const updatedReport = [...formik.values.reportDetails];
        updatedReport[index] = {
          ...updatedReport[index],
          docSign: imageData,
        };
        formik.setValues({
          ...formik.values,
          reportDetails: updatedReport,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Card
        as={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
        className="p-4"
      >
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <h2 className="text-base font-semibold leading-7 text-base-content">
            Report Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-base-neutral">
            Update information displayed on the report.
          </p>
        </CardHeader>
        <CardBody className="grid grid-cols-2 gap-4 select-none">
          {formik.values.reportDetails.map((report, index) => (
            <div
              key={index}
              className="flex items-center col-span-full md:col-span-1 max-w-2xl p-4 bg-base-300 card md:flex-row"
            >
              <img
                src={report.docSign}
                className="object-contain w-auto aspect-square h-48 card mix-blend-darken"
              />
              <div className="p-8 space-y-2">
                <Input
                  name="doc-name"
                  id="doc-name"
                  type="text"
                  value={report.docName}
                  label="Doctor Name"
                  onChange={(e) => {
                    const updatedReport = [...formik.values.reportDetails];
                    updatedReport[index] = {
                      ...updatedReport[index],
                      docName: e.target.value,
                    };
                    formik.setValues({
                      ...formik.values,
                      reportDetails: updatedReport,
                    });
                  }}
                />

                <Input
                  name="docDesignation-1"
                  id="docDesignation-1"
                  type="text"
                  label="Designation"
                  value={report.docDesignation}
                  onChange={(e) => {
                    const updatedReport = [...formik.values.reportDetails];
                    updatedReport[index] = {
                      ...updatedReport[index],
                      docDesignation: e.target.value,
                    };
                    formik.setValues({
                      ...formik.values,
                      reportDetails: updatedReport,
                    });
                  }}
                />
                <Input
                  name="docReg-1"
                  id="docReg-1"
                  type="text"
                  label="Registration Number"
                  value={report.docReg}
                  onChange={(e) => {
                    const updatedReport = [...formik.values.reportDetails];
                    updatedReport[index] = {
                      ...updatedReport[index],
                      docReg: e.target.value,
                    };
                    formik.setValues({
                      ...formik.values,
                      reportDetails: updatedReport,
                    });
                  }}
                />

                <Button fullWidth as={"label"} htmlFor={`doc-image-${index}`}>
                  <span>Change Sign</span>
                </Button>
                <input
                  type="file"
                  name="doc-image"
                  accept="image/png"
                  id={`doc-image-${index}`}
                  className="hidden"
                  onChange={(e) => handleFileChange(e, index)}
                />
              </div>
            </div>
          ))}
        </CardBody>
        <CardFooter className="flex items-center gap-2 justify-end mt-12">
          <Button as={"a"} href="/dashboard" variant="flat">
            Cancel
          </Button>
          <Button
            variant="flat"
            color="primary"
            isLoading={formik.isSubmitting}
            isDisabled={formik.isSubmitting}
            type="submit"
          >
            Update
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ViewSign;
