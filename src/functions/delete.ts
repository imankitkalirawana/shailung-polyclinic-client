import axios from "axios";
import { API_BASE_URL } from "../utils/config";

export const deleteUser = async (userId: string) => {
    await axios.delete(`${API_BASE_URL}/api/admin/user/${userId}`, {
        headers: {
            Authorization: `${localStorage.getItem("token")}`,
        },
    });
}

export const deleteSelf = async () => {
    await axios.delete(`${API_BASE_URL}/api/user/profile`, {
        headers: {
            Authorization: `${localStorage.getItem("token")}`,
        },
    });
}

