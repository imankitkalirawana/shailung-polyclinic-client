import { Link, useLocation } from "react-router-dom";
import { SmartHomeIcon } from "./icons/Icons";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter((i) => i);
  const breadcrumbItems = pathSegments?.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    return { label: segment, link: path };
  });

  //   let lastItem = breadcrumbItems?.slice(-1)[0];

  return (
    <>
      <div className="text-sm breadcrumbs select-none items-center cursor-default flex mb-4">
        <ul>
          <li>
            <Link
              to={"/dashboard"}
              className="btn btn-sm btn-circle btn-ghost -mr-2"
            >
              <SmartHomeIcon className="w-4 h-4" />
            </Link>
          </li>
          {breadcrumbItems?.map((item, index) => (
            <li key={index}>
              {index !== breadcrumbItems.length - 1 ? (
                <>
                  <Link to={item.link}>
                    {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                  </Link>
                </>
              ) : (
                <span className="text-primary">
                  {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Breadcrumbs;
