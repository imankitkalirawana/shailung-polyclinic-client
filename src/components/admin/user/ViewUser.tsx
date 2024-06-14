import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { humanReadableDate } from "./Users";
import { EditIcon } from "../../icons/Icons";
import { isLoggedIn } from "../../../utils/auth";
import { Helmet } from "react-helmet-async";
import { calculateAge } from "../../../functions/agecalculator";
import { User } from "../../../interface/interface";

import {
  Link as NextLink,
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  CardFooter,
} from "@nextui-org/react";
import { IconPencil } from "@tabler/icons-react";

const ViewUser = () => {
  const { id }: any = useParams();
  const { user } = isLoggedIn();
  const [getUser, setUser] = useState<User>({} as User);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/admin/user/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user");
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Helmet>
        <title>{`${getUser.name}`} - Shailung Polyclinic</title>
        <meta
          name="description"
          content={`View ${getUser.name}'s information on Shailung Polyclinic in Itahari, Nepal`}
        />
        <meta
          name="keywords"
          content="Shailung Polyclinic, Shailung, Polyclinic, Hospital, Clinic, Health, Health Care, Medical, Medical Care, Itahari, Nepal, User, User Information, User Details, User Profile, User Profile Information, User Profile Details, User Profile Information Details, User Profile Information Details Page, User Profile Information Details Page of Shailung Polyclinic, User Profile Information Details Page of Shailung Polyclinic in Itahari, User Profile Information Details Page of Shailung Polyclinic in Itahari, Nepal, Shailung Polyclinic User Profile Information Details Page, Shailung Polyclinic User Profile Information Details Page in Itahari, Shailung Polyclinic User Profile Information Details Page in Itahari, Nepal"
        />
        <link
          rel="canonical"
          href={`https://report.shailungpolyclinic.com/admin/user/${id}`}
        />
      </Helmet>
      <div className="flex h-full  w-full items-start justify-center overflow-scroll">
        <Card className="my-10 w-[400px]">
          <CardHeader className="relative flex h-[100px] flex-col justify-end overflow-visible bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
            <Avatar
              fallback={<EditIcon size={32} />}
              className="h-20 w-20 translate-y-12"
              src={`${API_BASE_URL}/api/upload/single/${getUser.photo}`}
            />

            {user?.role === "admin" && (
              <Button
                className="absolute right-3 top-3 bg-white/20 text-white dark:bg-black/20"
                radius="full"
                size="sm"
                variant="light"
                as={Link}
                isIconOnly
                to={`/dashboard/users/${id}/edit`}
              >
                <IconPencil stroke={1} size={16} />
              </Button>
            )}
          </CardHeader>
          <CardBody>
            <div className="pb-4 pt-6">
              <p className="text-large font-medium">{getUser.name}</p>
              <p className="text-small text-default-400">
                <NextLink
                  href={`mailto:${getUser.email}`}
                  color="foreground"
                  target="_BLANK"
                  size="sm"
                  className="hover:underline text-default-400"
                >
                  {getUser.email}
                </NextLink>
                {" | "}
                <NextLink
                  href={`tel:${getUser.phone}`}
                  color="foreground"
                  target="_BLANK"
                  size="sm"
                  className="hover:underline text-default-400"
                >
                  {getUser.phone}
                </NextLink>
              </p>
              <div className="flex gap-2 pb-1 pt-2 overflow-scroll">
                <Chip variant="flat">
                  {getUser.dob && calculateAge(getUser.dob)} years
                </Chip>
                <Chip variant="flat" className="capitalize">
                  {getUser.role}
                </Chip>
                {getUser.gender && getUser.gender !== "-" && (
                  <Chip variant="flat" className="capitalize">
                    {getUser.gender}
                  </Chip>
                )}
              </div>
              <p className="py-2 text-small text-foreground">{getUser.bio}</p>
              <p className="py-2 text-small text-foreground">
                {getUser.address}
              </p>
              <div className="flex gap-2">
                <p>
                  <span className="text-small text-default-400">
                    Created on:{" "}
                    {getUser.addeddate && humanReadableDate(getUser.addeddate)}
                    {getUser.addedby && " by " + getUser.addedby}
                  </span>
                </p>
              </div>
            </div>
          </CardBody>
          {(user?.role === "admin" || user?.role === "member") && (
            <CardFooter>
              <Button
                fullWidth
                color="primary"
                variant="flat"
                as={Link}
                to={`/appointment/new?user=${id}&phone=true`}
              >
                New Appointment
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </>
  );
};

export default ViewUser;
