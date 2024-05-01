import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { isLoggedIn } from "../../../utils/auth";
import { Doctor } from "../../../interface/interface";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { getAllDoctors } from "../../../functions/get";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { useFormik } from "formik";
import { UploadSingleFile } from "../../../utils/FileHandling";

const Doctors = () => {
  const { user } = isLoggedIn();
  if (!user || user.role !== "admin") {
    window.location.href = "/auth/login";
  }
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const handleDeleteClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const navigate = useNavigate();
  useEffect(() => {
    const fetchDoctors = async () => {
      const data = await getAllDoctors();
      setDoctors(data);
    };
    fetchDoctors();
  }, []);

  const handleRowClick = (id: string, e: any) => {
    if (
      e.target.classList.contains("button") ||
      e.target.classList.contains("btn") ||
      e.target.classList.contains("modify") ||
      e.target.nodeName.toLowerCase() === "svg" ||
      e.target.nodeName.toLowerCase() === "path"
    ) {
      return;
    }
    navigate(`/dashboard/doctors/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>Doctors - Shailung Polyclinic</title>
        <meta
          name="description"
          content="View all tests and their status. You can also assign doctors, schedule appointments and update status of tests."
        />
        <meta
          name="keywords"
          content="tests, test, status, assign, doctor, schedule, appointment, update, view, view tests, assign doctor, schedule appointment, update status"
        />
        <link
          rel="canonical"
          href={`https://report.shailungpolyclinic.com/admin/tests`}
        />
      </Helmet>
      <div className="container mx-auto p-4">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Doctors</h1>
            <div className="flex gap-2 flex-row-reverse">
              <Link to={"?action=new"} className="btn btn-primary btn-sm">
                New Doctor
              </Link>
            </div>
          </div>
        </div>
        <div className={`w-full card overflow-x-auto overflow-y-hidden mt-12`}>
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide uppercase text-left border-b bg-primary/20">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Reg No</th>
                {user?.role === "admin" && (
                  <th className="px-4 py-3">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-primary/10 divide-y">
              {doctors.map((doctor, index) => (
                <tr
                  key={index}
                  onClick={(e) => handleRowClick(doctor._id, e)}
                  className="cursor-pointer hover:bg-primary/5"
                >
                  <td className="px-4 py-3 text-sm">{doctor.name}</td>
                  <td className="px-4 py-3 text-sm">{doctor.designation}</td>
                  <td className="px-4 py-3 text-sm">{doctor.email}</td>
                  <td className="px-4 py-3 text-sm">{doctor.phone}</td>
                  <td className="px-4 py-3 text-sm">{doctor.regno}</td>
                  {user?.role === "admin" && (
                    <td className="px-4 py-3 text-sm flex items-center gap-4 justify-center modify">
                      <Link
                        to={`/dashboard/doctors/${doctor._id}/edit`}
                        className="btn btn-sm btn-circle tooltip tooltip-info flex items-center justify-center btn-ghost"
                        aria-label="Edit"
                        data-tip="Edit"
                      >
                        <IconEdit className="w-4 h-4 button" />
                      </Link>
                      <button
                        className="btn btn-sm btn-circle flex justify-center items-center tooltip-error tooltip btn-ghost hover:btn-outline"
                        aria-label="Delete"
                        onClick={() => handleDeleteClick(doctor)}
                        data-tip="Delete"
                      >
                        <IconTrash className="w-4 h-4 button" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddUser />
      {selectedDoctor && (
        <DeleteModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          setDoctors={setDoctors}
        />
      )}
    </>
  );
};

interface DeleteModalProps {
  doctor: Doctor;
  onClose: () => void;
  setDoctors: any;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  doctor,
  onClose,
  setDoctors,
}) => {
  const handleDelete = async (doctor: Doctor) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/doctor/doctor/${doctor._id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      toast.success("Doctor deleted successfully");
      fetchDoctors();
      onClose();
    } catch (error: any) {
      console.log(error.response.data);
      toast.error("Error deleting doctor");
    }
  };
  const fetchDoctors = async () => {
    try {
      const doctors = await getAllDoctors();
      setDoctors(doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  return (
    <>
      <div
        className="modal modal-open modal-bottom xs:modal-middle backdrop-blur-sm"
        role="dialog"
      >
        <div className="modal-box w-full sm:max-w-sm">
          <h3 className="font-bold text-lg text-center">
            Delete <i>{doctor.email}</i>
          </h3>
          <p className="py-4">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="modal-action flex flex-col xs:flex-row gap-2">
            <button
              className="btn btn-error flex-1"
              onClick={() => handleDelete(doctor)}
            >
              Delete
            </button>
            <button className="btn flex-1" onClick={onClose}>
              Close!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const AddUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      designation: "",
      regno: "",
      sign: "",
      previewSign: "",
    },

    onSubmit: async (values) => {
      try {
        setIsAdding(true);
        if (values.phone && !values.phone.startsWith("+")) {
          values.phone = "+977" + values.phone;
        }
        if (file) {
          const filename = `sign-${values.email}.${
            file.name.split(".").pop() || "jpg"
          }`;
          await UploadSingleFile(file, filename);
          values.sign = filename;
        }
        await axios.post(`${API_BASE_URL}/api/doctor/doctor`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("Doctor added successfully");
        navigate("/dashboard/doctors");
      } catch (error: any) {
        toast.error(error.response.data.error);
        console.log(error);
      }
      setIsAdding(false);
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
      <input type="checkbox" id="add_user" className="modal-toggle" />
      <div
        className={`modal ${
          action === "new" ? "modal-open" : ""
        } backdrop-blur-sm`}
        role="dialog"
      >
        <div className="modal-box w-full sm:max-w-sm">
          <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
            <form className="w-full max-w-md" onSubmit={formik.handleSubmit}>
              <h3 className="mb-6 text-3xl font-bold text-center">
                Add Doctor
              </h3>
              <div>
                <label htmlFor="name" className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  name="name"
                  id="name"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </div>

              <div className="">
                <label htmlFor="email" className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  name="email"
                  id="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  name="phone"
                  id="phone"
                  placeholder="e.g. +1234567890"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  required
                />
              </div>
              <div>
                <label htmlFor="designation" className="label">
                  <span className="label-text">Designation</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  name="designation"
                  id="designation"
                  onChange={formik.handleChange}
                  value={formik.values.designation}
                  required
                />
              </div>
              <div>
                <label htmlFor="regno" className="label">
                  <span className="label-text">Registration Number</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  name="regno"
                  id="regno"
                  onChange={formik.handleChange}
                  value={formik.values.regno}
                  required
                />
              </div>
              <div>
                <label htmlFor="sign" className="label">
                  <span className="label-text">Signature</span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  name="sign"
                  id="sign"
                  onChange={(e) => handleFileChange(e)}
                  accept="image/*"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Sign Preview</span>
                </label>
                <div className="bg-base-300 rounded-xl w-full flex justify-center">
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

              <div className="modal-action flex flex-col xs:flex-row gap-2">
                <button
                  className="btn btn-primary flex-1"
                  type="submit"
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <>
                      <span className="loading loading-dots loading-sm"></span>
                    </>
                  ) : (
                    "Add Doctor"
                  )}
                </button>
                <button
                  className="btn flex-1"
                  type="button"
                  onClick={() => {
                    const url = location.pathname;
                    url.replace("?action=new", "");
                    navigate(url);
                  }}
                >
                  Cancel!
                </button>
              </div>
            </form>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="add_user">
          Close
        </label>
      </div>
    </>
  );
};

export default Doctors;
