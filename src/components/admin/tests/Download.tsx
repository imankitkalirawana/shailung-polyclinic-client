import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { Link, useParams } from "react-router-dom";
import { SmartHomeIcon } from "../../icons/Icons";
import { AvailableTest, Doctor, Report } from "../../../interface/interface";
import DynamicTable from "./DisplayReportTable";
import {
  getAllAvailableTestsWithIds,
  getDoctorsWithIds,
} from "../../../functions/get";
import { Button, Kbd } from "@nextui-org/react";

const Download = () => {
  const { reportId }: any = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [reportRows, setReportRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const reportArea = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  const handlePrint = () => {
    if (reportArea.current) {
      const printContent = reportArea.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Refresh to restore original page content
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
            <div
              className="relative mx-auto mb-8 justify-between"
              data-theme="light"
              ref={reportArea}
              style={{
                width: "1000px",
                height: "100%",
              }}
            >
              <img
                src="/report-header.jpg"
                className="absolute top-0 mix-blend-multiply"
                loading="eager"
              />
              <div
                data-theme="light"
                className="flex flex-col justify-between top-0 left-0 w-full h-full pt-48"
              >
                <main className="px-8 mt-4 min-h-[740px]">
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
                          <span>{report?._id.slice(0, 6)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {reportRows.map((row) => (
                    <div className="my-4" key={row._id}>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <h3 className="text-sm text-center font-semibold leading-none">
                            {row.testname}
                          </h3>
                          <p className="text-center text-xs">
                            {row.testdescription}
                          </p>
                        </div>
                      </div>
                      <DynamicTable tableid={row._id} />
                      <div className="mt-3">
                        {row.testsummary && (
                          <div>
                            <h3 className="text-xs font-semibold">
                              Test Information:
                            </h3>
                            <p className="text-xs whitespace-pre-wrap">
                              {row.testsummary}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="space-y-2"></div>
                </main>
                <div className="relative">
                  <footer className="absolute z-10 w-full -top-24">
                    <div className="flex w-full justify-evenly gap-4 text-center">
                      {doctors?.slice(0, 4).map((doc) => (
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
                  <div className="relative">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://report.shailungpolyclinic.com/report/${report?._id}/download`}
                      className="print:w-[80px] h-[100px] w-[100px] print:h-[80px] absolute bottom-[70px] right-[25px] print:bottom-[55px] print:right-[20px]"
                      alt=""
                    />
                    <img src="/report-footer.jpg" loading="eager" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center mt-8">
              <Button
                onClick={handlePrint}
                color="primary"
                variant="flat"
                endContent={<Kbd keys={["command"]}>P</Kbd>}
              >
                Print
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Download;
