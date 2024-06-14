import { isLoggedIn } from "../../../utils/auth";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import ViewSign from "./ViewSign";
import { useFormik } from "formik";
import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";
import { toast } from "sonner";
import { getWebsite } from "../../../functions/get";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Textarea,
} from "@nextui-org/react";

// get domain name from url

const Website = () => {
  const { loggedIn, user } = isLoggedIn();
  useEffect(() => {
    if (!loggedIn || user?.role !== "admin") {
      window.location.href = "/auth/login";
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWebsite();
        formik.setValues({
          title: data.title,
          email: data.email,
          phone: data.phone,
          description: data.description,
          address: data.address,
        });
      } catch (error) {
        toast.error("Error Updating Details");
      }
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      email: "",
      phone: "",
      description: "",
      address: "",
    },
    onSubmit: async (values) => {
      try {
        await axios.put(`${API_BASE_URL}/api/website`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("Website Information Updated");
      } catch (error) {
        toast.error("Error Updating Details");
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>Website - Shailung Polyclinic</title>
        <meta
          name="description"
          content="Get an inside look at the Shailung Polyclinic's website information and team members."
        />
        <meta
          name="keywords"
          content="Shailung Polyclinic, Website, Information, Team, Members, Address, Phone, Email, Description"
        />
        <link
          rel="canonical"
          href="https://report.shailungpolyclinic.com/dashboard/website"
        />
      </Helmet>
      <div>
        <Card
          as={"form"}
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          className="p-4"
        >
          <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
            <p className="text-large">Website Information</p>
          </CardHeader>

          <CardBody className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="eg. Shailung Polyclinic"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                description="This will be displayed on the website header."
              />
            </div>
            <div className="sm:col-span-3">
              <Input
                id="website-email"
                name="email"
                type="text"
                placeholder="eg: contact@shailungpolyclinic.com"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </div>
            <div className="sm:col-span-3">
              <Input
                id="website-phone"
                name="phone"
                type="text"
                placeholder="eg: +977 1234567890"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
            </div>
            <div className="sm:col-span-3">
              <Input
                id="website-address"
                name="address"
                type="text"
                placeholder="eg: Kathmandu, Nepal"
                label="Address"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
            </div>
            <div className="sm:col-span-full">
              <Textarea
                id="website-description"
                name="description"
                placeholder="eg: Shailung Polyclinic is a medical facility that provides various health services to the people of Nepal."
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </div>
          </CardBody>
          <CardFooter className="flex items-center gap-2 justify-end mt-12">
            <Button as={"a"} href="/dashboard" variant="flat">
              Cancel
            </Button>
            <Button
              variant="flat"
              color="primary"
              isLoading={formik.isSubmitting}
              isDisabled={formik.isSubmitting}
              type="submit"
            >
              Update
            </Button>
          </CardFooter>
        </Card>
        <div className="my-8">
          <ViewSign />
        </div>
      </div>
    </>
  );
};

export default Website;
