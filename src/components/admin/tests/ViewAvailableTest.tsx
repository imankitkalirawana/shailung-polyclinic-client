import { Link, useParams } from "react-router-dom";
import { EditIcon } from "../../icons/Icons";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";
import toast from "react-hot-toast";
import { humanReadableDate } from "../user/Users";

interface Test {
  name: string;
  description: string;
  price: number;
  duration: string;
  status: string;
  addeddate: string;
  updatedat: string;
  testProps: [
    {
      investigation: string;
      referenceValue: string;
      unit: string;
    }
  ];
}

const ViewAvailableTest = () => {
  const { id }: any = useParams();
  const [test, setTest] = useState<Test>({
    name: "",
    description: "",
    price: 0,
    duration: "",
    status: "",
    addeddate: "",
    updatedat: "",
    testProps: [
      {
        investigation: "",
        referenceValue: "",
        unit: "",
      },
    ],
  });

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
      <div>
        <div className="flex justify-between items-center">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7">Test Details</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6">
              Test details and application.
            </p>
          </div>
          <Link
            to={`/admin/tests/available-tests/${id}/edit`}
            className="btn btn-primary btn-sm"
          >
            <EditIcon className="h-5 w-5" />
            Edit
          </Link>
        </div>
        <div className="mt-6">
          <dl className="">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Name</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {test.name}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Description</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {test.description}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Price</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                NPR{" "}
                {test.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Duration</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {test.duration}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Status</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {test.status === "active" ? "Available" : "Not Available"}
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Added On</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {humanReadableDate(test.addeddate)}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Updated On</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {test.updatedat ? humanReadableDate(test.updatedat) : "N/A"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Test Properties</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0"></dd>
            </div>
            <div className={`w-full overflow-x-auto card`}>
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left uppercase border-b bg-primary/20">
                    <th className="px-4 py-3">Investigation</th>
                    <th className="px-4 py-3">Reference Value</th>
                    <th className="px-4 py-3">Unit</th>
                  </tr>
                </thead>
                <tbody className="bg-primary/10 divide-y">
                  {test.testProps.map((testProp, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm">
                        {testProp.investigation}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {testProp.referenceValue}
                      </td>
                      <td className="px-4 py-3 text-sm">{testProp.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
};

export default ViewAvailableTest;
