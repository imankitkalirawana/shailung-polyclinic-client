import { Link, useNavigate } from "react-router-dom";
import { CellIcon, MicroscopeIcon, ReportIcon } from "../icons/Icons";
import { useEffect, useState } from "react";
import { Roles, TestStatus } from "../../utils/config";
import { isLoggedIn } from "../../utils/auth";
import {
  countAll,
  getAllAvailableTests,
  getAllReports,
  getAllTests,
  getAllUsers,
} from "../../functions/get";
import { toast } from "sonner";
import { IconArrowRight, IconTestPipe } from "@tabler/icons-react";
import { Test, User, AvailableTest, Report } from "../../interface/interface";
import Overview from "./Overview";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { data } from "../../utils/data";

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
  const [countData, setCountData] = useState<any>({});

  const [users, setUsers] = useState<User[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [availabletests, setAvailableTests] = useState<AvailableTest[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/auth/login");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === "admin") {
          const users = await getAllUsers("all");
          setUsers(users);
        } else {
          const users = await getAllUsers("user");
          setUsers(users);
        }
        const tests = await getAllTests("all");
        setTests(tests);
        const availabletests = await getAllAvailableTests();
        setAvailableTests(availabletests);
        const reports = await getAllReports();
        setReports(reports);
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
        <div className="grid">
          <div className="mb-4">
            <h1 className="text-base font-semibold leading-7 text-base-content capitalize">
              Welcome back, {user?.name}
            </h1>
            <p className="mt-1 text-sm leading-6 text-base-neutral">
              Get an inside look at the {data.title}'s {user?.role} dashboard
              for managing tests, appointments, and more.
            </p>
          </div>
          {user?.role === "admin" && (
            <>
              <Card
                shadow="lg"
                className="mb-8 w-full justify-between flex-row px-8 items-center py-3"
              >
                <p className="text-small text-foreground">
                  You can update your website data here.
                </p>
                <Button as={Link} variant="flat" to="website" size="sm">
                  Update Now
                  <IconArrowRight size={16} />
                </Button>
              </Card>

              <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                <Card
                  isHoverable
                  isPressable
                  shadow="lg"
                  as={Link}
                  to="/dashboard/tests?status=all"
                  className="flex-row items-center p-4 gap-2"
                >
                  <Avatar
                    className="bg-primary text-base-100"
                    showFallback
                    fallback={<CellIcon className="w-5 h-5" />}
                  />
                  <div>
                    <p className="mb-2 text-sm font-medium">Total Tests</p>
                    <p className="text-lg font-semibold">{tests.length || 0}</p>
                  </div>
                </Card>
                <Card
                  isHoverable
                  isPressable
                  shadow="lg"
                  as={Link}
                  className="flex-row items-center p-4 gap-2"
                  to={"/dashboard/tests?status=completed"}
                >
                  <Avatar
                    showFallback
                    className="bg-primary text-base-100"
                    fallback={<MicroscopeIcon className="w-5 h-5" />}
                  />
                  <div>
                    <p className="mb-2 text-sm font-medium">Test done</p>
                    <p className="text-lg font-semibold">
                      {countData.testsDone || 0}
                    </p>
                  </div>
                </Card>

                <Card
                  isHoverable
                  isPressable
                  shadow="lg"
                  as={Link}
                  className="flex-row items-center p-4 gap-2"
                  to="/dashboard/reports"
                >
                  <Avatar
                    showFallback
                    className="bg-primary text-base-100"
                    fallback={<ReportIcon className="w-5 h-5" />}
                  />
                  <div>
                    <p className="mb-2 text-sm font-medium">Reports</p>
                    <p className="text-lg font-semibold">
                      {countData.reports || 0}
                    </p>
                  </div>
                </Card>
                <Card
                  isHoverable
                  isPressable
                  shadow="lg"
                  as={Link}
                  className="flex-row items-center p-4 gap-2"
                  to={"/dashboard/tests/available-tests"}
                >
                  <Avatar
                    showFallback
                    className="bg-primary text-base-100"
                    fallback={<IconTestPipe className="w-5 h-5" />}
                  />
                  <div>
                    <p className="mb-2 text-sm font-medium">
                      Available Services
                    </p>
                    <p className="text-lg font-semibold">
                      {countData?.availableTestCount || 0}
                    </p>
                  </div>
                </Card>
              </div>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="my-6 text-2xl font-semibold">Last Day Stats</h2>
                <Button
                  as={Link}
                  to="/dashboard/stats"
                  endContent={<IconArrowRight size={16} />}
                  variant="bordered"
                >
                  View All
                </Button>
              </div>
              <Overview />
            </>
          )}
          <TestCard tests={tests} />
          {(user?.role === "admin" || user?.role === "doctor") && (
            <ReportCard reports={reports} />
          )}
          {user?.role === "admin" && (
            <>
              <AvailableTestCard tests={availabletests} />
              <UserCard users={users} />
            </>
          )}
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
  const initialItem = 0;
  const finalItem = offset;

  const columns = [
    {
      key: "role",
      label: "Role",
    },
    {
      key: "name",
      label: "User",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "updatedat",
      label: "Date",
    },
  ];

  return (
    <>
      <Card className="mt-8 p-2 bg-transparent" shadow="none">
        <div className="flex justify-between items-center">
          <h2 className="my-6 text-2xl font-semibold">Users</h2>
          <Button
            as={Link}
            to="/dashboard/users"
            endContent={<IconArrowRight size={16} />}
            variant="bordered"
          >
            View All
          </Button>
        </div>

        <Table
          topContent={
            <span className="text-default-400 text-small">
              Total {users.length} users
            </span>
          }
          aria-label="Users"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No rows to display."}
            items={users.slice(initialItem, finalItem)}
          >
            {(user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Chip
                    variant="dot"
                    // @ts-ignore
                    color={
                      Roles.find((role) => role.value === user.role)?.color
                    }
                  >
                    {user.role}
                  </Chip>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{humanReadableDate(user.updatedat)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

interface TestCardProps {
  tests: Test[];
}

const TestCard = ({ tests }: TestCardProps) => {
  const offset = 5;
  const initialItem = 0;
  const finalItem = offset;

  const columns = [
    {
      key: "status",
      label: "Status",
    },
    {
      key: "test",
      label: "Test",
    },
    {
      key: "patient",
      label: "Patient",
    },
    {
      key: "phone",
      label: "Patient Phone",
    },
    {
      key: "addedby",
      label: "Added By",
    },
    {
      key: "addeddate",
      label: "Added On",
    },
  ];

  return (
    <>
      <Card className="mt-8 p-2 bg-transparent" shadow="none">
        <div className="flex justify-between items-center">
          <h2 className="my-6 text-2xl font-semibold">Tests</h2>

          <Button
            as={Link}
            to="/dashboard/tests?status=all"
            endContent={<IconArrowRight size={16} />}
            variant="bordered"
          >
            View All
          </Button>
        </div>

        <Table
          topContent={
            <span className="text-default-400 text-small">
              Total {tests.length} tests
            </span>
          }
          aria-label="Users"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            className="hidden"
            emptyContent={"No rows to display."}
            items={tests.slice(initialItem, finalItem)}
          >
            {(test) => (
              <TableRow key={test._id}>
                <TableCell>
                  <Chip
                    variant="dot"
                    // @ts-ignore
                    color={
                      TestStatus.find((status) => status.value === test.status)
                        ?.color
                    }
                  >
                    {test.status}
                  </Chip>
                </TableCell>
                <TableCell className="space-x-1">
                  {test.testDetail.testData.slice(0, 1).map((data) => {
                    return (
                      <Chip key={data._id} size="sm">
                        {data.name}
                      </Chip>
                    );
                  })}
                  {test.testDetail.testData.length > 1 && (
                    <Tooltip
                      radius="full"
                      content={
                        <div className="flex gap-1">
                          {test.testDetail.testData
                            .slice(1)
                            .map((data, index) => (
                              <Chip key={index} size="sm">
                                {data.name}
                              </Chip>
                            ))}
                        </div>
                      }
                    >
                      <Chip size="sm">
                        +{test.testDetail.testData.length - 1}
                      </Chip>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>{test.testDetail.userData.name}</TableCell>
                <TableCell>{test.testDetail.userData.phone}</TableCell>
                <TableCell>{test.addedby}</TableCell>
                <TableCell>{humanReadableDate(test.updatedat)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

interface AvailableTestCardProps {
  tests: AvailableTest[];
}

export const AvailableTestCard = ({ tests }: AvailableTestCardProps) => {
  const offset = 5;
  const initialItem = 0;
  const finalItem = offset;

  const columns = [
    {
      key: "status",
      label: "Status",
    },
    {
      key: "test",
      label: "Test",
    },
    {
      key: "price",
      label: "Price",
    },
    {
      key: "duration",
      label: "Duration",
    },
    {
      key: "addeddate",
      label: "Added On",
    },
  ];

  return (
    <>
      <Card className="mt-8 p-2 bg-transparent" shadow="none">
        <div className="flex justify-between items-center">
          <h2 className="my-6 text-2xl font-semibold">
            Available Tests in Lab
          </h2>

          <Button
            as={Link}
            to="/dashboard/tests/available-tests"
            endContent={<IconArrowRight size={16} />}
            variant="bordered"
          >
            View All
          </Button>
        </div>

        <Table
          topContent={
            <span className="text-default-400 text-small">
              Total {tests.length} tests
            </span>
          }
          aria-label="Available Tests"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No rows to display."}
            items={tests.slice(initialItem, finalItem)}
          >
            {(test) => (
              <TableRow key={test._id}>
                <TableCell>
                  <Chip
                    variant="dot"
                    // @ts-ignore

                    color={test.status === "active" ? "success" : "danger"}
                  >
                    {test.status === "active" ? "available" : "not available"}
                  </Chip>
                </TableCell>
                <TableCell
                  title={test.name}
                  className="overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]"
                >
                  {test.name}
                </TableCell>
                <TableCell>{test.price}</TableCell>
                <TableCell>{test.duration}</TableCell>
                <TableCell>{humanReadableDate(test.updatedat)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

// report CardProps
interface ReportCardProps {
  reports: Report[];
}

export const ReportCard = ({ reports }: ReportCardProps) => {
  const offset = 5;
  const initialItem = 0;
  const finalItem = offset;

  const columns = [
    {
      key: "status",
      label: "Status",
    },
    {
      key: "name",
      label: "Patient Name",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "address",
      label: "Address",
    },
    {
      key: "addedby",
      label: "Added By",
    },
    {
      key: "addeddate",
      label: "Added On",
    },
  ];

  return (
    <>
      <Card className="mt-8 p-2 bg-transparent" shadow="none">
        <div className="flex justify-between items-center">
          <h2 className="my-6 text-2xl font-semibold">Reports</h2>

          <Button
            as={Link}
            to="/dashboard/reports"
            endContent={<IconArrowRight size={16} />}
            variant="bordered"
          >
            View All
          </Button>
        </div>

        <Table
          topContent={
            <span className="text-default-400 text-small">
              Total {reports.length} tests
            </span>
          }
          aria-label="Users"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No rows to display."}
            items={reports.slice(initialItem, finalItem)}
          >
            {(test) => (
              <TableRow key={test._id}>
                <TableCell>
                  <Chip
                    variant="dot"
                    // @ts-ignore
                    color={
                      test.status === "positive"
                        ? "danger"
                        : test.status === "negative"
                        ? "success"
                        : "default"
                    }
                  >
                    {test.status}
                  </Chip>
                </TableCell>
                <TableCell>{test.name}</TableCell>
                <TableCell>{test.phone}</TableCell>
                <TableCell>{test.address}</TableCell>
                <TableCell>{test.addedby}</TableCell>
                <TableCell>{humanReadableDate(test.reportDate)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default Dashboard;
