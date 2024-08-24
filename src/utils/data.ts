import { getWebsite } from "../functions/get";


export const data =  await getWebsite() || {
        title: "Prvaha Polyclinic Services",
        description: "Prvaha Polyclinic Services is a service provider for polyclinic services",
        address: "Nepal",
        email: "info@prvaha.com",
        phone: "+977-9841234567",
        keywords: "Polyclinic Services"
    }


