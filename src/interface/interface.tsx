export interface Test {
  _id: string;
  testid: string;
  userid: string;
  doneby: string;
  status: string;
  isDone: boolean;
  updatedat: string;
  addeddate: string;
  appointmentdate: string;
  reportId: string;
  addedby: string;
  testDetail: {
    testData: {
      _id: string;
      name: string;
      price: number;
      duration: number;
    };
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
}

export interface AvailableTest {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status: string;
  addeddate: string;
  updatedat: string;
  testProps: [
    {
      investigation: string;
      referenceValue: string;
      unit: string;
    }
  ];
}

export interface Report {
  _id: string;
  name: string;
  doctor: string;
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
  status: string;
  addedby: string;
  testid: string;
  reportRows: {
    title: string;
    value: string;
    unit: string;
    reference: string;
  }[];
  reportFile: string[];
}