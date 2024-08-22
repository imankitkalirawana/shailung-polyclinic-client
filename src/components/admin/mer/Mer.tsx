import { useEffect, useRef, useState } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { MER as Report } from "../../../interface/interface";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";

const Mer = () => {
  const { id }: any = useParams();

  const pdfExportComponent = useRef(null);
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/mer/${id}`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        setReport(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch report");
      }
    };
    fetchReport();
  }, [id]);

  const handleExportWithComponent = () => {
    if (pdfExportComponent.current) {
      (pdfExportComponent.current as any).save();

      toast.success("Downloading Report...");
    } else {
      toast.error("Failed to download report");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  return (
    <>
      <Card>
        <CardHeader className="flex flex-col items-center px-4 pb-0 pt-4">
          <p className="text-large">Download Report</p>
        </CardHeader>
        <CardBody>
          <PDFExport
            forcePageBreak=".page-break"
            ref={pdfExportComponent}
            fileName={report?.name + "-" + report?.createdAt + "-Report.pdf"}
          >
            <div
              className="relative font-serif p-2 mx-auto h-full mb-8 object-cover flex flex-col justify-between"
              data-theme="light"
              style={{
                width: "21cm",
                height: "29.7cm",
              }}
            >
              <img
                className="absolute top-[50%] left-[50%] translate-x-[-50%] opacity-10 mix-blend-multiply translate-y-[-50%] w-[90%]"
                src="/mer.png"
                loading="eager"
              />
              <div className="w-full h-full p-2 border-1 border-black flex flex-col">
                <header>
                  <div className="flex flex-col justify-center mx-auto items-center">
                    <div className="flex justify-between w-full max-w-[630px]">
                      <p className="text-xs">S.N-</p>
                      <p className="text-xs justify-self-end">
                        Gov. Reg. No.66087/066/067
                      </p>
                    </div>
                    <h1 className="font-semibold text-lg uppercase">
                      Shailung Polyclinic &Diagnostic Center Pvt. Ltd.
                    </h1>
                    <i className="text-xs">
                      Itahari - Sunsari, Phone no:025-585541
                    </i>
                    <span className="text-xs">
                      E-mail:shailungpde@gmail.com / ghimirebab@gmail.com
                    </span>
                    <b className="text-xs">
                      (Nepal Medical Occupational's Organization)
                    </b>
                    <span className="t text-white bg-black px-4 mt-1 font-roboto font-bold">
                      MEDICAL EXAMINATION REPORT{"  "}
                    </span>
                    <span className="px-2 text-lg border font-bold border-black mt-0.5">
                      FIT
                    </span>
                  </div>
                </header>
                <div className="px-4 text-[9px]">
                  <div className="flex items-end gap-4">
                    <table className="border-collapse h-fit relative mt-2 w-full tbl border border-black">
                      <tbody>
                        <tr>
                          <td>Name:</td>
                          <td className="!uppercase font-bold" colSpan={4}>
                            {report?.name}
                          </td>
                          <td className="!text-wrap">Age (year):</td>
                          <td className="!uppercase">{report?.age}</td>
                          <td>Sex:</td>
                          <td className="!uppercase">
                            {report?.sex === "male"
                              ? "M"
                              : report?.sex === "female"
                              ? "F"
                              : "O"}
                          </td>
                          <td className="!text-wrap">Marital Status:</td>
                          <td className="!uppercase">
                            {report?.maritialStatus}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>Passport No.</td>
                          <td colSpan={1} className="!uppercase font-bold">
                            {report?.passportNumber}
                          </td>
                          <td colSpan={2}>Passport Expired On:</td>
                          <td colSpan={2} className="!uppercase">
                            {formatDate(report?.passportExpiry || "")}
                          </td>
                          <td colSpan={2}>Place of Birth</td>
                          <td colSpan={2} className="!uppercase">
                            {report?.placeOfBirth}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3}>Medical Examination Date:</td>
                          <td colSpan={2} className="!uppercase">
                            {formatDate(report?.medicalExaminationDate || "")}
                          </td>
                          <td colSpan={3}>Applied Country:</td>
                          <td className="!uppercase font-bold">
                            {report?.appliedCountry}
                          </td>
                          <td>Nationality:</td>
                          <td className="!uppercase">{report?.nationality}</td>
                        </tr>
                      </tbody>
                    </table>
                    <img
                      src={`${API_BASE_URL}/api/upload/single/${report?.photo}`}
                      alt={report?.name}
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="relative mt-2">
                    <span className="px-3 font-roboto top-2 whitespace-nowrap left-[0%] bg-black text-white">
                      GENERAL EXAMINATION
                    </span>
                    <ul className="text-[8px] leading-tight list-decimal pl-3">
                      <li>
                        Past history of serious illness, Major surgery, and
                        significant psychological problem including (Epilepsy
                        and Depression): None
                      </li>
                      <li>Past history of allergy: None</li>
                    </ul>
                    <table className="border-collapse relative w-full tbl border-black">
                      <tbody>
                        <tr>
                          <td>Height:</td>
                          <td>{report?.generalExamination.height}CM</td>
                          <td>Weight:</td>
                          <td>{report?.generalExamination.weight}kg</td>
                          <td>Pulse:</td>
                          <td>{report?.generalExamination.pulseRate}/min</td>
                          <td>Height:</td>
                          <td>{report?.generalExamination.temperature}°F</td>
                        </tr>
                        <tr>
                          <td>BP:</td>
                          <td>
                            {report?.generalExamination.bloodPressure} mm/hg
                          </td>
                          <td>Jaundice:</td>
                          <td>Absent</td>
                          <td>Paller:</td>
                          <td>Absent</td>
                          <td>Cynosis:</td>
                          <td>Absent</td>
                        </tr>
                        <tr>
                          <td>Clubbing:</td>
                          <td>Absent</td>
                          <td>Oedema:</td>
                          <td>Absent</td>
                          <td>Ascitis:</td>
                          <td>Absent</td>
                          <td>Lymph Node:</td>
                          <td>Absent</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-8 border mt-6 border-black border-collapse">
                    <div className="relative w-[50%]">
                      <div className="border border-black px-2">
                        <span className="absolute px-3 font-roboto -top-[15px] whitespace-nowrap left-[0%] bg-black text-white">
                          SYSTEMIC EXAMINATION
                        </span>
                        <table className="border-collapse h-fit relative w-full mt-2 tbl border border-black">
                          <thead>
                            <tr>
                              <th colSpan={4} className="min-w-[250px]">
                                Type of Medical Examination
                              </th>
                              <th colSpan={4}>Findings</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan={4}>Cardiovascular</td>
                              <td colSpan={4}>NAD</td>
                            </tr>
                            <tr>
                              <td colSpan={4}>Pulmonary</td>
                              <td colSpan={4}>NAD </td>
                            </tr>
                            <tr>
                              <td colSpan={4}>Gastroenterology</td>
                              <td colSpan={4}>NAD</td>
                            </tr>
                            <tr>
                              <td colSpan={4}>Neurology</td>
                              <td colSpan={4}>NAD </td>
                            </tr>
                            <tr>
                              <td colSpan={4}>Musculoskeletal</td>
                              <td colSpan={4}>NAD</td>
                            </tr>
                            <tr>
                              <td colSpan={4}>Genitourinary</td>
                              <td colSpan={4}>NAD</td>
                            </tr>
                            <tr>
                              <td colSpan={4}>Oro - Dental</td>
                              <td colSpan={4}>Normal</td>
                            </tr>
                            <tr>
                              <td colSpan={4}>Extremities / Deformities</td>
                              <td colSpan={4}>NAD</td>
                            </tr>
                            <tr>
                              <td colSpan={4}>Varicose Veins</td>
                              <td colSpan={4}>NAD</td>
                            </tr>
                            <tr>
                              <td colSpan={4}>Hernia</td>
                              <td colSpan={4}>Absent </td>
                            </tr>
                            <tr>
                              <td colSpan={4}>Hydrocele</td>
                              <td colSpan={4}>Absent </td>
                            </tr>
                            <tr>
                              <td colSpan={2} rowSpan={2}>
                                Eye (Vision)
                              </td>
                              <td colSpan={2}>R.Eye</td>
                              <td colSpan={4}>6/6</td>
                            </tr>
                            <tr>
                              <td colSpan={2}>L.Eye</td>
                              <td colSpan={4}>6/6</td>
                            </tr>
                            <tr>
                              <td colSpan={2} rowSpan={2}>
                                Ear
                              </td>
                              <td colSpan={2}>R.Ear</td>
                              <td colSpan={4}>Normal</td>
                            </tr>
                            <tr>
                              <td colSpan={2}>L.Ear</td>
                              <td colSpan={4}>Normal</td>
                            </tr>
                            <tr>
                              <td colSpan={4}>Others:</td>
                              <td colSpan={4}>N/A </td>
                            </tr>
                            <tr>
                              <td colSpan={4}>Radiological (Chest X-Ray):</td>
                              <td colSpan={4}>Normal</td>
                            </tr>
                            <tr>
                              <td colSpan={4}>ECG:</td>
                              <td colSpan={4}>N/A </td>
                            </tr>
                            <tr>
                              <td colSpan={4}>CLINICAL IMPRESSION:</td>
                              <td colSpan={4}>Normal </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="flex flex-col border px-2 border-black">
                        <div>
                          <span>MIN</span>
                          <br />
                          <br />
                          <span>DEAR SIR,</span>
                          <br />
                          <br />
                        </div>
                        <span className="text-justify w-full">
                          THIS IS TO CERTIFY THAT{" "}
                          <b className="uppercase">{report?.name}</b> CLINICALLY
                          AND MENTALLY FIT AND THERE IS NO EVIDENCE OF
                          COMMUNICABLE DISEASE IN HIM.
                        </span>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <div className="flex justify-between items-center tracking-tighter text-[8px]">
                          <span>(Stamp of Health Care Organization)</span>
                          <span className="border-dotted border-t mr-4 border-black">
                            (Stamp & Signature of Physician)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex flex-col w-[50%] pr-2 border border-black">
                      <div className="flex">
                        <span className="absolute px-3 font-roboto -top-[15px] whitespace-nowrap left-[50%] translate-x-[-50%] bg-black text-white">
                          LABORATORY EXAMINATION
                        </span>
                        <div className="absolute w-[598px] border border-collapse border-black flex justify-evenly text-center top-[44.5%] translate-y-[-50%] -rotate-90 -left-2 translate-x-[-50%]">
                          <span className="border border-black flex-[5]">
                            Other
                          </span>
                          {/* 35 */}
                          <span className="border border-black flex-[4]">
                            Urine
                          </span>
                          <span className="border border-black flex-[6]">
                            Serology
                          </span>
                          <span className="border border-black flex-[7]">
                            BIOCHEMISTRY
                          </span>
                          <span className="border border-black flex-[13]">
                            HEMATOLOGY
                          </span>
                        </div>
                        <table className="border-collapse relative w-full mt-2 tbl border border-black">
                          <thead>
                            {/* <td rowSpan={2}></td> */}
                            <tr>
                              <th colSpan={2}>Blood Examination</th>
                              <th colSpan={2}>Result</th>
                              <th colSpan={2}>Referance Ranges</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* <td
                            rowSpan={12}
                            className="-rotate-90 max-w-10 whitespace-nowrap"
                          >
                            HEMATOLOGY
                          </td> */}
                            <tr>
                              <td colSpan={2}>Total WBC Count</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .totalWBCCount.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .totalWBCCount.referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={6}>Differential Count:</td>
                            </tr>
                            <tr>
                              <td colSpan={2}>Neutrophils</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .differentialCount.neutrophils.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .differentialCount.neutrophils
                                    .referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>Lymphocytes</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .differentialCount.lymphocytes.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .differentialCount.lymphocytes
                                    .referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>Eosinophils</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .differentialCount.eosinophils.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .differentialCount.eosinophils
                                    .referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>Monocytes</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .differentialCount.monocytes.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .differentialCount.monocytes.referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>Basophils</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .differentialCount.basophils.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .differentialCount.basophils.referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>ESR</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology.esr
                                    .value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology.esr
                                    .referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>Hemoglobin</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .hemoglobin.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.hematology
                                    .hemoglobin.referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>Malaria Parasite</td>
                              <td colSpan={2}>Not Found</td>
                              <td colSpan={2}></td>
                            </tr>
                            <tr>
                              <td colSpan={2}>Micro Filaria</td>
                              <td colSpan={2}>Not Found</td>
                              <td colSpan={2}></td>
                            </tr>
                            {/* BIOCHEMISTRY */}
                            {/* <td
                            rowSpan={7}
                            className="-rotate-90 translate-y-8 max-w-10 whitespace-nowrap"
                          >
                            BIOCHEMISTRY
                          </td> */}
                            <tr className="border-t-2 border-black">
                              <td colSpan={2}>Random Blood Sugar</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.biochemistry
                                    .randomBloodSugar.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.biochemistry
                                    .randomBloodSugar.referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>Urea</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.biochemistry
                                    .urea.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.biochemistry
                                    .urea.referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>Creatinine</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.biochemistry
                                    .creatinine.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.biochemistry
                                    .creatinine.referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>Bilirubin</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.biochemistry
                                    .bilirubin.totalDirect.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.biochemistry
                                    .bilirubin.totalDirect.referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>SGPT</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.biochemistry
                                    .sgpt.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.biochemistry
                                    .sgpt.referenceRange
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>SGOT</td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.biochemistry
                                    .sgop.value
                                }
                              </td>
                              <td colSpan={2}>
                                {
                                  report?.laboratoryExamination.biochemistry
                                    .sgop.referenceRange
                                }
                              </td>
                            </tr>
                            {/* serology */}
                            {/* <td
                            rowSpan={7}
                            className="-rotate-90 translate-y-8 max-w-10 whitespace-nowrap"
                          >
                            SEROLOGY
                          </td> */}
                            <tr className="border-t-2 border-black">
                              <td colSpan={3}>Anti-HIV (1&2)</td>
                              <td colSpan={3}>Non Reactive</td>
                            </tr>
                            <tr>
                              <td colSpan={3}>HBs-Ag</td>
                              <td colSpan={3}>Negative</td>
                            </tr>
                            <tr>
                              <td colSpan={3}>Anti-HCV</td>
                              <td colSpan={3}>Negative</td>
                            </tr>
                            <tr>
                              <td colSpan={3}>VDRL/RPR</td>
                              <td colSpan={3}>Non Reactive</td>
                            </tr>
                            <tr>
                              <td colSpan={3}>TPHA</td>
                              <td colSpan={3}>Non Reactive</td>
                            </tr>
                            <tr>
                              <td colSpan={3}>ABO-Blood Group & Rh-type</td>
                              <td colSpan={3} className="uppercase">
                                {
                                  report?.laboratoryExamination.serology
                                    .BloodGroupRh
                                }
                              </td>
                            </tr>
                            {/* URINE */}
                            {/* <td
                            rowSpan={5}
                            className="-rotate-90 max-w-10 whitespace-nowrap"
                          >
                            URINE
                          </td> */}
                            <tr className="border-t-2 border-black">
                              <td colSpan={3}>Albumin/Sugar</td>
                              <td colSpan={3}>Nil</td>
                            </tr>
                            <tr>
                              <td colSpan={3}>Pus Cells fapf</td>
                              <td colSpan={3}>Nil</td>
                            </tr>
                            <tr>
                              <td colSpan={3}>RBCs /hpf</td>
                              <td colSpan={3}>Nil</td>
                            </tr>
                            <tr>
                              <td colSpan={3}>Epithelial cells /hpf</td>
                              <td colSpan={3}>Nil</td>
                            </tr>
                            {/* other */}
                            {/* <td
                            rowSpan={5}
                            className="-rotate-90 max-w-10 whitespace-nowrap"
                          >
                            OTHER
                          </td> */}
                            <tr className="border-t-2 border-black">
                              <td colSpan={3}>Opiates</td>
                              <td colSpan={3}>Negative</td>
                            </tr>
                            <tr>
                              <td colSpan={3}>Cannabies</td>
                              <td colSpan={3}>Negative</td>
                            </tr>
                            <tr>
                              <td colSpan={3}>Mantoux Test</td>
                              <td colSpan={3}>N/A</td>
                            </tr>
                            <tr>
                              <td colSpan={3}>
                                Urine Pregnancy Test (for female)
                              </td>
                              <td colSpan={3}>
                                {report?.sex === "female"
                                  ? report?.laboratoryExamination.other
                                      .urinePregnancyTest || "N/A"
                                  : "N/A"}
                              </td>
                            </tr>
                            {/* <tr>
                            <td
                              colSpan={6}
                              className="text-[8px] text-center bg-slate-400"
                            >
                              This Report is valid for Two months from the date
                              of Medical Examination.
                            </td>
                          </tr> */}
                          </tbody>
                        </table>
                      </div>
                      <p className="self-end items-center mt-8 mb-2">
                        .................................................
                        <br />
                        <span>(Signature of Lab Technician)</span>
                      </p>
                      <p className="text-[10px] pb-4 text-center pl-1 bg-[#cfb5ce]">
                        This Report is valid for Two months from the date of
                        Medical Examination.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PDFExport>
        </CardBody>
        <CardFooter className="justify-center">
          <Button size="lg" color="primary" onClick={handleExportWithComponent}>
            Download
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Mer;
