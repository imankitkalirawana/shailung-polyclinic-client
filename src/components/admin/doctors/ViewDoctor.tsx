import { Helmet } from "react-helmet-async";
import { isLoggedIn } from "../../../utils/auth";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Doctor } from "../../../interface/interface";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { Card, CardHeader, Button, CardBody, Image } from "@nextui-org/react";
import CellValue from "../../cell-value";
import { data } from "../../../utils/data";

const ViewDoctor = () => {
  const { id }: any = useParams();
  const { user } = isLoggedIn();
  const [getUser, setUser] = useState<Doctor>({} as Doctor);

  if (!user || user.role !== "admin") {
    window.location.href = "/auth/login";
  }
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/doctor/doctor/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctor();
  }, []);
  return (
    <>
      <Helmet>
        <title>
          {`${getUser.name}`} - {data.title}
        </title>
      </Helmet>

      <Card className="w-full mx-auto max-w-lg p-2">
        <CardHeader className="justify-between px-4">
          <div className="flex flex-col items-start">
            <p className="text-large">Service Details</p>
            <p className="text-small text-default-500">
              Service details and application.
            </p>
          </div>
          <Button
            as={Link}
            to={`/dashboard/doctors/${id}/edit`}
            color="primary"
            variant="flat"
          >
            Edit
          </Button>
        </CardHeader>
        <CardBody className="space-y-2 px-6">
          <CellValue label="Test Name" value={getUser.name} />
          <CellValue label="Designation" value={getUser.designation} />
          <CellValue label="RegNo" value={getUser.regno} />
          <CellValue label="Email" value={`${getUser.email}`} />
          <CellValue label="Phone" value={getUser.phone} />
          <div className="flex justify-end">
            <Image
              width={200}
              height={200}
              src={`${API_BASE_URL}/api/upload/single/${getUser.sign}`}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default ViewDoctor;
