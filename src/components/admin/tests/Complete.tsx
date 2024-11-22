import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { isLoggedIn } from "../../../utils/auth";
import { useFormik } from "formik";
import { UploadMultipleFiles } from "../../../utils/FileHandling";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AvailableTest, Doctor, Test } from "../../../interface/interface";
import { parseDate } from "@internationalized/date";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Chip,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import FormTable from "./FormTable";
import { getAllDoctors } from "../../../functions/get";

const Complete = () => {
  const { loggedIn, user } = isLoggedIn();
  const { id }: any = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState<Test | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "doctor") {
      toast.error("Unauthorized access");
      navigate("/dashboard/tests");
    }
  }, [user]);

  useEffect(() => {
    if (test?.isDone) {
      navigate("/dashboard/tests?status=completed");
      toast.error("Test already completed");
    }
  }, [test]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    formik.setValues((previousData) => ({
      ...previousData,
      addedby: userData.user.email,
    }));

    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/test/test/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setTest(data);

        // @ts-ignore
        formik.setValues((previousData) => ({
          ...previousData,
          _id: data._id,
          name: data.testDetail.userData.name,
          phone: data.testDetail.userData.phone,
          email: data.testDetail.userData.email,
          age: data.testDetail.userData.age,
          userid: data.testDetail.userData._id,
          testid: data._id,
          testname: data.testDetail.testData.map(
            (test: AvailableTest) => test.name
          ),
          testids: data.testDetail.testData.map(
            (test: AvailableTest) => test._id
          ),
        }));

        const doctors = await getAllDoctors();
        setDoctors(doctors);
      } catch (error) {
        toast.error("Failed to fetch tests");
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      window.location.href = "/auth/login";
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      _id: "",
      name: "",
      age: 0,
      gender: "",
      phone: "",
      email: "",
      address: "",
      testid: "",
      testids: [],
      testname: [],
      reportType: "text",
      reportDate: new Date().toISOString().split("T")[0],
      collectiondate: new Date().toISOString().split("T")[0],
      userid: "",
      labId: "",
      addedby: "",
      isDraft: false,
      status: "neutral",
      reportFile: [""],
      doctors: [] as string[],
      refby: "",
    },
    onSubmit: async (values) => {
      if (values.isDraft) {
        setIsDrafting(true);
      }
      try {
        if (files) {
          const filenames = Array.from(files).map(
            (file) =>
              `report-${values._id}-${Date.now()}.${file.name.split(".").pop()}`
          );
          values.reportFile = filenames;
          await UploadMultipleFiles(files, filenames).then(async (res) => {
            if (res) {
              await uploadReport(values, formData).then((res) => {
                if (res) {
                  toast.success("Report uploaded successfully");
                  navigate(
                    `/dashboard/tests?status=${
                      values.isDraft ? "hold" : "completed"
                    }`
                  );
                }
              });
            }
          });
        } else {
          await uploadReport(values, formData).then((res) => {
            if (res) {
              toast.success("Report uploaded successfully");
              // navigate(
              //   `/dashboard/tests?status=${
              //     values.isDraft ? "hold" : "completed"
              //   }`
              // );
            }
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload report");
      }
      if (values.isDraft) {
        setIsDrafting(false);
      }
    },
  });

  const uploadReport = async (values: any, formData: any) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/report`,
        { values, formData },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

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

  return (
    <>
      <div className="mx-auto">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h2 className="my-6 text-2xl font-semibold">Upload Report</h2>
          </div>
          <Card className="p-4">
            <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
              <p className="text-large">Patient Information</p>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-6">
              <div className="col-span-full md:col-span-3">
                <Input
                  id="name"
                  name="name"
                  label="Patient Name"
                  type="text"
                  isRequired
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  // isDisabled={test?.testDetail.userData.name !== ""}
                />
              </div>
              <div className="col-span-full md:col-span-3">
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  label="Phone"
                  isRequired
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  // isDisabled={test?.testDetail.userData.phone !== ""}
                />
              </div>
              <div className="col-span-full md:col-span-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  isRequired
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  // isDisabled={test?.testDetail.userData.email !== ""}
                />
              </div>
              <div className="col-span-full md:col-span-2">
                <Input
                  id="age"
                  name="age"
                  label="Age"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">Years</span>
                    </div>
                  }
                  type="number"
                  min={0}
                  max={100}
                  required
                  onChange={formik.handleChange}
                  // @ts-ignore
                  value={formik.values.age}
                />
              </div>
              <div className="col-span-full md:col-span-2">
                <Select
                  name="gender"
                  id="gender"
                  isRequired
                  onChange={formik.handleChange}
                  value={formik.values.gender}
                  label="Gender"
                  selectedKeys={[formik.values.gender]}
                >
                  <SelectItem key="male">Male</SelectItem>
                  <SelectItem key="female">Female</SelectItem>
                  <SelectItem key="other">Other</SelectItem>
                </Select>
              </div>
              <div className="col-span-full">
                <Textarea
                  id="address"
                  name="address"
                  type="text"
                  label="Address"
                  onChange={formik.handleChange}
                  value={formik.values.address}
                />
              </div>
            </CardBody>
          </Card>
          <Card className="mt-8 p-4">
            <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
              <p className="text-large">Report Information</p>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-6">
              <div className="col-span-full md:col-span-2">
                <Input
                  type="text"
                  name="labId"
                  id="labId"
                  label="Lab ID"
                  placeholder="Enter a unique Lab ID"
                  isRequired
                  onChange={formik.handleChange}
                  value={formik.values.labId}
                />
              </div>
              <div className="col-span-full md:col-span-2">
                <Input
                  type="text"
                  name="refby"
                  id="refby"
                  label="Ref. By"
                  onChange={formik.handleChange}
                  value={formik.values.refby}
                />
              </div>

              <div className="col-span-full md:col-span-2">
                <DatePicker
                  label="Report Date"
                  onChange={(date) => {
                    formik.setFieldValue(
                      "reportDate",
                      date.toString().split("T")[0]
                    );
                  }}
                  value={parseDate(formik.values.reportDate)}
                  name="reportDate"
                  showMonthAndYearPickers
                />
              </div>
              <div className="col-span-full md:col-span-2">
                <DatePicker
                  label="Collection Date"
                  onChange={(date) => {
                    formik.setFieldValue(
                      "collectiondate",
                      date.toString().split("T")[0]
                    );
                  }}
                  value={parseDate(formik.values.collectiondate)}
                  name="collectiondate"
                  showMonthAndYearPickers
                />
              </div>
              <div className="col-span-full md:col-span-2">
                <Select
                  name="status"
                  id="status"
                  isRequired
                  onChange={formik.handleChange}
                  value={formik.values.status}
                  label="Report Status"
                  defaultSelectedKeys={["neutral"]}
                >
                  <SelectItem key="neutral">Neutral</SelectItem>
                  <SelectItem key="positive">Positive</SelectItem>
                  <SelectItem key="negative">Negative</SelectItem>
                </Select>
              </div>
              <div className="col-span-full md:col-span-2">
                <Select
                  name="reportType"
                  id="reportType"
                  isRequired
                  onChange={formik.handleChange}
                  value={formik.values.reportType}
                  label="Report Type"
                  defaultSelectedKeys={["text"]}
                >
                  <SelectItem key="text">Only Text</SelectItem>
                  <SelectItem key="file">Only File</SelectItem>
                  <SelectItem key="both">Both Text & File</SelectItem>
                </Select>
              </div>
              <div className="col-span-2 col-start-1">
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
              <div className="col-span-full gap-2 flex flex-col md:col-span-2">
                <label className="label">
                  <span className="label-text">Test Names</span>
                </label>
                <div className="flex gap-1">
                  {formik.values.testname.map((test, index) => (
                    <Chip key={index}>{test}</Chip>
                  ))}
                </div>
              </div>

              {formik.values.reportType !== "text" && (
                <label
                  htmlFor="reportFile"
                  className="w-full col-span-full flex items-center justify-center"
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
                            <span className="font-semibold">
                              Click to upload
                            </span>
                            &nbsp; or drag and drop
                          </p>
                          <p className="text-xs">PDF, Doc or JPG/JPEG/PNG</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="w-full px-1"
                      aria-description="content file holder"
                    >
                      <input
                        type="file"
                        name="reportFile"
                        id="reportFile"
                        multiple
                        className="file-input file-input-bordered w-full"
                        required
                        hidden
                        onChange={(e) => setFiles(e.target.files)}
                      />
                    </div>
                  </div>
                </label>
              )}
            </CardBody>
          </Card>
          <Card className="mt-8 p-4">
            {formik.values.reportType !== "file" && (
              <>
                <CardHeader className="flex justify-between items-start px-4 pb-0 pt-4">
                  <p className="text-large">Investigation Data</p>
                </CardHeader>
                <CardBody className="flex flex-col md:col-span-full">
                  {formik.values.testids.map((tableid, index) => (
                    <div
                      className="border border-default border-collapse rounded-lg p-4 mb-4"
                      key={tableid}
                    >
                      <div className="flex justify-center">
                        <Chip color="primary" variant="flat">
                          {formik.values.testname[index]}
                        </Chip>
                      </div>
                      <FormTable
                        key={tableid}
                        tableid={tableid}
                        onDataChange={handleDataChange}
                        isHidden={false}
                      />
                    </div>
                  ))}
                </CardBody>
                <CardFooter className="justify-center gap-4">
                  <Button
                    variant="bordered"
                    onClick={() => {
                      formik.setFieldValue("isDraft", true);
                      formik.handleSubmit();
                    }}
                    isLoading={isDrafting}
                    isDisabled={isDrafting}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      formik.setFieldValue("isDraft", false);
                      formik.handleSubmit();
                    }}
                    isLoading={formik.isSubmitting && !isDrafting}
                    isDisabled={formik.isSubmitting && !isDrafting}
                  >
                    Upload Report
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Complete;
