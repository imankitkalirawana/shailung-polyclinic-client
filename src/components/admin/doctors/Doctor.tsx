import axios from "axios";
import { useFormik } from "formik";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { API_BASE_URL } from "../../../utils/config";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UploadSingleFile } from "../../../utils/FileHandling";
import { Button, Card, Image, Input } from "@nextui-org/react";

const Doctor = () => {
  const { id }: any = useParams();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/doctor/doctor/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        formik.setValues({
          ...formik.values,
          name: data.name,
          designation: data.designation,
          regno: data.regno,
          email: data.email,
          phone: data.phone,
          sign: data.sign,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctor();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      designation: "",
      regno: "",
      email: "",
      phone: "",
      sign: "",
      previewSign: "",
    },
    onSubmit: async (values) => {
      try {
        if (file) {
          const filename = values.sign;
          await UploadSingleFile(file, filename);
          values.sign = filename;
        }
        await axios.put(`${API_BASE_URL}/api/doctor/doctor/${id}`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("Doctor Information Updated");
      } catch (error) {
        toast.error("Error Updating Details");
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile: File = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        formik.setValues({
          ...formik.values,
          previewSign: imageData,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage {`${formik.values.name}`} - Shailung Polyclinic</title>
        <meta
          name="description"
          content={`Manage ${formik.values.name}'s information on Shailung Polyclinic in Itahari, Nepal`}
        />
        <meta
          name="keywords"
          content="Shailung Polyclinic, Shailung, Polyclinic, Hospital, Clinic, Health, Health Care, Medical, Medical Care, Itahari, Nepal, User, User Information, User Details, User Profile, User Profile Information, User Profile Details, User Profile Information Details, User Profile Information Details Page, User Profile Information Details Page of Shailung Polyclinic, User Profile Information Details Page of Shailung Polyclinic in Itahari, User Profile Information Details Page of Shailung Polyclinic in Itahari, Nepal, Shailung Polyclinic User Profile Information Details Page, Shailung Polyclinic User Profile Information Details Page in Itahari, Shailung Polyclinic User Profile Information Details Page in Itahari, Nepal"
        />
        <link
          rel="canonical"
          href={`https://report.shailungpolyclinic.com/admin/user/${id}/edit`}
        />
      </Helmet>
      <div className="col-span-full lg:col-span-9">
        <Card
          className="p-4"
          as={"form"}
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold leading-7 text-base-content">
                Update Doctor Information
              </h1>
              <p className="mt-1 text-sm leading-6 text-base-neutral">
                Update doctor's information displayed on the website.
              </p>
            </div>
            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              isDisabled={formik.isSubmitting}
              variant="flat"
              color="primary"
            >
              Update
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-6 sm:col-span-3">
              <Input
                type="text"
                name="name"
                id="name"
                label="Full Name"
                placeholder="Enter Doctor's Name"
                autoComplete="given-name"
                onChange={formik.handleChange}
                value={formik.values.name}
                isRequired
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter Email Address"
                autoComplete="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                isRequired
              />
            </div>
            <div className="col-span-6 sm:col-span-3 lg:col-span-3">
              <Input
                id="phone"
                name="phone"
                type="text"
                label="Phone Number"
                placeholder="Enter Phone Number"
                autoComplete="tel"
                onChange={formik.handleChange}
                value={formik.values.phone}
                isRequired
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <Input
                id="designation"
                name="designation"
                type="text"
                label="Designation"
                placeholder="Enter Designation"
                onChange={formik.handleChange}
                value={formik.values.designation}
                isRequired
                fullWidth
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <Input
                type="text"
                name="regno"
                id="regno"
                label="Registration Number"
                placeholder="Enter Registration Number"
                onChange={formik.handleChange}
                value={formik.values.regno}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="sign"
                className="w-full flex items-center justify-center"
              >
                <div
                  tabIndex={0}
                  className="grid w-full focus:outline-none overflow-hidden relative bg-default-100 hover:bg-default-200 rounded-lg p-2"
                >
                  <div className="relative w-full cursor-pointer ">
                    <div
                      className="w-full rounded-lg duration-300 ease-in-out border-default-900 outline-dashed"
                      role="presentation"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                        <svg
                          className="w-8 h-8 mb-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-1 text-sm">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs">SVG, PNG or JPG</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="w-full px-1"
                    aria-description="content file holder"
                  >
                    <input
                      type="file"
                      name="sign"
                      id="sign"
                      className="file-input file-input-bordered w-full"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e)}
                      hidden
                    />
                  </div>
                </div>
              </label>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="label">
                <span className="label-text">Sign Preview</span>
              </label>
              <div className="bg-white rounded-xl w-fit shadow-lg">
                <Image
                  src={
                    formik.values.previewSign
                      ? formik.values.previewSign
                      : `${API_BASE_URL}/api/upload/single/${formik.values.sign}`
                  }
                  className="object-contain w-auto aspect-square h-48 card mix-blend-darken"
                  alt={formik.values.name}
                  title="profile"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Doctor;
