import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { PDFExport } from "@progress/kendo-react-pdf";
import { Link, useParams } from "react-router-dom";
import { DownloadIcon, SmartHomeIcon } from "../../icons/Icons";
import { Report } from "../../../interface/interface";

const Download = () => {
  const { reportId }: any = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const pdfExportComponent = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/report/${reportId}`
        );
        setReport(data);
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

  const chunkArray = (array: any, size: any) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
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
            <PDFExport
              forcePageBreak=".page-break"
              ref={pdfExportComponent}
              fileName={report?.name + "-" + report?.reportDate + "-Report"}
            >
              {chunkArray(report?.reportRows || [], 12).map(
                (chunk, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="relative mx-auto h-full mb-8 object-cover flex flex-col justify-between"
                    data-theme="light"
                    style={{
                      width: "21cm",
                      height: "29.7cm",
                    }}
                  >
                    <img src="/report.webp" loading="eager" />
                    {pageIndex === 0 && (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://report.shailungpolyclinic.com/report/${report?._id}/download`}
                        className="w-[85px] h-[85px] absolute bottom-[52px] right-[18px]"
                        alt=""
                      />
                    )}
                    <div className="absolute flex flex-col justify-between pb-24 top-0 left-0 w-full h-full pt-48">
                      <main className="px-8 mt-4">
                        {pageIndex === 0 && (
                          <div className="space-y-4 font-roboto flex flex-col gap-4">
                            <div className="flex justify-between">
                              <div className="flex gap-4">
                                <div className="flex flex-col">
                                  <span>Name :</span>
                                  <span>Address :</span>
                                  <span>Ref. By :</span>
                                  <span>Lab ID :</span>
                                </div>
                                <div className="flex flex-col">
                                  <span>{report?.name}</span>
                                  <span>{report?.address}</span>
                                  <span>
                                    {report?.doctors && report?.doctors[0].name}
                                  </span>
                                  <span>{report?.labId || "-"}</span>
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
                                <p className="c text-center text-sm">
                                  {report?.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                              <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-black">
                                  <thead>
                                    <tr className=" bg-slate-500 text-white">
                                      <th
                                        scope="col"
                                        className="px-6 py-1 text-center text-xs font-bold uppercase"
                                      >
                                        Investigation
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-1 text-center text-xs font-bold uppercase"
                                      >
                                        Result
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-1 text-center text-xs font-bold uppercase"
                                      >
                                        Unit
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-1 text-center text-xs font-bold uppercase"
                                      >
                                        Ref. Value
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-black">
                                    {chunk
                                      .filter(
                                        (row: any) =>
                                          row.value !== null &&
                                          row.value !== undefined &&
                                          row.value !== ""
                                      )
                                      .map((row: any, index: number) => {
                                        const referenceValues =
                                          row.reference.split(" - ");
                                        const minValue = parseFloat(
                                          referenceValues[0]
                                        );
                                        const maxValue = parseFloat(
                                          referenceValues[1]
                                        );
                                        const isValueInRange =
                                          parseFloat(row.value) >= minValue &&
                                          parseFloat(row.value) <= maxValue;

                                        const valueStyle = isValueInRange
                                          ? ""
                                          : "font-bold";
                                        return (
                                          <tr key={index}>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                                              {row.title}
                                            </td>
                                            <td
                                              className={`px-6 py-2 whitespace-nowrap text-sm ${valueStyle}`}
                                            >
                                              {row.value || "-"}
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-end text-sm font-medium">
                                              {row.unit}
                                            </td>
                                            <td className="px-6 py-2 whitespace-pre-wrap text-sm">
                                              {row.reference}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        {pageIndex ===
                          chunkArray(report?.reportRows || [], 12).length -
                            1 && (
                          <div className="space-y-2">
                            {report?.summary && (
                              <div>
                                <h3 className="text-xs font-semibold">
                                  Test Information:
                                </h3>
                                <p className="text-xs">{report?.summary}</p>
                              </div>
                            )}
                            <footer className="absolute bottom-24 left-[50%] translate-x-[-50%]">
                              <div className="flex justify-evenly text-center">
                                {report?.doctors
                                  ?.slice(0, 2)
                                  .map((doc, index) => (
                                    <div key={index}>
                                      <span className="flex items-center justify-center">
                                        <img
                                          src={`${API_BASE_URL}/api/upload/single/${doc.sign}`}
                                          className="w-16 aspect-[4/3] object-contain"
                                        />
                                      </span>
                                      <p className="text-xs font-semibold">
                                        {doc && doc.name}
                                        <br />
                                        {doc && doc.designation} <br />
                                        {doc && doc.regno}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </footer>
                          </div>
                        )}
                      </main>
                    </div>
                    {pageIndex <
                      chunkArray(report?.reportRows || [], 12).length - 1 && (
                      <div
                        className="page-break"
                        style={{ pageBreakAfter: "always" }}
                      ></div>
                    )}
                  </div>
                )
              )}
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
