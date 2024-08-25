export interface Test {
  _id: string;
  testids: string;
  userid: string;
  doneby: string;
  status: string;
  isDone: boolean;
  updatedat: string;
  addeddate: string;
  appointmentdate: string;
  reportId: string;
  addedby: string;
  doctors: string[];
  labId: string;
  collectiondate: string;
  testDetail: {
    testData: [
      {
        _id: string;
        name: string;
        price: number;
        duration: number;
      }
    ];
    userData: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
    doctorData: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
}

export interface User {
  _id: string;
  photo: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  address: string;
  updatedat: string;
  dob: string;
  gender: string;
  addeddate: string;
  addedby: string;
}

export interface AvailableTest {
  _id: string;
  uniqueid: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status: string;
  addeddate: string;
  updatedat: string;
  doctors: string[];
  summary: string;
  serviceid: string;
  testProps: [
    {
      investigation: string;
      referenceValue: string;
      unit: string;
    }
  ];
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  regno: string;
  sign: string;
}

export interface Report {
  _id: string;
  name: string;
  doctor: string;
  description: string[];
  age: number;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  testname: string[];
  reportType: string;
  reportDate: string;
  collectiondate: string;
  testType: string;
  status: string;
  addedby: string;
  testid: string;
  testids: string[];
  reportid: string;
  summary: string[];
  labId: string;
  doctors: [
    {
      _id: string;
      name: string;
      designation: string;
      regno: string;
      sign: string;
    }
  ];
  reportRows: {
    title: string;
    value: string;
    unit: string;
    reference: string;
  }[];
  reportFile: string[];
  refby: string;
}

export interface GeneralExamination {
  height: string;
  weight: string;
  pulseRate: string;
  temperature: string;
  bloodPressure: string;
  jaundice: boolean;
  paller: boolean;
  cynosis: boolean;
  clubbing: boolean;
  oedema: boolean;
  ascitis: boolean;
  lymphNode: boolean;
}

export interface SystematicExamination {
  cardiovascular: string;
  pulmonary: string;
  gastroenterology: string;
  neurology: string;
  musculoskeletal: string;
  genitourinary: string;
  oroDental: string;
  deformities: string;
  varicosVeins: string;
  hernia: string;
  hydrocele: string;
  eye: {
    rightEye: string;
    leftEye: string;
  };
  ear: {
    rightEar: string;
    leftEar: string;
  };
  others: string;
  radiologicalChestXRay: string;
  ecg: string;
  clinicalImpression: string;
}

export interface DifferentialCount {
  value: string;
  referenceRange: string;
}

export interface Hematology {
  totalWBCCount: DifferentialCount;
  differentialCount: {
    neutrophils: DifferentialCount;
    lymphocytes: DifferentialCount;
    eosinophils: DifferentialCount;
    monocytes: DifferentialCount;
    basophils: DifferentialCount;
  };
  esr: DifferentialCount;
  hemoglobin: DifferentialCount;
  malariaParasite: string;
  microfilaria: string;
}

export interface Biochemistry {
  randomBloodSugar: DifferentialCount;
  urea: DifferentialCount;
  creatinine: DifferentialCount;
  bilirubin: {
    totalDirect: DifferentialCount;
  };
  sgpt: DifferentialCount;
  sgop: DifferentialCount;
}

export interface Serology {
  antiHIV: string;
  hbsAg: string;
  antiHCV: string;
  vdrlRPR: string;
  tpHA: string;
  BloodGroupRh: string;
}

export interface Urine {
  albuminSugar: string;
  pusCells: string;
  rbcs: string;
  epithelialCells: string;
}

export interface OtherTests {
  opiates: string;
  cannabis: string;
  mantouxTest: string;
  urinePregnancyTest: string;
}

export interface LaboratoryExamination {
  hematology: Hematology;
  biochemistry: Biochemistry;
  serology: Serology;
  urine: Urine;
  other: OtherTests;
}

export interface MER {
  _id: string;
  name: string;
  age: number;
  sex: string;
  maritialStatus: string;
  passportNumber: string;
  passportExpiry: string;
  placeOfBirth: string;
  medicalExaminationDate: string;
  appliedCountry: string;
  nationality: string;
  photo: string;
  generalExamination: GeneralExamination;
  systematicExamination: SystematicExamination;
  laboratoryExamination: LaboratoryExamination;
  createdAt: string;
  updatedAt: string;
  addedby: string;
}

export interface MERAppointment {
  _id: string;
  name: string;
  phone: string;
  addedby: string;
  patientid: string;
  status: string;
  appointmentdate: string;
  completeddate: string;
  createdAt: string;
  updatedAt: string;
  reportId: string;
}

export interface Website {
  title: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  keywords: string;
  url: string;
  regno: string;
}
