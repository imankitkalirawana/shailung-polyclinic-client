import { Link, useNavigate } from "react-router-dom";
import {
  AppWindowIcon,
  LeftAngle,
  MicroscopeIcon,
  RightAngle,
  UsersGroup,
  UsersIcon,
} from "../icons/Icons";
import { useEffect, useState } from "react";
import { Roles, TestStatus } from "../../utils/config";
import { isLoggedIn } from "../../utils/auth";
import {
  countAll,
  getAllAvailableTests,
  getAllTests,
  getAllUsers,
} from "../../functions/get";
import { toast } from "sonner";

interface User {
  _id: string;
  username: string;
  photo: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  address: string;
  updatedat: string;
}

interface Test {
  _id: string;
  testid: string;
  userid: string;
  doneby: string;
  status: string;
  isDone: boolean;
  updatedat: string;
  addeddate: string;
  testDetail: {
    testData: {
      _id: string;
      name: string;
      price: number;
      duration: number;
    };
    userData: {
      _id: string;
      username: string;
      name: string;
      email: string;
      phone: string;
    };
    doctorData: {
      _id: string;
      username: string;
      name: string;
      email: string;
      phone: string;
    };
  };
}

interface AvailableTest {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status: string;
  addeddate: string;
  updatedat: string;
}

const humanReadableDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { loggedIn, user } = isLoggedIn();
  const [countData, setCountData] = useState<any>({}); // [1

  const [users, setUsers] = useState<User[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [availabletests, setAvailableTests] = useState<AvailableTest[]>([]);

  useEffect(() => {
    if (!loggedIn || user?.role !== "admin") {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getAllUsers();
        setUsers(users);
        const tests = await getAllTests();
        setTests(tests.data);
        const availabletests = await getAllAvailableTests();
        setAvailableTests(availabletests);
        const count = await countAll();
        setCountData(count);
      } catch (error) {
        toast.error("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <main>
        <div className="container grid">
          <div className="mb-4">
            <h2 className="text-base font-semibold leading-7 text-base-content">
              Dashboard
            </h2>
            <p className="mt-1 text-sm leading-6 text-base-neutral">
              Welcome back, {user?.username}
            </p>
          </div>
          <Link
            className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-content-100 bg-primary/10 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple"
            to="website"
          >
            <div className="flex items-center">
              <AppWindowIcon className="w-5 h-5 mr-2 text-primary" />
              <span>You can update your website data here</span>
            </div>
            <span
              className="link inline-flex text-nowrap text-primary"
              role="button"
            >
              Update Now
            </span>
          </Link>
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            <Link
              to={"/dashboard/users?type=user"}
              className="flex items-center p-4 shadow-xs bg-primary/10 card flex-row hover:bg-gradient-to-br from-primary/20 to-secondary/30 transition-all"
            >
              <div className="p-3 mr-4 bg-primary rounded-full text-base-100">
                <UsersIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Total users</p>
                <p className="text-lg font-semibold">
                  {users.length -
                    users.filter(
                      (user) => user.role === "admin" || user.role == "member"
                    ).length || 0}
                </p>
              </div>
            </Link>
            <Link
              to={"/dashboard/tests"}
              className="flex items-center p-4 shadow-xs bg-primary/10 card flex-row hover:bg-gradient-to-br from-primary/20 to-secondary/30 transition-all"
            >
              <div className="p-3 mr-4 text-base-100 rounded-full bg-primary">
                <MicroscopeIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Test done</p>
                <p className="text-lg font-semibold">
                  {countData.testCount || 0}
                </p>
              </div>
            </Link>
            <Link
              to="/dashboard/users?type=employee"
              className="flex items-center p-4 shadow-xs bg-primary/10 card flex-row hover:bg-gradient-to-br from-primary/20 to-secondary/30 transition-all"
            >
              <div className="p-3 mr-4 rounded-full bg-primary text-base-100">
                <UsersGroup className="w-5 h-5" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Total Employee</p>
                <p className="text-lg font-semibold">
                  {/* filter users with role as "admin" */}
                  {users.filter(
                    (user) => user.role === "admin" || user.role == "member"
                  ).length - 1 || 0}
                </p>
              </div>
            </Link>
            <Link
              to="/dashboard/tests/available-tests"
              className="flex items-center p-4 shadow-xs bg-primary/10 card flex-row hover:bg-gradient-to-br from-primary/20 to-secondary/30 transition-all"
            >
              <div className="p-3 mr-4 text-base-100 rounded-full bg-primary">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Available Tests</p>
                <p className="text-lg font-semibold">
                  {countData.availableTestCount || 0}
                </p>
              </div>
            </Link>
          </div>
          <UserCard users={users} />
          <div className="divider"></div>
          <TestCard tests={tests} />
          <div className="divider"></div>
          <AvailableTestCard tests={availabletests} />
        </div>
      </main>
    </>
  );
};

interface UserCardProps {
  users: User[];
}

const UserCard = ({ users }: UserCardProps) => {
  const offset = 5;
  const [initialItem, setInitialItem] = useState(0);
  const [finalItem, setFinalItem] = useState(offset);
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full overflow-hidden card shadow-xs">
        <div className="flex justify-between items-center">
          <h2 className="my-6 text-2xl font-semibold">Users</h2>
          <Link
            to="/dashboard/users"
            className="btn btn-outline hover:btn-primary btn-sm"
          >
            <span>View all</span>
          </Link>
        </div>
        <div
          className={`w-full overflow-x-auto card ${
            users.length > 0 && "rounded-b-none"
          }`}
        >
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left uppercase border-b bg-primary/20">
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="bg-primary/10 divide-y">
              {users.slice(initialItem, finalItem).map(
                (user, index) =>
                  user.username !== "divinelydeveloper" && (
                    <tr
                      key={index}
                      className="cursor-pointer hover:bg-primary/5"
                      role="button"
                      onClick={() => {
                        navigate(`/dashboard/users/${user._id}`);
                      }}
                    >
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`badge tooltip tooltip-right ${
                            Roles.find((role) => role.value === user.role)
                              ?.color
                          }`}
                          data-tip={
                            Roles.find((role) => role.value === user.role)
                              ?.label
                          }
                        ></span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-sm">
                          <div>
                            <p className="font-semibold text-nowrap">
                              {user.name}
                            </p>
                            <p className="text-xs">{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {user.email ? user.email : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {user.phone ? user.phone : "-"}
                      </td>

                      <td className="px-4 py-3 text-nowrap text-sm">
                        {humanReadableDate(user.updatedat)}
                      </td>
                    </tr>
                  )
              )}
              <tr className="bg-primary/20">
                <td className="px-4 py-3 text-sm" colSpan={4}>
                  Showing {initialItem + 1}-{finalItem} of {users.length - 1}
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
                      if (finalItem < users.length - 1) {
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
      </div>
    </>
  );
};

interface TestCardProps {
  tests: Test[];
}

const TestCard = ({ tests }: TestCardProps) => {
  const offset = 5;
  const [initialItem, setInitialItem] = useState(0);
  const [finalItem, setFinalItem] = useState(offset);
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full overflow-hidden card shadow-xs">
        <div className="flex justify-between items-center">
          <h2 className="my-6 text-2xl font-semibold">Tests</h2>
          <Link
            to="/dashboard/tests"
            className="btn btn-outline hover:btn-primary btn-sm"
          >
            <span>View all</span>
          </Link>
        </div>

        <div
          className={`w-full overflow-x-auto card ${
            tests.length > 0 && "rounded-b-none"
          }`}
        >
          <table className="w-full whitespace-no-wrap">
            {tests.length > 0 ? (
              <>
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left uppercase border-b bg-primary/20">
                    <th className="px-4 py-3 hover:bg-primary/10">Status</th>
                    <th className="px-4 py-3 hover:bg-primary/10">Test</th>
                    <th className="px-4 py-3 hover:bg-primary/10">Patient</th>
                    <th className="px-4 py-3 hover:bg-primary/10">
                      Patient Phone
                    </th>
                    <th className="px-4 py-3 hover:bg-primary/10">Doctor</th>
                    <th className="px-4 py-3 hover:bg-primary/10">Added On</th>
                  </tr>
                </thead>
                <tbody className="bg-primary/10 divide-y">
                  {tests.slice(initialItem, finalItem).map((test, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer hover:bg-primary/5"
                      role="button"
                      onClick={() => {
                        navigate(`/dashboard/test/${test._id}`);
                      }}
                    >
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`badge tooltip tooltip-right ${
                            TestStatus.find(
                              (status) => status.value === test.status
                            )?.color
                          } ${
                            TestStatus.find(
                              (status) => status.value === test.status
                            )?.value
                          }`}
                          data-tip={
                            TestStatus.find(
                              (status) => status.value === test.status
                            )?.label
                          }
                        ></span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-sm">
                          <div>
                            <p className="font-semibold">
                              {test.testDetail.testData.name}
                            </p>
                            <p className="text-xs"></p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {test.testDetail.userData.name}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {test.testDetail.userData.phone}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {test.testDetail.doctorData
                          ? test.testDetail.doctorData.name
                          : "Not Assigned"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {humanReadableDate(test.updatedat)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-primary/20">
                    <td className="px-4 py-3 text-sm" colSpan={5}>
                      Showing {initialItem + 1}-{finalItem} of {tests.length}
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
                  <td className="px-4 py-3 text-sm">No tests done so far!</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

interface AvailableTestCardProps {
  tests: AvailableTest[];
}

export const AvailableTestCard = ({ tests }: AvailableTestCardProps) => {
  const offset = 5;
  const [initialItem, setInitialItem] = useState(0);
  const [finalItem, setFinalItem] = useState(offset);
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full overflow-hidden card shadow-xs">
        <div className="flex justify-between items-center">
          <h2 className="my-6 text-2xl font-semibold">
            Available Tests in Lab
          </h2>
          <Link
            to="/dashboard/tests/available-tests"
            className="btn btn-outline hover:btn-primary btn-sm"
          >
            <span>View all</span>
          </Link>
        </div>

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
                  </tr>
                </thead>
                <tbody className="bg-primary/10 divide-y">
                  {tests
                    .reverse()
                    .slice(initialItem, finalItem)
                    .map((test, index) => (
                      <tr
                        key={index}
                        className="cursor-pointer hover:bg-primary/5"
                        role="button"
                        onClick={() => {
                          navigate(
                            `/dashboard/tests/available-tests/${test._id}`
                          );
                        }}
                      >
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`badge tooltip tooltip-right badge-${
                              test.status === "active" ? "success" : "error"
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
                        <td className="px-4 py-3 text-sm max-w-48 text-ellipsis overflow-hidden whitespace-nowrap">
                          {test.description}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {test.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className="px-4 py-3 text-sm">{test.duration}</td>

                        <td className="px-4 py-3 text-sm">
                          {humanReadableDate(test.updatedat)}
                        </td>
                      </tr>
                    ))}
                  <tr className="bg-primary/20">
                    <td className="px-4 py-3 text-sm" colSpan={5}>
                      Showing {initialItem + 1}-{finalItem} of {tests.length}
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
                  <td className="px-4 py-3 text-sm">No tests available!</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;