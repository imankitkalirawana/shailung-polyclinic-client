import { getWebsite } from "../functions/get";

export const data = (await getWebsite()) || {
  title: "Shailung Polyclinic",
  description:
    "Shailung Polyclinic is a service provider for polyclinic services",
  address: "Nepal",
  email: "contact@shailungpolyclinic.com",
  phone: "+977-9841234567",
  keywords: "Polyclinic Services",
  url: "https://report.shailungpolyclinic.com",
};
