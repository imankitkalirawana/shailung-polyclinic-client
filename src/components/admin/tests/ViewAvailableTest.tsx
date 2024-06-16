import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";
import { toast } from "sonner";
import { humanReadableDate } from "../user/Users";
import { isLoggedIn } from "../../../utils/auth";
import { Card, CardHeader, Button, CardBody, Chip } from "@nextui-org/react";
import CellValue from "../../cell-value";
import DynamicTable from "./Table";
import { AvailableTest } from "@/interface/interface";

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
  }, [id]);

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
          <CellValue label="Test Unique ID" value={test.uniqueid || "-"} />
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
      <Card className="overflow-x-auto mt-4">
        {/* <table className="table">
          <thead>
            <tr>
              {test.testProps &&
                Object.keys(test.testProps[0]).map((key) => (
                  <th className="capitalize" key={key}>
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {test.testProps &&
              test.testProps.map((prop, propIndex) => (
                <tr key={propIndex}>
                  {Object.keys(prop).map((key) => (
                    <td
                      className="whitespace-pre-line"
                      key={`${propIndex}-${key}`}
                    >
                      {prop[key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table> */}
        <DynamicTable tableid={test.tableref} />
      </Card>
    </>
  );
};

export default ViewAvailableTest;
