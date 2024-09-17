import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { Website } from "../interface/interface";

export const getAllUsers = async (role: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/admin/users/${role}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
  const data = response.data;
  return data.reverse();
};

export const getAllUnknownUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/admin/unknown-users`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
  const data = response.data;
  return data.reverse();
};

// get unknown user by id
export const getUnknownUser = async (id: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/admin/unknown-user/${id}`,
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

export const getBothUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/admin/all-users`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
  const data = response.data;
  return data.reverse();
};

export const getLoggedUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
  return response;
};

export const getUserWithId = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/user/profile/${id}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
  return response;
};

export const getAllDoctors = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/doctor/doctors`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
  const data = response.data;
  return data.reverse();
};

export const getDoctorsWithIds = async (doctorIds: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/doctor/doctors`,
    { doctorIds },
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
  const data = response.data;
  return data;
};

export const getDoctorWithId = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/doctor/doctor/${id}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const getAllTests = async (status: any) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/test/status/${status || "all"}`,
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
  const data = response.data;
  return data.reverse();
};

export const countAll = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/count`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
  const data = response.data;
  return data;
};

export const getAllAvailableTestsWithIds = async (ids: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/available-test/by-ids`,
    { ids },
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
  const data = response.data;
  return data;
};

export const getAllAvailableTests = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/available-test/all`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
  const data = response.data;
  return data.reverse();
};
export const getWebsite = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/website`);
  const data = response.data;
  console.log(data);
  return data as Website;
};

export const getAllReports = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/report/`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
  const data = response.data;
  return data.reverse();
};

export const getAllMER = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/mer/`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
  const data = response.data;
  return data.reverse();
};

export const getAllMERAppointments = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/mer/appointments-by-status/all`,
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
  const data = response.data;
  return data.reverse();
};
