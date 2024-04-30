import { Helmet } from "react-helmet-async";
import { isLoggedIn } from "../../../utils/auth";
import { Link, useParams } from "react-router-dom";
import { EditIcon } from "../../icons/Icons";
import { useEffect, useState } from "react";
import { Doctor } from "../../../interface/interface";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";

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
      <div>
        <div className="flex justify-between items-center">
          <div className="px-4 sm:px-0">
            <h1 className="text-base font-semibold leading-7">
              Doctor Information
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6">
              Personal details and application.
            </p>
          </div>
          {user?.role === "admin" && (
            <Link
              to={`/dashboard/doctors/${id}/edit`}
              className="btn btn-primary btn-sm"
            >
              <EditIcon className="h-5 w-5" />
              Edit
            </Link>
          )}
        </div>
        <div className="mt-6">
          <div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Full name</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {getUser.name}
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Designation</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {getUser.designation}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Reg. No</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {getUser.regno} years
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Phone</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {getUser.phone}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Email address</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {getUser.email}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Signature</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 bg-base-300 w-fit rounded-xl">
                <img
                  src={`${API_BASE_URL}/api/upload/single/${getUser.sign}`}
                  className="object-contain w-auto aspect-square h-48 card mix-blend-darken"
                  alt={getUser.name}
                  title="sign"
                  width={40}
                  height={40}
                  loading="lazy"
                />
              </dd>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewDoctor;
