import { useEffect, useState } from "react";
import { PlusIcon, XIcon } from "../../icons/Icons";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { isLoggedIn } from "../../../utils/auth";
import { useFormik } from "formik";
import { UploadMultipleFiles } from "../../../utils/FileHandling";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Test } from "../../../interface/interface";

const Complete = () => {
  const { loggedIn } = isLoggedIn();
  const { id }: any = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState<Test | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUplaoded, setIsUploaded] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

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
          .then(({ data }) => {
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
                    title: prop.investigation,
                    reference: prop.referenceValue,
                    unit: prop.unit,
                    value: "",
                    isDisabled: true,
                  })),
                }));
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
      addedby: "",
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
      setProcessing(true);
      try {
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
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Report uploaded successfully");
        navigate("/dashboard/tests");
      } catch (error) {
        toast.error("Failed to upload report");
        console.error(error);
      }
      setProcessing(false);
    },
  });

  const uploadReport = async (values: any) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/report`, values, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
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
      <div className="container mx-auto p-4">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h2 className="my-6 text-2xl font-semibold">Upload Report</h2>
          </div>
          <div className="divider"></div>
          <div className="my-4">
            <h2 className="text-xl font-semibold leading-7 text-base-content">
              Patient Information
            </h2>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-6">
              <div className="col-span-full md:col-span-3">
                <label className="label" htmlFor="name">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="input input-bordered w-full"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  disabled={test?.testDetail.userData.name !== ""}
                />
              </div>
              <div className="col-span-full md:col-span-3">
                <label className="label" htmlFor="fatherName">
                  <span className="label-text">Father/Husband Name</span>
                </label>
                <input
                  id="fatherName"
                  name="fatherName"
                  type="text"
                  className="input input-bordered w-full"
                  required
                  onChange={formik.handleChange}
                />
              </div>
              <div className="col-span-full md:col-span-2">
                <label className="label" htmlFor="age">
                  <span className="label-text">Age</span>
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  className="input input-bordered w-full"
                  max={100}
                  required
                  onChange={formik.handleChange}
                  value={formik.values.age}
                />
              </div>
              {/* gender */}
              <div className="col-span-full md:col-span-2">
                <label className="label" htmlFor="gender">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  name="gender"
                  id="gender"
                  className="select select-bordered w-full"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.gender}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Phone */}
              <div className="col-span-full md:col-span-3">
                <label className="label" htmlFor="phone">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="input input-bordered w-full"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  disabled={test?.testDetail.userData.phone !== ""}
                />
              </div>
              {/* Email */}
              <div className="col-span-full md:col-span-3">
                <label className="label" htmlFor="email">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input input-bordered w-full"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  disabled={test?.testDetail.userData.email !== ""}
                />
              </div>
              {/* Address */}
              <div className="col-span-full">
                <label className="label" htmlFor="address">
                  <span className="label-text">Address</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="input input-bordered w-full"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.address}
                />
              </div>
            </div>
            <div className="divider"></div>
            <div className="my-4">
              <h2 className="text-xl font-semibold leading-7 text-base-content">
                Report Information
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-6">
              <div className="col-span-full md:col-span-2">
                <label className="label" htmlFor="testName">
                  <span className="label-text">Test Name</span>
                </label>
                <input
                  type="text"
                  name="testname"
                  id="testname"
                  required
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.testname}
                  disabled={test?.testDetail.testData.name !== ""}
                />
              </div>

              <div className="col-span-full md:col-span-2">
                <label className="label" htmlFor="reportDate">
                  <span className="label-text">Report Date</span>
                </label>
                <div className="relative w-full mb-4">
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    name="reportDate"
                    id="reportDate"
                    required
                    onChange={formik.handleChange}
                    value={formik.values.reportDate}
                  />
                </div>
              </div>
              <div className="col-span-full md:col-span-2">
                <label className="label" htmlFor="status">
                  <span className="label-text">Report Status</span>
                </label>
                <select
                  name="status"
                  id="status"
                  className="select select-bordered w-full"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.status}
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="neutral">Neutral</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
              <div className="col-span-full md:col-span-2">
                <label className="label" htmlFor="reportType">
                  <span className="label-text">Report Type</span>
                </label>
                <select
                  name="reportType"
                  id="reportType"
                  className="select select-bordered w-full"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.reportType}
                >
                  <option value="" disabled>
                    Select Report Type
                  </option>
                  <option value="both">Both File & Text</option>
                  <option value="file">Only File</option>
                  <option value="text">Only Text</option>
                </select>
              </div>

              {formik.values.reportType !== "text" && (
                <div className="col-span-full md:col-span-2">
                  <label className="label" htmlFor="reportFile">
                    <span className="label-text">Upload Report File</span>
                  </label>
                  <input
                    type="file"
                    name="reportFile"
                    id="reportFile"
                    multiple
                    className="file-input file-input-bordered w-full"
                    required
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </div>
              )}

              <div className="divider col-span-full"></div>
              {formik.values.reportType !== "file" && (
                <div className="col-span-full justify-self-start">
                  <label className="label" htmlFor="reportRows">
                    <span className="label-text">Investigation Data</span>
                  </label>
                </div>
              )}

              {formik.values.reportType !== "file" && (
                <div className="flex flex-col md:col-span-full">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="border rounded-lg overflow-hidden border-base-content/30">
                        <table className="min-w-full divide-y divide-base-content/30">
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium uppercase"
                              >
                                Investigation
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium uppercase"
                              >
                                Value
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium uppercase"
                              >
                                Reference
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium uppercase"
                              >
                                Unit
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-base-content/30">
                            {formik.values.reportRows.map((_row, index) => (
                              <tr
                                key={index}
                                className="divide-x divide-base-content/30 group"
                              >
                                <td className="whitespace-nowrap text-sm font-medium">
                                  <input
                                    type="text"
                                    className="input focus:outline-none rounded-none w-full"
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        `reportRows[${index}].title`,
                                        e.target.value
                                      );
                                    }}
                                    value={
                                      formik.values.reportRows[index].title
                                    }
                                    disabled={
                                      formik.values.reportRows[index].isDisabled
                                    }
                                  />
                                </td>
                                <td className="whitespace-nowrap text-sm">
                                  <input
                                    type="text"
                                    className="input focus:outline-none rounded-none w-full"
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        `reportRows[${index}].value`,
                                        e.target.value
                                      );
                                    }}
                                    value={
                                      formik.values.reportRows[index].value
                                    }
                                  />
                                </td>
                                <td className="whitespace-nowrap text-sm">
                                  <textarea
                                    className="input focus:outline-none rounded-none w-full "
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        `reportRows[${index}].reference`,
                                        e.target.value
                                      );
                                    }}
                                    value={
                                      formik.values.reportRows[index].reference
                                    }
                                    disabled={
                                      formik.values.reportRows[index].isDisabled
                                    }
                                  />
                                </td>
                                <td className="whitespace-nowrap text-end text-sm font-medium flex items-center">
                                  <input
                                    type="text"
                                    className="input focus:outline-none rounded-none w-full"
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        `reportRows[${index}].unit`,
                                        e.target.value
                                      );
                                    }}
                                    value={formik.values.reportRows[index].unit}
                                    disabled={
                                      formik.values.reportRows[index].isDisabled
                                    }
                                  />
                                  {formik.values.reportRows.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeRow(index)}
                                      className="btn btn-sm btn-ghost btn-circle opacity-0 mr-1 group-hover:opacity-100"
                                    >
                                      <XIcon className="w-5 h-5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={addNewRow}
                          className="btn btn-sm tooltip-left hover:btn-primary btn-circle tooltip flex items-center justify-center tooltip-primary"
                          data-tip="Add Row"
                        >
                          <PlusIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="col-span-full md:justify-self-end">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isUplaoded || processing}
                >
                  {processing ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : (
                    "Upload Report"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Complete;
