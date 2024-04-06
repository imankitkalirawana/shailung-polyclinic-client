import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import toast from "react-hot-toast";

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
            headers: {
                Authorization: `${localStorage.getItem("token")}`,
            },
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.log(error);
        toast.error("Failed to fetch users!");
    }
}