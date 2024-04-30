import axios from "axios";
import { useFormik } from "formik";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { API_BASE_URL } from "../../../utils/config";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UploadSingleFile } from "../../../utils/FileHandling";

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
        <form className="px-4 sm:px-0" onSubmit={formik.handleSubmit}>
          <div className="pb-12">
            <h1 className="text-base font-semibold leading-7 text-base-content">
              Update Doctor Information
            </h1>
            <p className="mt-1 text-sm leading-6 text-base-neutral">
              Update doctor's information displayed on the website.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="name" className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    className="input input-bordered w-full"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="email" className="label">
                  <span className="label-text">Email address</span>
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="input input-bordered w-full"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                </div>
              </div>
              <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                <label htmlFor="phone" className="label">
                  <span className="label-text">Phone</span>
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    className="input input-bordered w-full"
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    required
                  />
                </div>
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label htmlFor="designation" className="label">
                  <span className="label-text">Designation</span>
                </label>
                <input
                  id="designation"
                  name="designation"
                  type="text"
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.designation}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="regno" className="label">
                  <span className="label-text">Reg. No</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="regno"
                    id="regno"
                    className="input input-bordered w-full"
                    onChange={formik.handleChange}
                    value={formik.values.regno}
                  />
                </div>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="sign" className="label">
                  <span className="label-text">Signature</span>
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    name="sign"
                    id="sign"
                    className="file-input file-input-bordered w-full"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e)}
                  />
                </div>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="label">
                  <span className="label-text">Sign Preview</span>
                </label>
                <div className=" bg-base-300 rounded-xl w-fit">
                  <img
                    src={
                      formik.values.previewSign
                        ? formik.values.previewSign
                        : `${API_BASE_URL}/api/upload/single/${formik.values.sign}`
                    }
                    className="object-contain w-auto aspect-square h-48 card mix-blend-darken"
                    alt={formik.values.name}
                    title="profile"
                    width={40}
                    height={40}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="divider my-10"></div>
          <div className="mt-6 flex items-center justify-end gap-2">
            <button type="submit" className="btn btn-primary btn-sm">
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Doctor;
