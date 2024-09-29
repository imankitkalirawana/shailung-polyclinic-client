import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { Doctor, Report } from "../../../interface/interface";
import DynamicTable from "./DisplayReportTable";
import { getDoctorsWithIds } from "../../../functions/get";
import { Button, cn, Kbd } from "@nextui-org/react";
import { IconPrinter } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";

interface ReportSectionProps {
  report: Report;
  row: any;
  doctors: Doctor[];
}

const ReportSection = ({ report, row, doctors }: ReportSectionProps) => {
  const reportArea = useRef<HTMLDivElement>(null);
  const mainContent = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const handlePrint = () => {
    if (reportArea.current) {
      const printContent = reportArea.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      setHeight(mainContent.current.clientHeight);
    }, 100);
  }, []);

  return (
    <>
      <div
        className={cn(
          "relative mx-auto  w-[1000px] min-h-[1390px] justify-between"
          // height <= 740 && height > 0 ? "aspect-[1/1.39]" : ""
        )}
        data-theme="light"
        ref={reportArea}
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
          <main className="px-8 mt-4 min-h-[740px] text-base" ref={mainContent}>
            <div className="space-y-4 font-roboto flex flex-col gap-4">
              <div className="flex justify-between">
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
                <div className="flex gap-4 pr-16">
                  <div className="flex flex-col">
                    <b>Age/Sex :</b>
                    <b>Report Date :</b>
                    <b>Collection Date :</b>
                    <b>Report ID :</b>
                  </div>
                  <div className="flex flex-col">
                    <span className="capitalize">
                      {`${report?.age} Yrs ${
                        report?.gender && `/${report.gender}`
                      }`}
                    </span>
                    <span>{report?.reportDate || "-"}</span>
                    <span>{report?.collectiondate || "-"}</span>
                    <span>{report?._id.slice(0, 6)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-4" key={row._id}>
              <div className="space-y-2">
                <div className="space-y-1">
                  <h3 className="text-center font-semibold leading-none">
                    {row.testDetail.name}
                  </h3>
                  <p className="text-center">{row.testDetail.description}</p>
                </div>
              </div>
              <DynamicTable tableid={row._id} />
              <div className="mt-3">
                {row.testDetail.summary && (
                  <div>
                    <h3 className="font-semibold">Test Information:</h3>
                    <p className="whitespace-pre-wrap">
                      {row.testDetail.summary}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2"></div>
          </main>
          <div
            className={cn(
              "",
              height > 740 ? "absolute top-[188%]" : "absolute bottom-[0%]"
            )}
          >
            <footer
              className={cn(
                "absolute z-10 w-full",
                height > 740 ? "-top-56" : "-top-52"
              )}
            >
              <div className="flex w-full justify-evenly gap-4 text-center">
                {doctors?.slice(0, 4).map((doc: Doctor) => (
                  <div key={doc._id}>
                    <span className="flex items-center justify-center">
                      <img
                        src={`${API_BASE_URL}/api/upload/single/${doc.sign}`}
                        className="w-48 aspect-[4/3] object-contain"
                      />
                    </span>
                    <p className="text-sm">
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
            <div>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://report.shailungpolyclinic.com/report/${report?._id}/download`}
                className="h-[100px] w-[100px] absolute bottom-[70px] right-[25px]"
                alt=""
              />
              <img src="/report-footer.jpg" loading="eager" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col print:hidden justify-center items-center mt-8">
        <Button
          onClick={handlePrint}
          color="primary"
          variant="flat"
          className="mb-8 hidden"
          endContent={<Kbd keys={["command"]}>P</Kbd>}
        >
          Print
        </Button>
      </div>
    </>
  );
};

const Download = () => {
  const { reportId }: any = useParams();
  const [report, setReport] = useState<Report | null>(null);
  let [reportRows, setReportRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const reportRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/report/${reportId}`
        );
        let res = await axios.get(
          `${API_BASE_URL}/api/report/report-row/by-reportid/${data._id}`
        );
        const doctorsData = await getDoctorsWithIds(data.doctors);
        // remove that test from the report which has data.data has only formid and no other data
        // res.data = res.data.filter((row) => row.data && row.data.length > 1);

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

  return (
    <>
      <Helmet>
        <title>{`${report?.name}_${report?.reportDate}`}</title>
      </Helmet>
      <div className="flex justify-center print:hidden mt-36 mb-2">
        <Button
          endContent={<IconPrinter size={18} />}
          onClick={() => window.print()}
          color="primary"
          variant="flat"
        >
          Print
        </Button>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-96">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      ) : (
        <>
          {reportRows.map((row) => (
            <ReportSection
              key={row._id}
              // @ts-ignore
              report={report}
              row={row}
              doctors={doctors}
              // @ts-ignore
              ref={(el) => (reportRefs.current[index] = el)}
            />
          ))}
        </>
      )}
    </>
  );
};

export default Download;
