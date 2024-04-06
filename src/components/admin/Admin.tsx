import { isLoggedIn } from "../../utils/auth";
import Breadcrumbs from "../Breadcrumbs";
import { Outlet } from "react-router-dom";
import NotFound from "../NotFound";

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
      <div className="my-24 max-w-6xl mx-auto p-4">
        <Breadcrumbs />
        <Outlet />
      </div>
    </>
  );
};

export default Admin;
