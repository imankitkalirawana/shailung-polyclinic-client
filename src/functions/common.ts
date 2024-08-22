import axios from "axios";
import { API_BASE_URL } from "../utils/config";

export const sendMail = async (data: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/mail`, data);
        return response;
    } catch (error) {
        console.error(error);
    }

}