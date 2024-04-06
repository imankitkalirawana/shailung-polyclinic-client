import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "react-hot-toast";
import { humanReadableDate } from "./Users";
import { EditIcon } from "../../icons/Icons";

const ViewUser = () => {
  const { id }: any = useParams();
  const [user, setUser] = useState<any>({});
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
      <div>
        <div className="flex justify-between items-center">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7">
              User Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6">
              Personal details and application.
            </p>
          </div>
          <Link
            to={`/admin/users/${id}/edit`}
            className="btn btn-primary btn-sm"
          >
            <EditIcon className="h-5 w-5" />
            Edit
          </Link>
        </div>
        <div className="mt-6">
          <div>
            <div className="w-24 h-24 realtive">
              <img
                className="object-cover w-full h-full rounded-full"
                src={
                  user.photo
                    ? user.photo
                    : "https://ui-avatars.com/api/?name=" + user.name
                }
                alt={user.name}
                loading="lazy"
              />
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Full name</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {user.name}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Username</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {user.username}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Gender</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {user.gender}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Age</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {user.age} years
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Role</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {user.role}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Email address</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {user.email}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Phone Number</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {user.phone}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Bio</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {user.bio}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Address</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {user.address}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Registered On</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {humanReadableDate(user.addeddate)}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Updated On</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {user.updatedat ? humanReadableDate(user.updatedat) : "N/A"}
              </dd>
            </div>
            <div className="hidden">
              <dt className="text-sm font-medium leading-6">Attachments</dt>
              <dd className="mt-2 text-sm sm:col-span-2 sm:mt-0">
                <ul role="list" className="divide-y card border">
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      {/* <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0"
                        aria-hidden="true"
                      /> */}
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          resume_back_end_developer.pdf
                        </span>
                        <span className="flex-shrink-0">2.4mb</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a href="#" className="btn btn-ghost btn-sm">
                        Download
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      {/* <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0"
                        aria-hidden="true"
                      /> */}
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          coverletter_back_end_developer.pdf
                        </span>
                        <span className="flex-shrink-0">4.5mb</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a href="#" className="btn btn-ghost btn-sm">
                        Download
                      </a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewUser;
