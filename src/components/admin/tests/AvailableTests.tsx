import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { humanReadableDate } from "../user/Users";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import {
  EditIcon,
  LeftAngle,
  PlusIcon,
  RightAngle,
  TrashXIcon,
  XIcon,
} from "../../icons/Icons";
import { useFormik } from "formik";
import NotFound from "../../NotFound";

interface Test {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status: string;
  updatedat: string;
  testProps: [
    {
      investigation: string;
      referenceValue: string;
      unit: string;
    }
  ];
}

const AvailableTests = () => {
  const offset = 10;
  const [initialItem, setInitialItem] = useState(0);
  const [finalItem, setFinalItem] = useState(offset);
  const [tests, setTests] = useState<Test[]>([]);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Test | null>(null);
  const handleDeleteClick = (test: Test) => {
    setSelected(test);
  };

  const handleRowClick = (id: string, e: any) => {
    if (
      e.target.classList.contains("button") ||
      e.target.classList.contains("btn") ||
      e.target.classList.contains("modify")
    ) {
      return;
    }
    navigate(`/admin/tests/available-tests/${id}`);
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/available-test/all`
        );
        setTests(response.data);
      } catch (error: any) {
        toast.error(error.response.statusText);
      }
    };
    fetchTests();
  }, []);

  return (
    <>
      <section>
        <div className="w-full overflow-hidden card shadow-xs">
          <div className="flex justify-between items-center">
            <h2 className="my-6 text-2xl font-semibold">Available Tests</h2>
            <label htmlFor="add_test" className="btn btn-primary btn-sm">
              <span>New Test</span>
            </label>
          </div>
          {tests.length > 0 ? (
            <>
              <div className={`w-full overflow-x-auto card`}>
                <table className="w-full whitespace-no-wrap">
                  {tests.length > 0 ? (
                    <>
                      <thead>
                        <tr className="text-xs font-semibold tracking-wide text-left uppercase border-b bg-primary/20">
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Test</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Duration</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Modify</th>
                        </tr>
                      </thead>
                      <tbody className="bg-primary/10 divide-y">
                        {tests
                          .slice(initialItem, finalItem)
                          .reverse()
                          .map((test, index) => (
                            <tr
                              key={index}
                              className="cursor-pointer hover:bg-primary/5"
                              role="button"
                              onClick={(e) => {
                                handleRowClick(test._id, e);
                              }}
                            >
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`badge tooltip tooltip-right badge-${
                                    test.status === "active"
                                      ? "success"
                                      : "error"
                                  }`}
                                  data-tip={
                                    test.status === "active"
                                      ? "Available"
                                      : "Not Available"
                                  }
                                ></span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center text-sm">
                                  <div>
                                    <p className="font-semibold">{test.name}</p>
                                    <p className="text-xs"></p>
                                  </div>
                                </div>
                              </td>
                              <td
                                className="px-4 py-3 text-sm max-w-48 text-ellipsis overflow-hidden whitespace-nowrap"
                                title={test.description}
                              >
                                {test.description}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                NPR{" "}
                                {test.price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {test.duration}
                              </td>

                              <td className="px-4 py-3 text-sm">
                                {humanReadableDate(test.updatedat)}
                              </td>
                              <td className="px-4 py-3 text-sm modify">
                                <Link
                                  to={`/admin/tests/available-tests/${test._id}/edit`}
                                  // to={""}
                                  className="btn btn-sm btn-circle btn-ghost"
                                  aria-label="Edit"
                                >
                                  <EditIcon className="w-4 h-4 button" />
                                </Link>
                                <button
                                  className="btn btn-sm btn-circle btn-ghost hover:btn-outline"
                                  aria-label="Delete"
                                  onClick={() => handleDeleteClick(test)}
                                >
                                  <TrashXIcon className="w-4 h-4 button" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        <tr className="bg-primary/20">
                          <td className="px-4 py-3 text-sm" colSpan={6}>
                            Showing {initialItem + 1}-{finalItem} of{" "}
                            {tests.length}
                          </td>
                          <td className="px-4 py-3 text-sm flex justify-end">
                            <button
                              className="btn btn-sm btn-ghost btn-circle"
                              aria-label="Previous"
                              onClick={() => {
                                if (initialItem > 0) {
                                  setInitialItem(initialItem - offset);
                                  setFinalItem(finalItem - offset);
                                }
                              }}
                            >
                              <LeftAngle className="w-4 h-4 fill-current" />
                            </button>
                            <button
                              className="btn btn-sm btn-ghost btn-circle"
                              aria-label="Next"
                              onClick={() => {
                                if (finalItem < tests.length) {
                                  setInitialItem(initialItem + offset);
                                  setFinalItem(finalItem + offset);
                                }
                              }}
                            >
                              <RightAngle className="w-4 h-4 fill-current" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </>
                  ) : (
                    <tbody className="bg-primary/10 divide-y">
                      <tr>
                        <td className="px-4 py-3 text-sm">
                          No tests available!
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </>
          ) : (
            <NotFound message="No tests available!" />
          )}
        </div>
      </section>
      <AddTest />
      {selected && (
        <DeleteModal
          test={selected}
          onClose={() => setSelected(null)}
          setTests={setTests}
        />
      )}
    </>
  );
};

interface DeleteModalProps {
  test: Test;
  onClose: () => void;
  setTests: any;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  test,
  onClose,
  setTests,
}) => {
  const handleDelete = async (test: Test) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/available-test/${test._id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      await fetchTests();
      toast.success("Test deleted successfully");
      onClose();
    } catch (error: any) {
      console.log(error.response.data);
      toast.error("Error deleting user");
    }
  };
  const fetchTests = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/available-test/all`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      setTests(data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };
  return (
    <>
      <div className="modal modal-open backdrop-blur-sm" role="dialog">
        <div className="modal-box max-w-sm">
          <h3 className="font-bold text-lg text-center">
            Delete <i>{test.name}</i>
          </h3>
          <p className="py-4">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="modal-action flex">
            <button
              className="btn btn-error flex-1"
              onClick={() => handleDelete(test)}
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

const AddTest = () => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      duration: "",
      testProps: Array.from({ length: 1 }, () => ({
        investigation: "",
        referenceValue: "",
        unit: "",
      })),
    },

    onSubmit: async (values) => {
      try {
        setIsAdding(true);
        await axios.post(`${API_BASE_URL}/api/available-test/`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("Test added successfully");
        navigate(0);
      } catch (error: any) {
        toast.error(error.response.data.error);
        console.log(error);
      }
      setIsAdding(false);
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
      <input type="checkbox" id="add_test" className="modal-toggle" />
      <div className="modal backdrop-blur-sm" role="dialog">
        <div className="modal-box max-w-xl">
          <div className="container flex items-center justify-center px-6 mx-auto">
            <form className="w-full max-w-md" onSubmit={formik.handleSubmit}>
              <h3 className="mb-6 text-3xl font-bold text-center">New Test</h3>
              <div className="form-control">
                <label htmlFor="name" className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  name="name"
                  id="name"
                  required
                  placeholder="eg: Blood Test - CBC"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </div>

              <div className="form-control">
                <label htmlFor="description" className="label">
                  <span className="label-text">Description</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  name="description"
                  id="description"
                  placeholder="eg: Complete Blood Count"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
              </div>
              <div className="form-control">
                <label htmlFor="price" className="label">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  name="price"
                  placeholder="eg: NPR 1000"
                  id="price"
                  onChange={formik.handleChange}
                  value={formik.values.price}
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="duration" className="label">
                  <span className="label-text">Duration</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  name="duration"
                  id="duration"
                  placeholder="eg: 1hr 30mins"
                  onChange={formik.handleChange}
                  value={formik.values.duration}
                />
              </div>
              <div className="divider"></div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Test Properties</span>
                  <button
                    type="button"
                    onClick={addNewRow}
                    className="btn btn-sm btn-ghost btn-circle tooltip flex items-center justify-center tooltip-primary"
                    data-tip="Add Row"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
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
                </div>
              </div>

              <div className="modal-action flex flex-col sm:flex-row gap-4">
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
                    "Add Test"
                  )}
                </button>
                <label htmlFor="add_test" className="btn flex-1">
                  Cancel!
                </label>
              </div>
            </form>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="add_test">
          Close
        </label>
      </div>
    </>
  );
};

export default AvailableTests;
