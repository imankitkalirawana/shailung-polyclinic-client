import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../../../utils/config";
import { PlusIcon, XIcon } from "../../icons/Icons";
import { isLoggedIn } from "../../../utils/auth";
import { getAllDoctors } from "../../../functions/get";
import { Doctor } from "../../../interface/interface";

const EditAvailableTest = () => {
  const { user } = isLoggedIn();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "member") {
      navigate("/dashboard");
    }
  }, [user]);
  const { id }: any = useParams();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(
        `${API_BASE_URL}/api/available-test/${id}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      formik.setValues(data);
      const res2 = await getAllDoctors();
      setDoctors(res2);
    };
    fetchUser();
  }, []);

  const formik = useFormik({
    initialValues: {
      _id: "",
      name: "",
      description: "",
      price: "0",
      duration: "",
      status: "active",
      doctors: [] as string[],
      testProps: Array.from({ length: 1 }, () => ({
        investigation: "",
        referenceValue: "",
        unit: "",
      })),
    },
    validate: (values) => {
      const errors: any = {};
      if (values.doctors.length === 0) {
        errors.doctors = "Select atleast one doctor";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await axios.put(`${API_BASE_URL}/api/available-test/${id}`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("Updated Successfully");
        // navigate("/dashboard/tests/available-tests");
      } catch (error: any) {
        console.log(error.message);
        toast.error(error.message);
      }
    },
  });

  const addNewRow = () => {
    formik.setValues((prevValues) => ({
      ...prevValues,
      testProps: [
        ...prevValues.testProps,
        {
          investigation: "",
          referenceValue: "",
          unit: "",
        },
      ],
    }));
  };

  const removeRow = (index: number) => {
    formik.setValues((prevValues) => ({
      ...prevValues,
      testProps: prevValues.testProps.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-base font-semibold leading-7 text-base-content"
                data-tip="Test Title"
              >
                Test Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-base-neutral">
                Update your Test information.
              </p>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={formik.isSubmitting}
            >
              Update
            </button>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="name" className="label">
                <span className="label-text">Name</span>
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
            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="price" className="label">
                <span className="label-text">Price</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="price"
                  id="price"
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.price}
                />
              </div>
            </div>
            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="duration" className="label">
                <span className="label-text">Duration</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="duration"
                  id="duration"
                  autoComplete="duration"
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.duration}
                />
              </div>
            </div>

            <div className="col-span-6">
              <label htmlFor="description" className="label">
                <span className="label-text">Description</span>
              </label>
              <div className="mt-2">
                <input
                  id="description"
                  name="description"
                  type="text"
                  className="textarea textarea-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
              </div>
            </div>
            <div className="col-span-6 md:col-span-2">
              <label htmlFor="status" className="label">
                <span className="label-text">Status</span>
              </label>
              <div className="mt-2">
                <select
                  id="status"
                  name="status"
                  className="select select-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.status}
                >
                  <option value="active">Available</option>
                  <option value="inactive">Not Available</option>
                </select>
              </div>
            </div>
            <div className="col-span-2">
              <label htmlFor="doctors" className="label">
                <span className="label-text">Doctors</span>
              </label>
              <div className="max-h-48 overflow-y-scroll">
                {doctors.map((doctor: Doctor, index) => (
                  <div className="form-control" key={index}>
                    <label
                      key={doctor._id}
                      className="cursor-pointer label flex-row-reverse justify-end gap-2"
                    >
                      <span className="label-text">{doctor.name}</span>
                      <input
                        type="checkbox"
                        className="checkbox"
                        name="doctors"
                        value={doctor._id}
                        onChange={formik.handleChange}
                        checked={formik.values.doctors.includes(
                          doctor._id as string
                        )}
                      />
                    </label>
                  </div>
                ))}
                {formik.errors.doctors && (
                  <label htmlFor="doctors" className="label">
                    <span className="label-text text-error">
                      {formik.errors.doctors}
                    </span>
                  </label>
                )}
              </div>
            </div>
            <div className="form-control col-span-full">
              <label htmlFor="testProps" className="label">
                <span className="label-text">Test Properties</span>
              </label>
              <div className="flex flex-col">
                <div className="border rounded-lg overflow-hidden border-base-content/30">
                  <table className="divide-y divide-base-content w-full">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium uppercase"
                        >
                          Investigation
                        </th>
                        <th
                          scope="col"
                          className="text-start text-xs font-medium uppercase"
                        >
                          Reference Value
                        </th>
                        <th
                          scope="col"
                          className="text-start text-xs font-medium uppercase"
                        >
                          Unit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-content/30">
                      {formik.values.testProps.map((testProp, index) => (
                        <tr
                          key={index}
                          className="divide-x divide-base-content/30 group"
                        >
                          <td className="whitespace-nowrap text-sm font-medium">
                            <input
                              type="text"
                              className="input focus:outline-none rounded-none w-full"
                              name={`testProps[${index}].investigation`}
                              id="investigation"
                              placeholder="Hemoglobin"
                              onChange={formik.handleChange}
                              value={testProp.investigation}
                            />
                          </td>
                          <td className="whitespace-nowrap text-sm font-medium">
                            <input
                              type="text"
                              className="input focus:outline-none rounded-none w-full"
                              name={`testProps[${index}].referenceValue`}
                              id="referenceValue"
                              placeholder="13.0 - 17.0"
                              onChange={formik.handleChange}
                              value={testProp.referenceValue}
                            />
                          </td>
                          <td className="whitespace-nowrap text-end text-sm font-medium flex items-center">
                            <input
                              type="text"
                              className="input focus:outline-none rounded-none w-full"
                              name={`testProps[${index}].unit`}
                              id="unit"
                              placeholder="g/dL"
                              onChange={formik.handleChange}
                              value={testProp.unit}
                            />
                            {formik.values.testProps.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRow(index)}
                                className="btn btn-sm btn-ghost btn-circle opacity-0 mr-1 group-hover:opacity-100"
                              >
                                <XIcon className="w-5 h-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={addNewRow}
                    className="btn btn-sm hover:btn-primary btn-circle tooltip tooltip-bottom flex items-center justify-center tooltip-primary"
                    data-tip="Add Row"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditAvailableTest;
