import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumbs as NextUiBreadCrumb,
  BreadcrumbItem,
} from "@nextui-org/react";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter((i) => i);
  const breadcrumbItems = pathSegments?.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    return { label: segment, link: path };
  });

  return (
    <>
      <div className="text-sm breadcrumbs select-none items-center cursor-default flex mb-4">
        <NextUiBreadCrumb variant="solid">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          {breadcrumbItems?.map((item, index) => (
            <BreadcrumbItem key={item.label}>
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
            </BreadcrumbItem>
          ))}
        </NextUiBreadCrumb>
      </div>
    </>
  );
};

export default Breadcrumbs;
