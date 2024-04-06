import axios from "axios";
import { API_BASE_URL } from "../utils/config";

export const getAllUsers = async (role: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/admin/users/${role}`, {
        headers: {
            Authorization: `${localStorage.getItem("token")}`,
        },
    });
    const data = response.data;
    return data;
}

export const getLoggedUser = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: {
            Authorization: `${localStorage.getItem("token")}`,
        },
    });
    return response;
}

export const getAllDoctors = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/user/doctors`, {
        headers: {
            Authorization: `${localStorage.getItem("token")}`,
        },
    });
    const data = response.data;
    return data;

}

export const getAllTests = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/test/all`, {
        headers: {
            Authorization: `${localStorage.getItem("token")}`,
        },
    });
    return response;
}

export const countAll = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/count`, {
        headers: {
            Authorization: `${localStorage.getItem("token")}`,
        },
    });
    const data = response.data;
    return data;
}

export const getAllAvailableTests = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/available-test/all`, {
        headers: {
            Authorization: `${localStorage.getItem("token")}`,
        },
    });
    const data = response.data;
    return data;
}
export const getWebsite = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/website`);
    const data = response.data;
    return data;
}

