import { useFormik } from "formik";
import { isLoggedIn } from "../../../utils/auth";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { parseDate } from "@internationalized/date";

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Divider,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { API_BASE_URL } from "../../../utils/config";
import { IconPencil } from "@tabler/icons-react";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { DeleteFile, UploadSingleFile } from "../../../utils/FileHandling";

const EditMer = () => {
  const { loggedIn, user } = isLoggedIn();
  const { id }: any = useParams();
  const location = useLocation();
  const currentUrl = location.pathname;
  useEffect(() => {
    if (!loggedIn || (user?.role !== "admin" && user?.role !== "doctor")) {
      window.location.href = `/auth/login?redirect=${currentUrl}`;
    }
  }, [currentUrl]);
  //   @ts-ignore
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/mer/${id}`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        formik.setValues(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch report");
      }
    };
    fetchReport();
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name is too short")
      .max(50, "Name is too long")
      .required("Name is required"),
    age: Yup.number()
      .min(1, "Age is too short")
      .max(120, "Age is too long")
      .required("Age is required"),
    sex: Yup.string().required("Gender is required"),
    maritialStatus: Yup.string().required("Maritial Status is required"),
    passportNumber: Yup.string().required("Passport Number is required"),
    generalExamination: Yup.object().shape({
      height: Yup.string()
        .matches(/^[+-]?([0-9]*[.])?[0-9]+$/, "Height must be a valid number")

        .required("Height is required"),
      weight: Yup.string()
        .matches(/^[+-]?([0-9]*[.])?[0-9]+$/, "Weight must be a valid number")
        .required("Weight is required"),
      pulseRate: Yup.string()
        .matches(
          /^[+-]?([0-9]*[.])?[0-9]+$/,
          "Pulse Rate must be a valid number"
        )
        .required("Pulse Rate is required"),
      temperature: Yup.string()
        .matches(
          /^[+-]?([0-9]*[.])?[0-9]+$/,
          "Temperature must be a valid number"
        )
        .required("Temperature is required"),
      bloodPressure: Yup.string()
        .matches(
          /^[+-]?([0-9]*[.])?[0-9]+\/[+-]?([0-9]*[.])?[0-9]+$/,
          "Blood Pressure must be a valid number"
        )
        .required("Blood Pressure is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      _id: "",
      name: "",
      age: 0,
      sex: "",
      maritialStatus: "",
      passportNumber: "",
      passportExpiry: new Date().toISOString().split("T")[0],
      placeOfBirth: "",
      medicalExaminationDate: new Date().toISOString().split("T")[0],
      appliedCountry: "",
      nationality: "",
      photo: "",
      previewPhoto: "",
      generalExamination: {
        height: "",
        weight: "",
        pulseRate: "",
        temperature: "",
        bloodPressure: "",
        jaundice: false,
        paller: false,
        cynosis: false,
        clubbing: false,
        oedema: false,
        ascitis: false,
        lymphNode: false,
      },
      systematicExamination: {
        cardiovascular: "",
        pulmonary: "",
        gastroenterology: "",
        neurology: "",
        musculoskeletal: "",
        genitourinary: "",
        oroDental: "",
        deformities: "",
        varicosVeins: "",
        hernia: "",
        hydrocele: "",
        eye: {
          rightEye: "",
          leftEye: "",
        },
        ear: {
          rightEar: "",
          leftEar: "",
        },
        others: "",
        radiologicalChestXRay: "",
        ecg: "",
        clinicalImpression: "",
      },
      laboratoryExamination: {
        hematology: {
          totalWBCCount: {
            value: "",
            referenceRange: "4000-11000",
          },
          differentialCount: {
            neutrophils: { value: "", referenceRange: "45-74%" },
            lymphocytes: { value: "", referenceRange: "20-40%" },
            eosinophils: { value: "", referenceRange: "1-6%" },
            monocytes: { value: "", referenceRange: "0-8%" },
            basophils: { value: "", referenceRange: "0-3%" },
          },
          esr: {
            value: "",
            referenceRange: "M: <10, F: <15",
          },
          hemoglobin: {
            value: "",
            referenceRange: "M: 12-18 gm%, F: 12-16",
          },
          malariaParasite: "",
          microfilaria: "",
        },
        biochemistry: {
          randomBloodSugar: {
            value: "",
            referenceRange: "80-120 mg%",
          },
          urea: {
            value: "",
            referenceRange: "20-45 mg%",
          },
          creatinine: {
            value: "",
            referenceRange: "0.4 < 1.4 mg%",
          },
          bilirubin: {
            totalDirect: {
              value: "",
              referenceRange: "0.4 < 1.2 mg% (<1.2/<0.4)",
            },
          },
          sgpt: {
            value: "",
            referenceRange: "Up to 40U/L",
          },
          sgop: {
            value: "",
            referenceRange: "Up to 40U/L",
          },
        },
        serology: {
          antiHIV: "",
          hbsAg: "",
          antiHCV: "",
          vdrlRPR: "",
          tpHA: "",
          BloodGroupRh: "",
        },
        urine: {
          albuminSugar: "",
          pusCells: "",
          rbcs: "",
          epithelialCells: "",
        },
        other: {
          opiates: "",
          cannabis: "",
          mantouxTest: "",
          urinePregnancyTest: "",
        },
      },
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (file) {
          await DeleteFile(values.photo);
          const filename = `medical-examination-report-${
            values.name.split(" ")[0]
          }-${Date.now()}.${file.name.split(".").pop() || "jpg"}`;
          await UploadSingleFile(file, filename);
          values.photo = filename;
        }
        await axios
          .put(`${API_BASE_URL}/api/mer/${id}`, values, {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          })
          .then(() => {
            toast.success("Medical Examination Report updated successfully");
          });
      } catch (error) {
        console.error(error);
        toast.error("Failed to update Medical Examination Report");
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile: File = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        formik.setValues({
          ...formik.values,
          previewPhoto: imageData,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <>
      <div className="mx-auto">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h2 className="my-6 text-2xl font-semibold">
              Medical Examination Report
            </h2>
          </div>
          <Card className="p-4">
            <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
              <p className="text-large">Patient Information</p>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-6">
              <div className="col-span-full">
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e)}
                />
                <Badge
                  classNames={{
                    badge: "w-5 h-5",
                  }}
                  color="primary"
                  content={
                    <Button
                      isIconOnly
                      className="p-0 text-primary-foreground"
                      radius="full"
                      size="sm"
                      variant="light"
                      as={"label"}
                      htmlFor="photo"
                    >
                      <IconPencil size={12} />
                    </Button>
                  }
                  placement="bottom-right"
                  shape="circle"
                >
                  <Avatar
                    className="h-14 w-14"
                    src={
                      formik.values.previewPhoto
                        ? formik.values.previewPhoto
                        : `${API_BASE_URL}/api/upload/single/${formik.values.photo}`
                    }
                    showFallback
                  />
                </Badge>
              </div>
              <Input
                label="Name"
                placeholder="Enter name"
                {...formik.getFieldProps("name")}
                className="col-span-6 sm:col-span-3 lg:col-span-2 col-start-1"
                isInvalid={
                  formik.touched.name && formik.errors.name ? true : false
                }
                errorMessage={formik.touched.name && formik.errors.name}
              />
              <Input
                label="Age"
                type="number"
                placeholder="Enter age"
                {...formik.getFieldProps("age")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                isInvalid={
                  formik.touched.age && formik.errors.age ? true : false
                }
                errorMessage={formik.touched.age && formik.errors.age}
              />
              <Select
                label="Gender"
                {...formik.getFieldProps("sex")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                isInvalid={
                  formik.touched.sex && formik.errors.sex ? true : false
                }
                errorMessage={formik.touched.sex && formik.errors.sex}
              >
                <SelectItem key="male">Male</SelectItem>
                <SelectItem key="female">Female</SelectItem>
                <SelectItem key="other">Other</SelectItem>
              </Select>
              <Select
                label="Maritial Status"
                {...formik.getFieldProps("maritialStatus")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                isInvalid={
                  formik.touched.maritialStatus && formik.errors.maritialStatus
                    ? true
                    : false
                }
                errorMessage={
                  formik.touched.maritialStatus && formik.errors.maritialStatus
                }
              >
                <SelectItem key="single">Single</SelectItem>
                <SelectItem key="married">Married</SelectItem>
                <SelectItem key="divorced">Divorced</SelectItem>
                <SelectItem key="widowed">Widowed</SelectItem>
              </Select>
              <Input
                label="Passport Number"
                placeholder="Enter passport number"
                {...formik.getFieldProps("passportNumber")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                isInvalid={
                  formik.touched.passportNumber && formik.errors.passportNumber
                    ? true
                    : false
                }
                errorMessage={
                  formik.touched.passportNumber && formik.errors.passportNumber
                }
              />
              <DatePicker
                label="Passport Expiry"
                onChange={(date) => {
                  formik.setFieldValue(
                    "passportExpiry",
                    date.toString().split("T")[0]
                  );
                }}
                value={parseDate(formik.values.passportExpiry)}
                name="passportExpiry"
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                showMonthAndYearPickers
              />
              <Input
                label="Place of Birth"
                placeholder="Enter place of birth"
                {...formik.getFieldProps("placeOfBirth")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <DatePicker
                label="Medical Examination Date"
                onChange={(date) => {
                  formik.setFieldValue(
                    "medicalExaminationDate",
                    date.toString().split("T")[0]
                  );
                }}
                value={parseDate(formik.values.medicalExaminationDate)}
                name="medicalExaminationDate"
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                showMonthAndYearPickers
              />
              <Input
                label="Applied Country"
                placeholder="Enter applied country"
                {...formik.getFieldProps("appliedCountry")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Nationality"
                placeholder="Enter Nationality"
                {...formik.getFieldProps("nationality")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
            </CardBody>
          </Card>
          <Card className="mt-8">
            <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
              <p className="text-large">General Examination</p>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-6">
              <Input
                label="Height"
                placeholder="eg: 170"
                {...formik.getFieldProps("generalExamination.height")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">cm</span>
                  </div>
                }
                isInvalid={
                  formik.touched.generalExamination?.height &&
                  formik.errors.generalExamination?.height
                    ? true
                    : false
                }
                errorMessage={
                  formik.touched.generalExamination?.height &&
                  formik.errors.generalExamination?.height
                }
              />
              <Input
                label="Weight"
                placeholder="eg: 70"
                {...formik.getFieldProps("generalExamination.weight")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">kg</span>
                  </div>
                }
                isInvalid={
                  formik.touched.generalExamination?.weight &&
                  formik.errors.generalExamination?.weight
                    ? true
                    : false
                }
                errorMessage={
                  formik.touched.generalExamination?.weight &&
                  formik.errors.generalExamination?.weight
                }
              />
              <Input
                label="Pulse Rate"
                placeholder="eg: 72"
                {...formik.getFieldProps("generalExamination.pulseRate")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">/min</span>
                  </div>
                }
                isInvalid={
                  formik.touched.generalExamination?.pulseRate &&
                  formik.errors.generalExamination?.pulseRate
                    ? true
                    : false
                }
                errorMessage={
                  formik.touched.generalExamination?.pulseRate &&
                  formik.errors.generalExamination?.pulseRate
                }
              />
              <Input
                label="Temperature"
                placeholder="eg: 98.6"
                {...formik.getFieldProps("generalExamination.temperature")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">°F</span>
                  </div>
                }
                isInvalid={
                  formik.touched.generalExamination?.temperature &&
                  formik.errors.generalExamination?.temperature
                    ? true
                    : false
                }
                errorMessage={
                  formik.touched.generalExamination?.temperature &&
                  formik.errors.generalExamination?.temperature
                }
              />
              <Input
                label="Blood Pressure"
                placeholder="eg: 120/80"
                {...formik.getFieldProps("generalExamination.bloodPressure")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">mm/Hg</span>
                  </div>
                }
                isInvalid={
                  formik.touched.generalExamination?.bloodPressure &&
                  formik.errors.generalExamination?.bloodPressure
                    ? true
                    : false
                }
                errorMessage={
                  formik.touched.generalExamination?.bloodPressure &&
                  formik.errors.generalExamination?.bloodPressure
                }
              />
              <CheckboxGroup label="General Illness" className="col-span-full">
                <Checkbox
                  value="jaundice"
                  isSelected={formik.values.generalExamination.jaundice}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "generalExamination.jaundice",
                      e.target.checked
                    )
                  }
                >
                  Jaundice
                </Checkbox>
                <Checkbox
                  value="paller"
                  isSelected={formik.values.generalExamination.paller}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "generalExamination.paller",
                      e.target.checked
                    )
                  }
                >
                  Paller
                </Checkbox>
                <Checkbox
                  value="cynosis"
                  isSelected={formik.values.generalExamination.cynosis}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "generalExamination.cynosis",
                      e.target.checked
                    )
                  }
                >
                  Cynosis
                </Checkbox>
                <Checkbox
                  value="clubbing"
                  isSelected={formik.values.generalExamination.clubbing}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "generalExamination.clubbing",
                      e.target.checked
                    )
                  }
                >
                  Clubbing
                </Checkbox>
                <Checkbox
                  value="oedema"
                  isSelected={formik.values.generalExamination.oedema}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "generalExamination.oedema",
                      e.target.checked
                    )
                  }
                >
                  Oedema
                </Checkbox>
                <Checkbox
                  value="ascitis"
                  isSelected={formik.values.generalExamination.ascitis}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "generalExamination.ascitis",
                      e.target.checked
                    )
                  }
                >
                  Ascitis
                </Checkbox>
                <Checkbox
                  value="lymphNode"
                  isSelected={formik.values.generalExamination.lymphNode}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "generalExamination.lymphNode",
                      e.target.checked
                    )
                  }
                >
                  Lymph Node
                </Checkbox>
              </CheckboxGroup>
            </CardBody>
          </Card>
          <Card className="mt-8">
            <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
              <p className="text-large">Systematic Examination</p>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-6">
              <Input
                label="Cardiovascular"
                placeholder="Enter cardiovascular"
                {...formik.getFieldProps(
                  "systematicExamination.cardiovascular"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Pulmonary"
                placeholder="Enter pulmonary"
                {...formik.getFieldProps("systematicExamination.pulmonary")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Gastroenterology"
                placeholder="Enter gastroenterology"
                {...formik.getFieldProps(
                  "systematicExamination.gastroenterology"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Neurology"
                placeholder="Enter neurology"
                {...formik.getFieldProps("systematicExamination.neurology")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Musculoskeletal"
                placeholder="Enter musculoskeletal"
                {...formik.getFieldProps(
                  "systematicExamination.musculoskeletal"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Genitourinary"
                placeholder="Enter genitourinary"
                {...formik.getFieldProps("systematicExamination.genitourinary")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Oro Dental"
                placeholder="Enter oro dental"
                {...formik.getFieldProps("systematicExamination.oroDental")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Deformities"
                placeholder="Enter deformities"
                {...formik.getFieldProps("systematicExamination.deformities")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Varicos Veins"
                placeholder="Enter varicos veins"
                {...formik.getFieldProps("systematicExamination.varicosVeins")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Hernia"
                placeholder="Enter hernia"
                {...formik.getFieldProps("systematicExamination.hernia")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Hydrocele"
                placeholder="Enter hydrocele"
                {...formik.getFieldProps("systematicExamination.hydrocele")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />

              <Input
                label="Left Eye"
                placeholder="Enter left eye"
                {...formik.getFieldProps("systematicExamination.eye.leftEye")}
                className="col-span-6 sm:col-span-3 col-start-1"
              />
              <Input
                label="Right Eye"
                placeholder="Enter right eye"
                {...formik.getFieldProps("systematicExamination.eye.rightEye")}
                className="col-span-6 sm:col-span-3"
              />
              <Input
                label="Left Ear"
                placeholder="Enter left ear"
                {...formik.getFieldProps("systematicExamination.ear.leftEar")}
                className="col-span-6 sm:col-span-3 col-start-1"
              />
              <Input
                label="Right Ear"
                placeholder="Enter right ear"
                {...formik.getFieldProps("systematicExamination.ear.rightEar")}
                className="col-span-6 sm:col-span-3"
              />
              <Input
                label="Others"
                placeholder="Enter others"
                {...formik.getFieldProps("systematicExamination.others")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Radiological Chest X-Ray"
                placeholder="Enter radiological chest x-ray"
                {...formik.getFieldProps(
                  "systematicExamination.radiologicalChestXRay"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="ECG"
                placeholder="Enter ECG"
                {...formik.getFieldProps("systematicExamination.ecg")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Clinical Impression"
                placeholder="Enter clinical impression"
                {...formik.getFieldProps(
                  "systematicExamination.clinicalImpression"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
            </CardBody>
          </Card>
          <Card className="mt-8">
            <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
              <p className="text-large">Laboratory Examination</p>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-6">
              <Divider className="my-4 col-span-full" />
              <p className="text-base col-span-full">Hematology</p>

              <Input
                label="Total WBC Count"
                placeholder="Enter total WBC count"
                {...formik.getFieldProps(
                  "laboratoryExamination.hematology.totalWBCCount.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.hematology.totalWBCCount.referenceRange}`}
              />
              <Input
                label="Neutrophils"
                placeholder="Enter neutrophils"
                {...formik.getFieldProps(
                  "laboratoryExamination.hematology.differentialCount.neutrophils.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.hematology.differentialCount.neutrophils.referenceRange}`}
              />
              <Input
                label="Lymphocytes"
                placeholder="Enter lymphocytes"
                {...formik.getFieldProps(
                  "laboratoryExamination.hematology.differentialCount.lymphocytes.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.hematology.differentialCount.lymphocytes.referenceRange}`}
              />
              <Input
                label="Eosinophils"
                placeholder="Enter eosinophils"
                {...formik.getFieldProps(
                  "laboratoryExamination.hematology.differentialCount.eosinophils.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.hematology.differentialCount.eosinophils.referenceRange}`}
              />
              <Input
                label="Monocytes"
                placeholder="Enter monocytes"
                {...formik.getFieldProps(
                  "laboratoryExamination.hematology.differentialCount.monocytes.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.hematology.differentialCount.monocytes.referenceRange}`}
              />
              <Input
                label="Basophils"
                placeholder="Enter basophils"
                {...formik.getFieldProps(
                  "laboratoryExamination.hematology.differentialCount.basophils.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.hematology.differentialCount.basophils.referenceRange}`}
              />
              <Input
                label="ESR"
                placeholder="Enter ESR"
                {...formik.getFieldProps(
                  "laboratoryExamination.hematology.esr.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.hematology.esr.referenceRange}`}
              />
              <Input
                label="Hemoglobin"
                placeholder="Enter hemoglobin"
                {...formik.getFieldProps(
                  "laboratoryExamination.hematology.hemoglobin.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.hematology.hemoglobin.referenceRange}`}
              />
              <Input
                label="Malaria Parasite"
                placeholder="Enter malaria parasite"
                {...formik.getFieldProps(
                  "laboratoryExamination.hematology.malariaParasite"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Micro Filaria"
                placeholder="Enter microfilaria"
                {...formik.getFieldProps(
                  "laboratoryExamination.hematology.microfilaria"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Divider className="my-4 col-span-full" />
              <p className="text-base col-span-full">Biochemistry</p>
              <Input
                label="Random Blood Sugar"
                placeholder="Enter random blood sugar"
                {...formik.getFieldProps(
                  "laboratoryExamination.biochemistry.randomBloodSugar.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.biochemistry.randomBloodSugar.referenceRange}`}
              />
              <Input
                label="Urea"
                placeholder="Enter urea"
                {...formik.getFieldProps(
                  "laboratoryExamination.biochemistry.urea.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.biochemistry.urea.referenceRange}`}
              />
              <Input
                label="Creatinine"
                placeholder="Enter creatinine"
                {...formik.getFieldProps(
                  "laboratoryExamination.biochemistry.creatinine.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.biochemistry.creatinine.referenceRange}`}
              />
              <Input
                label="Total Bilirubin"
                placeholder="Enter total bilirubin"
                {...formik.getFieldProps(
                  "laboratoryExamination.biochemistry.bilirubin.totalDirect.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.biochemistry.bilirubin.totalDirect.referenceRange}`}
              />
              <Input
                label="SGPT"
                placeholder="Enter SGPT"
                {...formik.getFieldProps(
                  "laboratoryExamination.biochemistry.sgpt.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.biochemistry.sgpt.referenceRange}`}
              />
              <Input
                label="SGOP"
                placeholder="Enter SGOP"
                {...formik.getFieldProps(
                  "laboratoryExamination.biochemistry.sgop.value"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
                description={`Reference Range: ${formik.values.laboratoryExamination.biochemistry.sgop.referenceRange}`}
              />
              <Divider className="my-4 col-span-full" />
              <p className="text-base col-span-full">Serology</p>
              <Input
                label="Anti HIV"
                placeholder="Enter Anti HIV"
                {...formik.getFieldProps(
                  "laboratoryExamination.serology.antiHIV"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="HBS Ag"
                placeholder="Enter HBS Ag"
                {...formik.getFieldProps(
                  "laboratoryExamination.serology.hbsAg"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Anti HCV"
                placeholder="Enter Anti HCV"
                {...formik.getFieldProps(
                  "laboratoryExamination.serology.antiHCV"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="VDRL RPR"
                placeholder="Enter VDRL RPR"
                {...formik.getFieldProps(
                  "laboratoryExamination.serology.vdrlRPR"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="TPHA"
                placeholder="Enter TPHA"
                {...formik.getFieldProps("laboratoryExamination.serology.tpHA")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Blood Group Rh"
                placeholder="Enter Blood Group Rh"
                {...formik.getFieldProps(
                  "laboratoryExamination.serology.BloodGroupRh"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Divider className="my-4 col-span-full" />
              <p className="text-base col-span-full">Urine</p>
              <Input
                label="Albumin Sugar"
                placeholder="Enter Albumin Sugar"
                {...formik.getFieldProps(
                  "laboratoryExamination.urine.albuminSugar"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Pus Cells"
                placeholder="Enter Pus Cells"
                {...formik.getFieldProps(
                  "laboratoryExamination.urine.pusCells"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="RBCs"
                placeholder="Enter RBCs"
                {...formik.getFieldProps("laboratoryExamination.urine.rbcs")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Epithelial Cells"
                placeholder="Enter Epithelial Cells"
                {...formik.getFieldProps(
                  "laboratoryExamination.urine.epithelialCells"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Divider className="my-4 col-span-full" />
              <p className="text-base col-span-full">Other Tests</p>
              <Input
                label="Opiates"
                placeholder="Enter Opiates"
                {...formik.getFieldProps("laboratoryExamination.other.opiates")}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Cannabis"
                placeholder="Enter Cannabis"
                {...formik.getFieldProps(
                  "laboratoryExamination.other.cannabis"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Mantoux Test"
                placeholder="Enter Mantoux Test"
                {...formik.getFieldProps(
                  "laboratoryExamination.other.mantouxTest"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
              <Input
                label="Urine Pregnancy Test"
                placeholder="Enter Urine Pregnancy Test"
                {...formik.getFieldProps(
                  "laboratoryExamination.other.urinePregnancyTest"
                )}
                className="col-span-6 sm:col-span-3 lg:col-span-2"
              />
            </CardBody>
            <CardFooter className="justify-end">
              <Button
                color="primary"
                variant="flat"
                onPress={() => formik.handleSubmit()}
                isLoading={formik.isSubmitting}
                isDisabled={formik.isSubmitting}
              >
                Submit
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditMer;
