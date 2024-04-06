import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../../utils/config";
import toast from "react-hot-toast";
import { PDFExport } from "@progress/kendo-react-pdf";
import { useParams } from "react-router-dom";

interface Report {
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

const Download = () => {
  const { reportId }: any = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const pdfExportComponent = useRef(null);

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
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto my-24">
        <button className="btn btn-primary" onClick={handleExportWithComponent}>
          Download
        </button>
        <div className="mx-auto mt-12">
          <PDFExport ref={pdfExportComponent}>
            <div
              className="relative py-8 mx-auto px-12 flex flex-col justify-between border-8"
              style={{ width: "21cm", height: "29.7cm" }}
              data-theme="light"
            >
              <div>
                <header className="space-y-1 flex justify-between items-center">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-[#23326b] uppercase">
                      Shailung Polyclinic
                    </h1>
                    <p className="text-sm leading-none font-normal text-[#bd7e39] uppercase">
                      AND DIAGNOSTIC CENTRE PVT. LTD.
                    </p>
                  </div>
                  <div className="space-y-2 text-right">
                    <h2 className="text-lg font-bold tracking-tight">
                      Itahari-6, Sunsari
                    </h2>
                    <p className="text-sm leading-none">
                      shailungpdc@gmail.com
                    </p>
                    <p className="text-sm leading-none">+977-25-585541</p>
                  </div>
                </header>
                <div className="divider"></div>
                <main>
                  <div className="space-y-4">
                    <div className="flex gap-4 justify-between">
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <h3 className="text-lg text-nowrap font-semibold leading-none">
                            {report?.name}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm font-normal text-nowrap leading-none">
                              Age: {report?.age} Years
                            </p>
                            <p className="text-sm font-normal text-nowrap capitalize leading-none">
                              Gender: {report?.gender}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="divider-horizontal divider"></div>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <h3 className="text-lg mb-2 font-semibold text-nowrap leading-none">
                            By Dr. Shailung
                          </h3>
                          <p className="text-sm font-normal text-nowrap leading-none">
                            Address: Itahari-6, Sunsari
                          </p>
                          <p className="text-sm font-normal text-nowrap leading-none">
                            Phone: 025-585541
                          </p>
                          <p className="text-sm font-normal text-nowrap leading-none">
                            Email: xyz@gmail.com
                          </p>
                        </div>
                      </div>
                      <div className="divider-horizontal divider"></div>

                      <div className="text-end flex flex-col text-xs ">
                        <span className="font-semibold">Registered On:</span>
                        <span className="">10 June, 2023</span>
                        <span className="font-semibold">Collected On:</span>
                        <span className="">10 June, 2023</span>
                        <span className="font-semibold">Reported On:</span>
                        <span className="">10 June, 2023</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <h3 className="text-lg text-center font-semibold leading-none">
                          Lab Test Results
                        </h3>
                      </div>
                      <div className="flex flex-col">
                        <div className="-m-1.5 overflow-x-auto">
                          <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="overflow-hidden">
                              <table className="min-w-full divide-y">
                                <thead>
                                  <tr className="">
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-start text-xs font-bold uppercase"
                                    >
                                      Investigation
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-start text-xs font-bold uppercase"
                                    >
                                      Result
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-start text-xs font-bold uppercase"
                                    >
                                      Ref. Value
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-end text-xs font-bold uppercase"
                                    >
                                      Unit
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y">
                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      John Brown
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      45
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      New York No. 1 Lake Park
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                      helo
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      Jim Green
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      27
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      London No. 1 Lake Park
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                      <button
                                        type="button"
                                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400"
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      Joe Black
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      31
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      Sidney No. 1 Lake Park
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                      <button
                                        type="button"
                                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400"
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold leading-none">
                          Summary
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm leading-snug">
                          The test results indicate normal levels of hemoglobin
                          and glucose. Cholesterol levels are slightly elevated,
                          suggesting the need for dietary changes and regular
                          exercise.
                        </p>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
              <footer className="flex items-center justify-between">
                <div className="text-xs leading-none">
                  <p className="leading-none">Medical Diagnostics Inc.</p>
                  <p className="leading-none">123 Health St, Mediville</p>
                  <p className="leading-none">www.medi.com</p>
                </div>
                <div className="text-right text-xs leading-none">
                  <p className="leading-none">Report Date: 12th March 2023</p>
                  <p className="leading-none">Accession: 2023001923</p>
                </div>
              </footer>
            </div>
          </PDFExport>
        </div>
      </div>
    </>
  );
};

export default Download;
