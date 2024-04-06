import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import toast from "react-hot-toast";

export const deleteUser = async (userId: string) => {
    try {
        await axios.delete(`${API_BASE_URL}/api/user/${userId}`, {
            headers: {
                Authorization: `${localStorage.getItem("token")}`,
            },
        });
        toast.success("User Deleted Successfully");
    } catch (error) {
        console.log(error);
        toast.error("Failed to Delete User!");
    }
}

