import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { PDFExport } from "@progress/kendo-react-pdf";
import { Link, useParams, useLocation } from "react-router-dom";
import { getUserWithId } from "../../../functions/get";
import { DownloadIcon, SmartHomeIcon } from "../../icons/Icons";
import { isLoggedIn } from "../../../utils/auth";

interface Report {
  _id: string;
  name: string;
  fatherName: string;
  age: number;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  testname: string;
  reportType: string;
  reportDate: string;
  testType: string;
  doctor: string;
  reportRows: {
    title: string;
    value: string;
    unit: string;
    reference: string;
  }[];
  reportFile: string[];
}

interface reportDetails {
  docName: string;
  docDesignation: string;
  docReg: string;
  docSign: string;
}

const Download = () => {
  const { loggedIn } = isLoggedIn();
  const location = useLocation();
  const { reportId }: any = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const pdfExportComponent = useRef(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [reportDetails, setReportDetails] = useState<reportDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const currentLocation = location.pathname;

  useEffect(() => {
    if (!loggedIn) {
      toast.error("You need to login to view this page");
      window.location.href = `/auth/login?redirect=${currentLocation}`;
    }
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/report/${reportId}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setReport(data);
        await getUserWithId(data.doctor).then((res) => {
          setDoctor(res.data);
        });
        const response = await axios.get(`${API_BASE_URL}/api/website/report`);
        setReportDetails(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch report");
        console.error(error);
      }
    };
    fetchReport();
  }, []);
  const handleExportWithComponent = () => {
    if (pdfExportComponent.current) {
      (pdfExportComponent.current as any).save();
      if (report?.reportFile?.length && report.reportFile[0] !== "") {
        getFiles(report.reportFile);
      }

      toast.success("Downloading Report...");
    } else {
      toast.error("Failed to download report");
    }
  };

  const getFiles = async (filenames: string[]) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/upload/download`,
        {
          filenames,
        },
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "files.zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading files:", error);
    }
  };
  return (
    <>
      <div className="max-w-6xl mx-auto my-24">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link
                to={"/dashboard"}
                className="btn btn-sm btn-circle btn-ghost -mr-2"
              >
                <SmartHomeIcon className="w-4 h-4" />
              </Link>{" "}
            </li>
            <li>
              <Link to="/appointment/history">Reports</Link>
            </li>
            <li>{reportId}</li>
          </ul>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <span className="loading loading-infinity loading-lg"></span>
          </div>
        ) : (
          <>
            <div className="mx-auto mt-12 overflow-scroll">
              <PDFExport
                ref={pdfExportComponent}
                fileName={report?.name + "-" + report?.reportDate + "-Report"}
              >
                <div
                  className="relative mx-auto flex flex-col justify-between"
                  style={{ width: "21cm", height: "29.7cm" }}
                  data-theme="light"
                >
                  <div className="w-full h-full">
                    <div className="flex flex-col justify-start h-full">
                      <header className="flex flex-col px-6 py-4 text-white bg-[#2c4c7f] justify-between items-start border-b-8 border-b-[#f08555]">
                        <span className="tracking-tighter text-sm">
                          Gov. Reg. No. 66087/066/067
                        </span>
                        <div className="flex justify-between items-start w-full">
                          <img
                            src="/logo.png"
                            alt=""
                            className="mix-blend-lighten w-24 h-24"
                          />
                          <div className="flex flex-col">
                            <div className="uppercase">
                              <h1 className="text-4xl font-bold tracking-tighter">
                                Shailung Polyclinic
                              </h1>
                              <h3 className="text-2xl">
                                AND DIAGNOSTIC CENTRE PVT. LTD.
                              </h3>
                            </div>
                            <div className="divider my-0.5 border-[#f08555] border-b-4"></div>
                            <div className="flex flex-col text-lg items-center">
                              <span>
                                Itahari-6, Sunsari, Phone : +977-25-585541
                              </span>
                              <span>Email: shailungpdc@gmail.com</span>
                            </div>
                          </div>
                          <div>
                            <img
                              src="/microscope.png"
                              className="w-24 h-24"
                              alt=""
                            />
                          </div>
                        </div>
                      </header>
                      <main className="px-8 mt-4">
                        <div className="space-y-4 font-serif flex flex-col gap-4">
                          <div className="flex justify-between">
                            <div className="flex gap-4">
                              <div className="flex flex-col">
                                <span>Name :</span>
                                <span>Address :</span>
                                <span>Doctor :</span>
                              </div>
                              <div className="flex flex-col">
                                <span>{report?.name}</span>
                                <span>{report?.address}</span>
                                <span>{doctor?.name}</span>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex flex-col">
                                <span>Age/Sex :</span>
                                <span>Report Date :</span>
                                <span>Report ID :</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="capitalize">
                                  {report?.age + " Yrs/" + report?.gender}
                                </span>
                                <span>{report?.reportDate}</span>
                                <span>{report?._id}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <h3 className="text-lg text-center font-semibold leading-none">
                                {report?.testname}
                              </h3>
                            </div>
                            <div className="flex flex-col">
                              <div className="-m-1.5 overflow-x-auto">
                                <div className="p-1.5 min-w-full inline-block align-middle">
                                  <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-black">
                                      <thead>
                                        <tr className=" bg-slate-500">
                                          <th
                                            scope="col"
                                            className="px-6 py-1 text-start text-xs font-bold uppercase"
                                          >
                                            Investigation
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-6 py-1 text-start text-xs font-bold uppercase"
                                          >
                                            Result
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-6 py-1 text-start text-xs font-bold uppercase"
                                          >
                                            Ref. Value
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-6 py-1 text-end text-xs font-bold uppercase"
                                          >
                                            Unit
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-black">
                                        {report?.reportRows
                                          .filter(
                                            (row) =>
                                              row.value !== null &&
                                              row.value !== undefined &&
                                              row.value !== ""
                                          )
                                          .map((row, index) => (
                                            <tr key={index}>
                                              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                                                {row.title}
                                              </td>
                                              <td className="px-6 py-2 whitespace-nowrap text-sm">
                                                {row.value || "-"}
                                              </td>
                                              <td className="px-6 py-2 whitespace-nowrap text-sm">
                                                {row.reference}
                                              </td>
                                              <td className="px-6 py-2 whitespace-nowrap text-end text-sm font-medium">
                                                {row.unit}
                                              </td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <h3 className="text-sm font-semibold leading-none">
                                Comments
                              </h3>
                              <ul className="l list-disc">
                                <li className="text-xs font-normal">
                                  If Clinically Suspected. Please Repeat Assay
                                  After Weeks.
                                </li>
                                <li className="text-xs font-normal">
                                  Done on Automated Chemiluminescence ANALYER
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xs font-semibold">
                                * = Value Rechecked
                              </h3>
                              <div className="flex justify-evenly text-center">
                                {reportDetails?.map((report, index) => (
                                  <div key={index}>
                                    <span className="flex items-center justify-center">
                                      <img
                                        src={report.docSign}
                                        className="w-16 aspect-[4/3] object-contain"
                                      />
                                    </span>
                                    <p className="text-xs font-semibold">
                                      {report.docName}
                                      <br />
                                      {report.docDesignation} <br />
                                      {report.docReg}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </main>
                      <footer className="bg-[#2c4c7f] absolute bottom-0 w-full justify-self-end text-white text-center py-2 border-t-8 border-t-[#f08555]">
                        <h2>
                          Keep the reports carefully and bring them during your
                          next visit.
                        </h2>
                      </footer>
                    </div>
                  </div>
                </div>
              </PDFExport>
            </div>
            <div className="flex flex-col justify-center items-center mt-8">
              {report?.reportFile &&
                report?.reportFile[0] !== "" &&
                report.reportFile.length > 0 && (
                  <div className="text-xs mb-4">
                    There{" "}
                    {report.reportFile.length === 1
                      ? "is 1 additional file"
                      : `are ${report.reportFile.length} files`}{" "}
                    available with your report.
                  </div>
                )}
              <div></div>
              <button
                className="btn btn-primary"
                onClick={handleExportWithComponent}
              >
                <DownloadIcon className="w-4 h-4" /> Download
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Download;
