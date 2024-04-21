import { isLoggedIn } from "../../utils/auth";
import { ClockCancel, ClockCheck, MicroscopeIcon } from "../icons/Icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import History from "../appointment/History";
import { IconTestPipe } from "@tabler/icons-react";
import { countAll } from "../../functions/get";
import { Link } from "react-router-dom";

interface Test {
  _id: string;
  status: string;
  addeddate: string;
  appointmentdate: string;
  reportId: string;
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
const UserDashboard = () => {
  const { user } = isLoggedIn();
  const [tests, setTests] = useState<Test[]>([]);
  const [countData, setCountData] = useState<any>({});

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/test/my`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        const count = await countAll();
        setCountData(count);
        const data = response.data;
        setTests(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTests();
  }, []);
  return (
    <>
      <main className="mx-auto max-w-6xl flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-base font-semibold leading-7 text-base-content">
            Welcome back, {user?.username}
          </h1>
        </div>
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4 mt-8">
          <div className="flex items-center p-4 shadow-xs bg-primary/10 card flex-row">
            <div className="p-3 mr-4 text-base-100 rounded-full bg-primary">
              <MicroscopeIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Total Tests</p>
              <p className="text-lg font-semibold">{tests.length || 0}</p>
            </div>
          </div>

          <div className="flex items-center p-4 shadow-xs bg-primary/10 card flex-row">
            <div className="p-3 mr-4 text-base-100 rounded-full bg-primary">
              <ClockCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Completed Tests</p>
              <p className="text-lg font-semibold">
                {tests.filter((test) => test.status === "completed").length}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 shadow-xs bg-primary/10 card flex-row">
            <div className="p-3 mr-4 text-base-100 rounded-full bg-primary">
              <ClockCancel className="w-5 h-5" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Cancelled Tests</p>
              <p className="text-lg font-semibold">
                {tests.filter((test) => test.status === "cancelled").length}
              </p>
            </div>
          </div>
          <Link
            to={"/dashboard/tests/available-tests"}
            className="flex items-center p-4 shadow-xs bg-primary/10 card flex-row hover:bg-gradient-to-br from-primary/20 to-secondary/30 transition-all"
          >
            <div className="p-3 mr-4 text-base-100 rounded-full bg-primary">
              <IconTestPipe className="w-5 h-5" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Available Services</p>
              <p className="text-lg font-semibold">
                {countData?.availableTestCount || 0}
              </p>
            </div>
          </Link>
        </div>
        <div className="-mt-24">
          <History />
        </div>
      </main>
    </>
  );
};

export default UserDashboard;
