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

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <p className="text-large">Download Report</p>
        </CardHeader>
        <CardBody>
          <PDFExport
            forcePageBreak=".page-break"
            ref={pdfExportComponent}
            fileName={report?.name + "-" + report?.createdAt + "-Report.pdf"}
          >
            <div
              className="relative font-serif mx-auto p-2 h-full mb-8 object-cover flex flex-col justify-between"
              data-theme="light"
              style={{
                width: "21cm",
                height: "29.7cm",
              }}
            >
              <div className="border border-black w-full h-full">
                <header>
                  <div className="flex flex-col justify-center items-center">
                    <h1 className="font-semibold text-lg">
                      Shailung Polyclinic &Diagnostic Center Pvt. Ltd.
                    </h1>
                    <i className="text-xs">
                      Itahari -/ Sunsari, Phone no:025-585541
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
                <div className="px-4 text-xs">
                  <div className="flex items-end gap-4">
                    <table className="border-collapse h-fit relative mt-2 w-full tbl border border-black">
                      <tbody>
                        <tr>
                          <td>Name:</td>
                          <td className="!uppercase" colSpan={4}>
                            {report?.name}
                          </td>
                          <td>Age:</td>
                          <td className="!uppercase">{report?.age}</td>
                          <td>Sex:</td>
                          <td className="!uppercase">{report?.sex}</td>
                          <td>Marital Status:</td>
                          <td className="!uppercase">
                            {report?.maritialStatus}
                          </td>
                        </tr>
                        <tr>
                          <td>Passport No.</td>
                          <td colSpan={2} className="!uppercase">
                            {report?.passportNumber}
                          </td>
                          <td colSpan={2}>Passport Expired On:</td>
                          <td colSpan={2} className="!uppercase">
                            {report?.passportExpiry}
                          </td>
                          <td colSpan={2}>Place of Birth</td>
                          <td colSpan={2} className="!uppercase">
                            {report?.placeOfBirth}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3}>Medical Examination Date:</td>
                          <td colSpan={2} className="!uppercase">
                            {report?.medicalExaminationDate}
                          </td>
                          <td colSpan={3}>Applied Country:</td>
                          <td className="!uppercase">
                            {report?.appliedCountry}
                          </td>
                          <td>Nationality:</td>
                          <td className="!uppercase">{report?.nationality}</td>
                        </tr>
                      </tbody>
                    </table>
                    <img
                      src={`${API_BASE_URL}/api/upload/single/${report?.photo}`}
                      alt="Shailung Polyclinic"
                      width={100}
                      height={100}
                    />
                  </div>

                  <table className="border-collapse relative w-full mt-2 tbl border border-black">
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
                        <td>
                          {report?.generalExamination.jaundice
                            ? "Present"
                            : "Absent"}
                        </td>
                        <td>Paller:</td>
                        <td>
                          {report?.generalExamination.paller
                            ? "Present"
                            : "Absent"}
                        </td>
                        <td>Cynosis:</td>
                        <td>
                          {report?.generalExamination.cynosis
                            ? "Present"
                            : "Absent"}
                        </td>
                      </tr>
                      <tr>
                        <td>Clubbing:</td>
                        <td>
                          {report?.generalExamination.clubbing
                            ? "Present"
                            : "Absent"}{" "}
                        </td>
                        <td>Oedema:</td>
                        <td>
                          {report?.generalExamination.oedema
                            ? "Present"
                            : "Absent"}
                        </td>
                        <td>Ascitis:</td>
                        <td>
                          {report?.generalExamination.ascitis
                            ? "Present"
                            : "Absent"}
                        </td>
                        <td>Lymph Node:</td>
                        <td>
                          {report?.generalExamination.lymphNode
                            ? "Present"
                            : "Absent"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex gap-2">
                    <div className="relative pt-4 w-[50%]">
                      <span className="absolute px-3 font-roboto top-2 whitespace-nowrap left-[50%] translate-x-[-50%] bg-black text-white">
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
                            <td colSpan={4}>
                              {report?.systematicExamination.cardiovascular ||
                                "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>Pulmonary</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.pulmonary || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>Gastroenterology</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.gastroenterology ||
                                "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>Neurology</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.neurology || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>Musculoskeletal</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.musculoskeletal ||
                                "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>Genitourinary</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.genitourinary ||
                                "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>Oro - Dental</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.oroDental || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>Extremities / Deformities</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.deformities ||
                                "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>Varicose Veins</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.varicosVeins ||
                                "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>Hernia</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.hernia || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>Hydrocele</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.hydrocele || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} rowSpan={2}>
                              Eye (Vision)
                            </td>
                            <td colSpan={2}>R.Eye</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.eye.rightEye ||
                                "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>L.Eye</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.eye.leftEye ||
                                "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} rowSpan={2}>
                              Ear
                            </td>
                            <td colSpan={2}>R.Ear</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.ear.rightEar ||
                                "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>L.Ear</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.ear.leftEar ||
                                "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>Others:</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.others || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>Radiological (Chest X-Ray):</td>
                            <td colSpan={4}>
                              {report?.systematicExamination
                                .radiologicalChestXRay || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>ECG:</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.ecg || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>CLINICAL IMPRESSION:</td>
                            <td colSpan={4}>
                              {report?.systematicExamination.clinicalImpression}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="flex flex-col">
                        <span>MIN</span>
                        <br />
                        <br />
                        <span>DEAR SIR,</span>
                        <br />
                        <br />
                        <span className="text-justify w-full">
                          THIS IS TO CERTIFY THAT <b>{report?.name}</b>{" "}
                          CLINICALLY AND MENTALLY FIT AND THERE IS NO EVIDENCE
                          OF COMMUNICABLE DISEASE IN HIM.
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
                          <span className="border-dotted border-t border-black">
                            (Stamp & Signature of Physician)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative pt-4 w-[50%]">
                      <span className="absolute px-3 font-roboto top-2 whitespace-nowrap left-[50%] translate-x-[-50%] bg-black text-white">
                        LABORATORY EXAMINATION
                      </span>
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
                                  .differentialCount.neutrophils.referenceRange
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
                                  .differentialCount.lymphocytes.referenceRange
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
                                  .differentialCount.eosinophils.referenceRange
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
                            <td colSpan={2}>
                              {
                                report?.laboratoryExamination.hematology
                                  .malariaParasite
                              }
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                          <tr>
                            <td colSpan={2}>Micro Filaria</td>
                            <td colSpan={2}>
                              {
                                report?.laboratoryExamination.hematology
                                  .microfilaria
                              }
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                          {/* BIOCHEMISTRY */}
                          {/* <td
                            rowSpan={7}
                            className="-rotate-90 translate-y-8 max-w-10 whitespace-nowrap"
                          >
                            BIOCHEMISTRY
                          </td> */}
                          <tr>
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
                                report?.laboratoryExamination.biochemistry.urea
                                  .value
                              }
                            </td>
                            <td colSpan={2}>
                              {
                                report?.laboratoryExamination.biochemistry.urea
                                  .referenceRange
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
                                report?.laboratoryExamination.biochemistry.sgpt
                                  .value
                              }
                            </td>
                            <td colSpan={2}>
                              {
                                report?.laboratoryExamination.biochemistry.sgpt
                                  .referenceRange
                              }
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>SGOT</td>
                            <td colSpan={2}>
                              {
                                report?.laboratoryExamination.biochemistry.sgop
                                  .value
                              }
                            </td>
                            <td colSpan={2}>
                              {
                                report?.laboratoryExamination.biochemistry.sgop
                                  .referenceRange
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
                          <tr>
                            <td colSpan={3}>Anti-HIV (1&2)</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.serology.antiHIV ||
                                "NIL"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3}>HBs-Ag</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.serology.hbsAg ||
                                "NIL"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3}>Anti-HCV</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.serology.antiHCV ||
                                "NIL"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3}>VDRL/RPR</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.serology.vdrlRPR ||
                                "NIL"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3}>TPHA</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.serology.tpHA ||
                                "NIL"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3}>ABO-Blood Group & Rh-type</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.serology
                                .BloodGroupRh || "NIL"}
                            </td>
                          </tr>
                          {/* URINE */}
                          {/* <td
                            rowSpan={5}
                            className="-rotate-90 max-w-10 whitespace-nowrap"
                          >
                            URINE
                          </td> */}
                          <tr>
                            <td colSpan={3}>Albumin/Sugar</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.urine
                                .albuminSugar || "NIL"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3}>Pus Cells fapf</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.urine.pusCells ||
                                "NIL"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3}>RBCs /hpf</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.urine.rbcs ||
                                "NIL"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3}>Epithelial cells /hpf</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.urine
                                .epithelialCells || "NIL"}
                            </td>
                          </tr>
                          {/* other */}
                          {/* <td
                            rowSpan={5}
                            className="-rotate-90 max-w-10 whitespace-nowrap"
                          >
                            OTHER
                          </td> */}
                          <tr>
                            <td colSpan={3}>Opiates</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.other.opiates ||
                                "NIL"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3}>Cannabies</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.other.cannabis ||
                                "NIL"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3}>Mantoux Test</td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.other
                                .mantouxTest || "NIL"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3}>
                              Urine Pregnancy Test (for female)
                            </td>
                            <td colSpan={3}>
                              {report?.laboratoryExamination.other
                                .urinePregnancyTest || "NIL"}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={6}
                              className="text-[9px] text-center bg-slate-400"
                            >
                              This Report is valid for Two months from the date
                              of Medical Examination.
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
