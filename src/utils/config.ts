export const API_BASE_URL = "http://localhost:3000";
// export const API_BASE_URL = "https://backend.shailungpolyclinic.com";

export const Roles = [
    {
        value: "admin",
        label: "Admin",
        description: "Admin can manage all the resources of website",
        color: "badge-error"
    },
    {
        value: "member",
        label: "Member",
        description: "Member can manage user profile and appointments",
        color: "badge-warning"
    }, {
        value: "user",
        label: "User",
        description: "User can book appointments and view their profiles",
        color: "badge-primary"
    }, {
        value: "guest",
        label: "Guest",
        description: "Guest can view the website and book appointments",
        color: "badge-neutral"
    }
]

export const TestStatus = [
    {
        value: "booked",
        label: "Booked",
        description: "Test is booked",
        color: "badge-neutral",
        level: 1
    },
    {
        value: "confirmed",
        label: "Confirmed",
        description: "Test is assigned to a doctor",
        color: "badge-info",
        level: 2
    },
    {
        value: "inprogress",
        label: "In Progress",
        description: "Test is in progress",
        color: "badge-secondary",
        level: 3
    },
    {
        value: "paused",
        label: "On Hold",
        description: "Test is on hold",
        color: "badge-warning",
        level: 3
    },
    {
        value: "completed",
        label: "Completed",
        description: "Test is completed",
        color: "badge-success",
        level: 4
    },
    {
        value: "cancelled",
        label: "Cancelled",
        description: "Test is cancelled",
        color: "badge-error",
        level: 5
    },
    {
        value: "overdue",
        label: "Overdue",
        description: "Test is overdue",
        color: "bg-orange-600",
        level: 6
    }
]