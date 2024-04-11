import { useEffect, useState } from "react";
import {
  DownloadIcon,
  LeftAngle,
  RightAngle,
  SearchIcon,
  TrashXIcon,
} from "../../icons/Icons";
import { humanReadableDate } from "../user/Users";
import NotFound from "../../NotFound";
import { getAllReports } from "../../../functions/get";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";

interface Report {
  _id: string;
  name: string;
  doctor: string;
  age: number;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  testname: string;
  testid: string;
  reportDate: string;
  status: string;
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const offset = 10;
  const [initialItem, setInitialItem] = useState<number>(0);
  const [finalItem, setFinalItem] = useState<number>(offset);
  const [selected, setSelected] = useState<Report | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      await getAllReports().then((response) => {
        setReports(response.data);
      });
    };
    fetchData();
  }, []);

  const handleSearch = (report: Report) => {
    if (
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.testname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.status.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return report;
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h1 className="my-6 text-2xl font-semibold">Tests</h1>
            <div className="flex gap-2 flex-row-reverse">
              <button
                className="btn btn-outline btn-sm hover:btn-primary"
                // onClick={() => exportToExcel()}
              >
                Export to Excel
              </button>
            </div>
          </div>
          <div className="relative w-full max-w-md mb-4">
            <input
              type="text"
              className="input input-bordered ml-1 w-full"
              placeholder="Search by name, phone, test, status"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <button className="absolute top-0 -right-1 rounded-l-none btn btn-primary">
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>

          {reports.length > 0 ? (
            <div className={`w-full card overflow-x-auto overflow-y-hidden`}>
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide uppercase text-left border-b bg-primary/20 cursor-pointer">
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Test Name</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-primary/10 divide-y">
                  {reports
                    .filter((report) => {
                      return handleSearch(report);
                    })
                    .reverse()
                    .slice(initialItem, finalItem)
                    .map((report, index) => (
                      <tr
                        key={index}
                        className={`cursor-pointer hover:bg-primary/5`}
                        role="button"
                      >
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`badge tooltip tooltip-right badge-${
                              report.status === "positive" ? "success" : "error"
                            }`}
                            data-tip={
                              report.status === "positive"
                                ? "Positive"
                                : "Negative"
                            }
                          ></span>
                        </td>
                        <td className="px-4 py-3 text-sm">{report.testname}</td>
                        <td className="px-4 py-3 text-sm">{report.name}</td>
                        <td className="px-4 py-3 text-sm">{report.phone}</td>
                        <td className="px-4 py-3 text-sm">{report.address}</td>
                        <td className="px-4 py-3 text-sm">
                          {humanReadableDate(report.reportDate)}
                        </td>
                        <td className="px-4 py-3 text-sm flex items-center justify-center">
                          <Link
                            to={`/report/${report._id}/download`}
                            className="btn btn-sm btn-circle btn-ghost flex items-center justify-center tooltip tooltip-success"
                            data-tip="Download"
                          >
                            <DownloadIcon className="w-4 h-4" />
                          </Link>
                          <div className="divider divider-horizontal mx-0"></div>
                          <button
                            className="btn btn-sm btn-circle btn-ghost flex items-center justify-center tooltip tooltip-error"
                            data-tip="Delete"
                            onClick={() => {
                              setSelected(report);
                              setDeleteModal(true);
                            }}
                          >
                            <TrashXIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  <tr className="bg-primary/20">
                    <td className="px-4 py-3 text-sm" colSpan={6}>
                      Showing {initialItem + 1}-{finalItem} of{" "}
                      {
                        reports.filter((report) => {
                          return handleSearch(report);
                        }).length
                      }
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
                          if (finalItem < reports.length) {
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
              </table>
            </div>
          ) : (
            <NotFound message="No Reports Generated Yet!" />
          )}
        </div>
      </div>

      {deleteModal && selected && (
        <DeleteModal
          report={selected}
          onClose={() => setDeleteModal(false)}
          setReports={setReports}
        />
      )}
    </>
  );
};

interface DeleteModalProps {
  report: Report;
  onClose: () => void;
  setReports: any;
}

const DeleteModal = ({ report, onClose, setReports }: DeleteModalProps) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/report/${report._id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      console.log("Undoing test", report.testid);

      await axios.put(
        `${API_BASE_URL}/api/test/undone/${report.testid}`,
        null,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      await getAllReports().then((response) => {
        setReports(response.data);
      });

      onClose();
      toast.success("Report deleted successfully");
    } catch (error) {
      console.error("Error deleting report:", error);
      // Handle error gracefully, e.g., display a toast message or log it
      toast.error("Failed to delete report");
    }
  };

  return (
    <div className="modal modal-open backdrop-blur-sm" role="dialog">
      <div className="modal-box max-w-sm">
        <h3 className="font-bold text-lg text-center">
          Delete {report.name}'s Report
        </h3>
        <p className="py-4">
          Are you sure you want to delete this test? This action cannot be
          undone.
        </p>
        <div className="modal-action flex">
          <button
            className="btn btn-error flex-1"
            onClick={() => handleDelete()}
          >
            Delete
          </button>
          <button className="btn flex-1" onClick={onClose}>
            Close!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
