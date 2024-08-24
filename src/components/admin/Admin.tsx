import Breadcrumbs from "../Breadcrumbs";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { data } from "../../utils/data";

const Admin = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard - {data.title}</title>
      </Helmet>
      <div className="my-24 max-w-7xl mx-auto p-4">
        <Breadcrumbs />
        <Outlet />
      </div>
    </>
  );
};

export default Admin;
