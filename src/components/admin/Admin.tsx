import { isLoggedIn } from "../../utils/auth";
import Breadcrumbs from "../Breadcrumbs";
import { Outlet } from "react-router-dom";
import NotFound from "../NotFound";
import { Helmet } from "react-helmet-async";

const Admin = () => {
  const { loggedIn, user } = isLoggedIn();
  if (!loggedIn) {
    window.location.href = "/auth/login";
  } else if (loggedIn && user?.role !== "admin" && user?.role !== "member") {
    return (
      <div className="my-24" onLoad={() => {}}>
        <NotFound message="You are not allowed to access this page" />
      </div>
    );
  }
  return (
    <>
      <Helmet>
        <title>Dashboard - Shailung Polyclinic</title>
        <meta
          name="description"
          content="Get an inside look at the Shailung Polyclinic's admin dashboard for managing tests, appointments, and more."
        />
        <meta
          name="keywords"
          content="Shailung Polyclinic, Dashboard, Admin, Manage, Users, Appointments, Tests"
        />
        <link
          rel="canonical"
          href="https://report.shailungpolyclinic.com/dashboard"
        />
      </Helmet>
      <div className="my-24 max-w-6xl mx-auto p-4">
        <Breadcrumbs />
        <Outlet />
      </div>
    </>
  );
};

export default Admin;
