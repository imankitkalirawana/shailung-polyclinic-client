import { useEffect, useState } from "react";
import { XIcon } from "../../icons/Icons";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { isLoggedIn } from "../../../utils/auth";
import { useFormik } from "formik";
import { UploadMultipleFiles } from "../../../utils/FileHandling";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Test } from "../../../interface/interface";
import { parseDate } from "@internationalized/date";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DatePicker,
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
  Tooltip,
} from "@nextui-org/react";
import { IconPlus } from "@tabler/icons-react";

const CompleteHold = () => {
  const { loggedIn } = isLoggedIn();
  const { id }: any = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState<Test | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUplaoded, setIsUploaded] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [isDrafting, setIsDrafting] = useState<boolean>(false);

  useEffect(() => {
    if (test?.isDone) {
      window.location.href = "/dashboard/tests";
      toast.error("Test already completed");
    }
  }, [test]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    formik.setValues((previousData) => ({
      ...previousData,
      addedby: userData.user.email,
    }));

    const fetchTests = async () => {
      try {
        await axios
          .get(`${API_BASE_URL}/api/test/test/${id}`, {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          })
          .then(async ({ data }) => {
            setTest(data);
            formik.setValues((previousData) => ({
              ...previousData,
              name: data.testDetail.userData.name,
              phone: data.testDetail.userData.phone,
              email: data.testDetail.userData.email,
              age: data.testDetail.userData.age,
              userid: data.testDetail.userData._id,
              testname: data.testDetail.testData.name,
              testid: data._id,
              doctors: data.doctors,
              summary: data.testDetail.testData.summary,
              description: data.testDetail.testData.description,
            }));

            axios
              .get(
                `${API_BASE_URL}/api/available-test/${data.testDetail.testData._id}`,
                {
                  headers: {
                    Authorization: `${localStorage.getItem("token")}`,
                  },
                }
              )
              .then(({ data }) => {
                formik.setValues((previousData) => ({
                  ...previousData,
                  reportRows: data.testProps.map((prop: any) => ({
                    ...prop,
                    title: prop.investigation,
                    reference: prop.referenceValue,
                    unit: prop.unit,
                    isDisabled: true,
                  })),
                }));
              })
              .then(() => {
                axios
                  .get(`${API_BASE_URL}/api/report/${data.reportId}`)
                  .then(({ data }) => {
                    formik.setValues((previousData) => ({
                      ...previousData,
                      _id: data._id,
                      fatherName: data.fatherName,
                      address: data.address,
                      gender: data.gender,
                      labId: data.labId,
                      reportDate: data.reportDate,
                      status: data.status,
                      reportType: data.reportType,
                      isDraft: data.isDraft,
                      //   map reportRows with data.reportRows
                      reportRows: data.reportRows.map((row: any) => ({
                        title: row.title,
                        value: row.value,
                        unit: row.unit,
                        reference: row.reference,
                      })),
                    }));
                  });
              });
          });
      } catch (error) {
        toast.error("Failed to fetch tests");
        console.error(error);
      }
    };
    fetchTests();
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
      fatherName: "",
      age: 0,
      gender: "",
      phone: "",
      email: "",
      address: "",
      testname: "",
      reportType: "both",
      reportDate: new Date().toISOString().split("T")[0],
      testid: "",
      userid: "",
      labId: "",
      addedby: "",
      isDraft: false,
      status: "neutral",
      reportRows: Array.from({ length: 1 }, () => ({
        title: "",
        value: "",
        unit: "",
        reference: "",
        isDisabled: false,
      })),
      reportFile: [""],
      doctors: [],
    },
    onSubmit: async (values) => {
      try {
        if (values.isDraft) {
          setIsDrafting(true);
          await axios.put(
            `${API_BASE_URL}/api/report/redraft/${values._id}`,
            values,
            {
              headers: {
                Authorization: `${localStorage.getItem("token")}`,
              },
            }
          );
          toast.success("Report saved as draft");
          setIsDrafting(false);
        } else {
          setProcessing(true);
          if (files) {
            const filenames = Array.from(files).map(
              (file) =>
                `report-${values.testid}-${Date.now()}.${file.name
                  .split(".")
                  .pop()}`
            );
            values.reportFile = filenames;
            await UploadMultipleFiles(files, filenames).then(async (res) => {
              if (res) {
                setIsUploaded(true);
                await uploadReport(values);
              }
            });
          } else {
            await uploadReport(values).then((res) => {
              if (res) {
                setIsUploaded(true);
              }
            });
          }
          setProcessing(false);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Report uploaded successfully");
        navigate("/dashboard/tests");
      } catch (error) {
        toast.error("Failed to upload report");
        console.error(error);
      }
    },
  });

  const uploadReport = async (values: any) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/report/draft/${values._id}`,
        values,
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

  const addNewRow = () => {
    formik.setValues((prevValues) => ({
      ...prevValues,
      reportRows: [
        ...prevValues.reportRows,
        {
          title: "",
          value: "",
          unit: "",
          reference: "",
          isDisabled: false,
        },
      ],
    }));
  };

  const removeRow = (index: number) => {
    formik.setValues((prevValues) => ({
      ...prevValues,
      reportRows: prevValues.reportRows.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <div className="mx-auto">
        <form className="w-full card shadow-xs">
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
                  isDisabled={test?.testDetail.userData.name !== ""}
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
                  isDisabled={test?.testDetail.userData.phone !== ""}
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
                  isDisabled={test?.testDetail.userData.email !== ""}
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
                  name="testname"
                  id="testname"
                  label="Test Name"
                  isRequired
                  onChange={formik.handleChange}
                  value={formik.values.testname}
                  isDisabled={test?.testDetail.testData.name !== ""}
                />
              </div>
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
                {/* <input
                  type="date"
                  className="input input-bordered w-full"
                  name="reportDate"
                  id="reportDate"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.reportDate}
                /> */}
                <DatePicker
                  label="Report Date"
                  onChange={(date) => {
                    formik.setFieldValue(
                      "reportDate",
                      date.toString().split("T")[0]
                    );
                  }}
                  value={parseDate(formik.values.reportDate)}
                  name="dob"
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
                  <Tooltip color="primary" content={"Add new row"}>
                    <Button
                      isIconOnly
                      variant="flat"
                      radius="full"
                      type="button"
                      onClick={addNewRow}
                    >
                      <IconPlus size={16} />
                    </Button>
                  </Tooltip>
                </CardHeader>
                <CardBody className="flex flex-col md:col-span-full">
                  <Table aria-label="Report Data" removeWrapper>
                    <TableHeader>
                      <TableColumn>Investigation</TableColumn>
                      <TableColumn>Value</TableColumn>
                      <TableColumn>Reference</TableColumn>
                      <TableColumn>Unit</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {formik.values.reportRows.map((_row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Textarea
                              onChange={(e) => {
                                formik.setFieldValue(
                                  `reportRows[${index}].title`,
                                  e.target.value
                                );
                              }}
                              value={formik.values.reportRows[index].title}
                              isDisabled={
                                formik.values.reportRows[index].isDisabled
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Textarea
                              onChange={(e) => {
                                formik.setFieldValue(
                                  `reportRows[${index}].value`,
                                  e.target.value
                                );
                              }}
                              value={formik.values.reportRows[index].value}
                            />
                          </TableCell>
                          <TableCell>
                            <Textarea
                              onChange={(e) => {
                                formik.setFieldValue(
                                  `reportRows[${index}].reference`,
                                  e.target.value
                                );
                              }}
                              value={formik.values.reportRows[index].reference}
                              isDisabled={
                                formik.values.reportRows[index].isDisabled
                              }
                            />
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-end text-sm font-medium flex items-center">
                            <Textarea
                              onChange={(e) => {
                                formik.setFieldValue(
                                  `reportRows[${index}].unit`,
                                  e.target.value
                                );
                              }}
                              value={formik.values.reportRows[index].unit}
                              isDisabled={
                                formik.values.reportRows[index].isDisabled
                              }
                            />
                            {formik.values.reportRows.length > 1 && (
                              <Button
                                type="button"
                                isIconOnly
                                variant="light"
                                radius="full"
                                onClick={() => removeRow(index)}
                                className="opacity-0 mr-1 group-hover:opacity-100"
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
              </>
            )}
            <CardFooter className="col-span-full flex gap-4 justify-end">
              <Button
                type="button"
                onClick={() => {
                  formik.setValues((prevValues) => ({
                    ...prevValues,
                    isDraft: true,
                  }));
                  formik.handleSubmit();
                }}
                variant="bordered"
                isLoading={isDrafting}
                isDisabled={isDrafting}
              >
                Save Draft
              </Button>

              <Button
                type="submit"
                variant="flat"
                color="primary"
                isDisabled={isUplaoded || processing}
                isLoading={isUplaoded || processing}
                onClick={() => {
                  formik.setValues((prevValues) => ({
                    ...prevValues,
                    isDraft: false,
                  }));
                  formik.handleSubmit();
                }}
              >
                Upload Report
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
};

export default CompleteHold;