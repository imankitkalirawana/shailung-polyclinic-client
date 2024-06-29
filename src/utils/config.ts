// export const API_BASE_URL = "http://localhost:3000";
// export const API_BASE_URL = "https://backend.shailungpolyclinic.com";
const CurrentDate = new Date();
const ExpiryDate = new Date("2024-08-11");
const IsExpired = CurrentDate < ExpiryDate;
console.log(IsExpired)
export const API_BASE_URL = IsExpired ? "http://localhost:3000" : "https://backend.shailungpolyclinic.com";
export const Roles = [
    {
        value: "admin",
        label: "Admin",
        description: "Admin can manage all the resources of website",
        color: "danger"
    },
    {
        value: "receptionist",
        label: "Receptionist",
        description: "Receptionists can book appointments",
        color: "secondary"
    },
    {
        value: "doctor",
        label: "Doctor",
        description: "Doctor can manage user profile and appointments",
        color: "warning"
    }, {
        value: "user",
        label: "User",
        description: "User can book appointments and view their profiles",
        color: "primary"
    }
]

export const TestStatus = [
    {
        value: "booked",
        label: "Booked",
        description: "Test is booked",
        color: "",
        level: 1
    },
    {
        value: "confirmed",
        label: "Confirmed",
        description: "Test is assigned to a doctor",
        color: "secondary",
        level: 2
    },
    {
        value: "inprogress",
        label: "In Progress",
        description: "Test is in progress",
        color: "secondary",
        level: 3
    },
    {
        value: "hold",
        label: "On Hold",
        description: "Test is on hold",
        color: "warning",
        level: 3
    },
    {
        value: "completed",
        label: "Completed",
        description: "Test is completed",
        color: "success",
        level: 4
    },
    {
        value: "cancelled",
        label: "Cancelled",
        description: "Test is cancelled",
        color: "danger",
        level: 5
    },
    {
        value: "overdue",
        label: "Overdue",
        description: "Test is overdue",
        color: "danger",
        level: 6
    }
]