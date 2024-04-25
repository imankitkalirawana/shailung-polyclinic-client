import axios from "axios";
import { API_BASE_URL } from "./config";
import { toast } from "sonner";

export const DeleteFile = async (file: string) => {
    try {
        await axios.delete(`${API_BASE_URL}/api/upload/${file}`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then((response) => {
            console.log(response.data);
        })
    } catch (error) {
        console.error(error);
    }
}

export const UploadSingleFile = async (file: File, filename: string) => {
    try {
        const formData = new FormData();
        formData.append("file", file, filename);
        const response = await axios.post(`${API_BASE_URL}/api/upload/single`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: localStorage.getItem("token")
            }
        });
        console.log("File uploaded successfully", response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const UploadMultipleFiles = async (files: FileList, filename: any[]) => {
    try {
        const formData = new FormData();
        // filename = "report"
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i], filename[i]);
        }
        const response = await axios.post(`${API_BASE_URL}/api/upload/`, formData, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        });
        console.log("Files uploaded successfully", response);
        return response.data;
    } catch (error) {
        console.error(error);
        toast.error("Failed to upload files");
        return null;
    }
}
