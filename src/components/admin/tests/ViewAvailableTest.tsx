import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";
import { toast } from "sonner";
import { humanReadableDate } from "../user/Users";
import { isLoggedIn } from "../../../utils/auth";
import { AvailableTest } from "../../../interface/interface";
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import CellValue from "../../cell-value";

const ViewAvailableTest = () => {
  const { id }: any = useParams();
  const { user } = isLoggedIn();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "member") {
      navigate("/dashboard");
    }
  }, [user]);

  const [test, setTest] = useState<AvailableTest>({} as AvailableTest);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/available-test/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setTest(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch test");
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Card className="w-full mx-auto p-2">
        <CardHeader className="justify-between px-4">
          <div className="flex flex-col items-start">
            <p className="text-large">Service Details</p>
            <p className="text-small text-default-500">
              Service details and application.
            </p>
          </div>
          {user?.role === "admin" && (
            <Button
              as={Link}
              to={`/dashboard/tests/available-tests/${id}/edit`}
              color="primary"
              variant="flat"
            >
              Edit
            </Button>
          )}
        </CardHeader>
        <CardBody className="space-y-2 px-6">
          <CellValue label="Test Name" value={test.name} />
          <CellValue
            className={"hidden sm:flex justify-between"}
            label="Description"
            value={test.description}
          />
          <CellValue
            label="Price"
            value={`NPR ${
              test.price &&
              test.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }`}
          />
          <CellValue label="Duration" value={test.duration} />
          <CellValue
            label="Status"
            value={
              <Chip
                variant="dot"
                color={test.status === "active" ? "success" : "danger"}
              >
                {test.status}
              </Chip>
            }
          />
          <CellValue
            className={"hidden sm:flex justify-between"}
            label="Test Information"
            value={test.summary}
          />
          <CellValue
            label="Added On"
            value={humanReadableDate(test.addeddate)}
          />
        </CardBody>
      </Card>
      <Card className="bg-transparent">
        <Table className="mt-8 max-w-6xl mx-auto" aria-label="Available Tests">
          <TableHeader>
            <TableColumn>Investigation</TableColumn>
            <TableColumn>Reference Value</TableColumn>
            <TableColumn>Unit</TableColumn>
          </TableHeader>
          <TableBody>
            {test.testProps &&
              test.testProps.map((testProp) => (
                <TableRow key={testProp.investigation}>
                  <TableCell className="whitespace-pre-wrap">
                    <p className="whitespace-pre-wrap">
                      {testProp.investigation}
                    </p>
                  </TableCell>
                  <TableCell>{testProp.referenceValue}</TableCell>
                  <TableCell>{testProp.unit}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default ViewAvailableTest;
