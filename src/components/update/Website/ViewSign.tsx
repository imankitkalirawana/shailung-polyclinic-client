import { useFormik } from "formik";
import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";

type reportDetails = {
  docName: string;
  docDesignation: string;
  docReg: string;
  docSign: string;
};
const ViewSign = () => {
  const [processing, setProcessing] = useState(false);
  const formik = useFormik({
    initialValues: {
      reportDetails: [] as reportDetails[],
    },
    onSubmit: async (values) => {
      try {
        setProcessing(true);
        await axios.put(`${API_BASE_URL}/api/doctors/report`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("Message sent successfully");
      } catch (error) {
        toast.error("Error Updating Details");
      } finally {
        setProcessing(false);
      }
    },
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/website/report`);
        formik.setValues({
          reportDetails: response.data,
        });
      } catch (error) {
        toast.error("Error Updating Details");
      }
    };
    fetchReport();
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        const updatedReport = [...formik.values.reportDetails];
        updatedReport[index] = {
          ...updatedReport[index],
          docSign: imageData,
        };
        formik.setValues({
          ...formik.values,
          reportDetails: updatedReport,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-base-content">
              Report Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-base-neutral">
              Update information displayed on the report.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 select-none">
          {formik.values.reportDetails.map((report, index) => (
            <div
              key={index}
              className="flex items-center col-span-full md:col-span-1 max-w-2xl p-4 bg-base-300 card md:flex-row"
            >
              <img
                src={report.docSign}
                className="object-contain w-auto aspect-square h-48 card mix-blend-darken"
              />
              <div className="p-8">
                <div className="block mb-3">
                  <label htmlFor="doc-name" className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    name="doc-name"
                    id="doc-name"
                    type="text"
                    className="input input-bordered bg-transparent w-full"
                    value={report.docName}
                    onChange={(e) => {
                      const updatedReport = [...formik.values.reportDetails];
                      updatedReport[index] = {
                        ...updatedReport[index],
                        docName: e.target.value,
                      };
                      formik.setValues({
                        ...formik.values,
                        reportDetails: updatedReport,
                      });
                    }}
                  />
                </div>
                <label htmlFor="docDesignation-1" className="label">
                  <span className="label-text">Designation</span>
                </label>
                <input
                  name="docDesignation-1"
                  id="docDesignation-1"
                  type="text"
                  className="input input-bordered bg-transparent w-full"
                  value={report.docDesignation}
                  onChange={(e) => {
                    const updatedReport = [...formik.values.reportDetails];
                    updatedReport[index] = {
                      ...updatedReport[index],
                      docDesignation: e.target.value,
                    };
                    formik.setValues({
                      ...formik.values,
                      reportDetails: updatedReport,
                    });
                  }}
                />
                <label htmlFor="docReg-1" className="label">
                  <span className="label-text">Registration Number</span>
                </label>
                <input
                  name="docReg-1"
                  id="docReg-1"
                  type="text"
                  className="input input-bordered bg-transparent w-full"
                  value={report.docReg}
                  onChange={(e) => {
                    const updatedReport = [...formik.values.reportDetails];
                    updatedReport[index] = {
                      ...updatedReport[index],
                      docReg: e.target.value,
                    };
                    formik.setValues({
                      ...formik.values,
                      reportDetails: updatedReport,
                    });
                  }}
                />

                <label
                  className="btn btn-outline mt-4 hover:btn-primary btn-sm"
                  htmlFor={`doc-image-${index}`}
                >
                  <span>Change Sign</span>
                </label>
                <input
                  type="file"
                  name="doc-image"
                  accept="image/png"
                  id={`doc-image-${index}`}
                  className="hidden"
                  onChange={(e) => handleFileChange(e, index)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 justify-end mt-12">
          <a href="/dashboard" className="btn btn-sm">
            Cancel
          </a>
          <button
            className="btn btn-primary btn-sm"
            type="submit"
            disabled={processing}
          >
            {processing ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default ViewSign;
