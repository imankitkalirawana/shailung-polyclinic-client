import axios from "axios";
import { API_BASE_URL } from "../utils/config";

export const getTestStats = async (timeframe: string, starttime?: any, endtime?: any) => {
    const response = await axios.post(`${API_BASE_URL}/api/count/test/stats/`, {
        timeframe,
        starttime,
        endtime
    }, {
        headers: {
            Authorization: `${localStorage.getItem("token")}`,
        },
    })
    return response;
}