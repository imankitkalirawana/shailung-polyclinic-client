import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { PDFExport } from "@progress/kendo-react-pdf";
import { Link, useParams } from "react-router-dom";
import { DownloadIcon, SmartHomeIcon } from "../../icons/Icons";
import { Doctor, Report } from "../../../interface/interface";
import DynamicTable from "./DisplayReportTable";
import { getDoctorsWithIds } from "../../../functions/get";

const Download = () => {
  const { reportId }: any = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [reportRows, setReportRows] = useState<any[]>([]);
  const pdfExportComponent = useRef(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/report/${reportId}`
        );
        const res = await axios.get(
          `${API_BASE_URL}/api/report/report-row/by-reportid/${data._id}`
        );
        const doctorsData = await getDoctorsWithIds(data.doctors);

        setReport(data);
        setReportRows(res.data);
        setDoctors(doctorsData);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch report");
        console.error(error);
      }
    };
    fetchReport();
  }, [reportId]);

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
        { filenames },
        { responseType: "blob" }
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
              </Link>
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
            <PDFExport
              ref={pdfExportComponent}
              fileName={report?.name + "-" + report?.reportDate + "-Report"}
            >
              <div
                className="relative mx-auto h-full mb-8 object-cover flex flex-col justify-between"
                data-theme="light"
                style={{
                  width: "21cm",
                  height: "29.7cm",
                }}
              >
                <img src="/report.webp" loading="eager" />
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://report.shailungpolyclinic.com/report/${report?._id}/download`}
                  className="w-[85px] h-[85px] absolute bottom-[52px] right-[18px]"
                  alt=""
                />
                <div className="absolute flex flex-col justify-between pb-24 top-0 left-0 w-full h-full pt-36">
                  <main className="px-8 mt-4">
                    <div className="space-y-4 font-roboto flex flex-col gap-4">
                      <div className="flex text-xs justify-between">
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            <b>Name :</b>
                            <b>Address :</b>
                            <b>Ref. By :</b>
                            <b>Lab ID:</b>
                          </div>
                          <div className="flex flex-col">
                            <span>{report?.name || "-"}</span>
                            <span>{report?.address || "-"}</span>
                            <span>{report?.refby || "-"}</span>
                            <span>{report?.labId || "-"}</span>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            <b>Age/Sex :</b>
                            <b>Report Date :</b>
                            <b>Collection Date :</b>
                            <b>Report ID :</b>
                          </div>
                          <div className="flex flex-col">
                            <span className="capitalize">
                              {report?.age + " Yrs/" + report?.gender}
                            </span>
                            <span>{report?.reportDate || "-"}</span>
                            <span>{report?.collectiondate || "-"}</span>
                            <span>{report?._id}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {reportRows.map((row, index) => (
                      <div className="my-4" key={row._id}>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <h3 className="text-sm text-center font-semibold leading-none">
                              {report?.testname[index]}
                            </h3>
                            <p className="text-center text-xs">
                              {report?.description[index]}
                            </p>
                          </div>
                        </div>
                        <DynamicTable tableid={row._id} />
                        <div className="mt-3">
                          {report?.summary[index] && (
                            <div>
                              <h3 className="text-xs font-semibold">
                                Test Information:
                              </h3>
                              <p className="text-xs whitespace-pre-wrap">
                                {report?.summary[index]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="space-y-2">
                      <footer className="absolute bottom-24 left-[50%] translate-x-[-50%]">
                        <div className="flex justify-evenly gap-4 text-center">
                          {doctors?.slice(0, 2).map((doc) => (
                            <div key={doc._id}>
                              <span className="flex items-center justify-center">
                                <img
                                  src={`${API_BASE_URL}/api/upload/single/${doc.sign}`}
                                  className="w-16 aspect-[4/3] object-contain"
                                />
                              </span>
                              <p className="text-xs font-semibold">
                                {doc && doc.name}
                                <br />
                                {doc && doc.designation}
                                <br />
                                {doc && doc.regno}
                              </p>
                            </div>
                          ))}
                        </div>
                      </footer>
                    </div>
                  </main>
                </div>
              </div>
            </PDFExport>
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
