import { useEffect, useState } from "react";
import { TestStatus } from "../../utils/config";
import { humanReadableDate } from "../admin/user/Users";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { SearchIcon } from "../icons/Icons";
import { isLoggedIn } from "../../utils/auth";

interface Test {
  _id: string;
  status: string;
  addeddate: string;
  appointmentdate: string;
  testDetail: {
    userData: {
      name: string;
      phone: string;
    };
    doctorData: {
      name: string;
    };
    testData: {
      name: string;
    };
  };
}

const History = () => {
  const { loggedIn } = isLoggedIn();
  const [tests, setTests] = useState<Test[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState<Test | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  if (!loggedIn) {
    window.location.href = "/auth/login";
  }

  const handleDeleteClick = (test: Test) => {
    setSelected(test);
    setDeleteModal(true);
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/test/my`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        const data = response.data;
        setTests(data.reverse());
      } catch (error) {
        console.log(error);
      }
    };
    fetchTests();
  }, []);

  const handleSearch = (test: Test) => {
    if (searchQuery === "") return test;
    else if (
      (test.testDetail.userData &&
        test.testDetail.userData.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (test.testDetail.doctorData &&
        test.testDetail.doctorData.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      test.testDetail.testData.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      test.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      humanReadableDate(test.appointmentdate)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="container mx-auto max-w-6xl p-4 my-24">
        <div className="flex justify-between items-center">
          <h2 className="my-6 text-2xl font-semibold">Appointment History</h2>
          <div className="flex gap-2 flex-row-reverse">
            <Link to="/appointment/new" className="btn btn-primary btn-sm">
              New Appointment
            </Link>
          </div>
        </div>
        <div className="mt-10">
          {/* search input */}
          <div className="relative w-full max-w-md mb-4">
            <input
              type="text"
              className="input input-bordered ml-1 w-full"
              placeholder="Search by name, doctor, date, status"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <SearchIcon className="absolute top-3 right-4 w-6 h-6 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.length > 0
              ? tests
                  .filter((test) => {
                    return handleSearch(test);
                  })
                  .map((test) => (
                    <div
                      className={`h-56 ${
                        test.status === "cancelled"
                          ? "from-error/20 to-error/30"
                          : "from-base-300/80 to-base-300"
                      } bg-gradient-to-br  rounded-xl relative shadow-2xl`}
                    >
                      <div className="w-full p-8">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-light text-xs">Name</p>
                            <p className="font-medium">
                              {test.testDetail.userData.name}
                            </p>
                          </div>
                          <div className="badge badge-primary">
                            {test.testDetail.testData.name}
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="font-light text-xs">Doctor</p>
                          <p className="font-medium tracking-more-wider">
                            {test.testDetail.doctorData
                              ? test.testDetail.doctorData.name
                              : "Not Assigned"}
                          </p>
                        </div>
                        <div className="pt-6">
                          <div className="flex justify-between">
                            <p className="font-light text-xs">On</p>
                            <p
                              className={`badge tooltip tooltip-left ${
                                TestStatus.find(
                                  (status) => status.value === test.status
                                )?.color
                              }`}
                              data-tip={test.status}
                              onClick={() => {
                                if (
                                  test.status !== "cancelled" &&
                                  test.status !== "completed"
                                ) {
                                  handleDeleteClick(test);
                                }
                              }}
                            ></p>
                          </div>
                          <p className="font-light text-xs">
                            {test.appointmentdate
                              ? humanReadableDate(test.appointmentdate)
                              : "Not Scheduled Yet"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
              : null}
          </div>
        </div>
      </div>
      {deleteModal && selected && (
        <DeleteModal
          test={selected}
          onClose={() => {
            setDeleteModal(false);
            setSelected(null);
          }}
          setTests={setTests}
          modalDate={{
            title: "Cancel Appointment",
            message: `Are you sure you want to cancel ${selected.testDetail.userData.name}'s ${selected.testDetail.testData.name} appointment?`,
            button: "Cancel Appointment",
          }}
        />
      )}
    </>
  );
};

interface DeleteModalProps {
  test: Test;
  onClose: () => void;
  setTests: any;
  modalDate: {
    title: string;
    message: string;
    button: string;
  };
}

const DeleteModal = ({
  test,
  onClose,
  setTests,
  modalDate,
}: DeleteModalProps) => {
  const handleDelete = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/test/status/${test._id}`,
        {
          status: "cancelled",
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      fetchAllTests();
      onClose();
      toast.success("Appointment Cancelled Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Cancel Appointment!");
    }
  };

  const fetchAllTests = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/test/my`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });
    const data = response.data;
    setTests(data.reverse());
  };

  return (
    <>
      <div className="modal modal-open backdrop-blur-sm" role="dialog">
        <div className="modal-box max-w-sm">
          <h3 className="font-bold text-lg text-center">{modalDate.title}</h3>
          <p className="py-4">{modalDate.message}</p>
          <div className="modal-action flex">
            <button
              className="btn btn-error flex-1 whitespace-nowrap"
              onClick={() => handleDelete()}
            >
              {modalDate.button}
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

export default History;
