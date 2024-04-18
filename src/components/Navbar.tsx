import axios from "axios";
import { useEffect } from "react";
import { API_BASE_URL } from "../utils/config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { useFormik } from "formik";
import { data } from "../utils/data";

const Navbar = () => {
  const navigate = useNavigate();
  const { loggedIn, user } = isLoggedIn();
  const setTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  const formik = useFormik({
    initialValues: {
      photo: "profile-default.webp",
    },
    onSubmit: async () => {},
  });

  useEffect(() => {
    const fetchUser = async () => {
      await axios
        .get(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          formik.setValues((prevValues) => ({
            ...prevValues,
            photo: response.data.photo,
          }));
        });
    };
    if (loggedIn) {
      fetchUser();
    }
  }, []);

  // handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("userId");
    navigate("/dashboard");
  };

  return (
    <>
      <div className="navbar bg-base-100/50 backdrop-blur-lg fixed left-[50%] top-0 -translate-x-[50%] z-10">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box w-52"
            >
              {loggedIn && user?.role === "admin" && (
                <li>
                  <Link to={"/dashboard/tests"}>Tests</Link>
                </li>
              )}
              <li>
                <Link to={"/appointment/new"}>New Appointment</Link>
              </li>
              <li>
                <Link to="/appointment/history">Reports</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <Link to={"/dashboard"} className="btn btn-ghost text-xl">
            <img
              src={data.websiteData.logo}
              alt="logo"
              className="w-10 aspect-square rounded-full"
              title="logo"
              width={40}
              height={40}
              loading="eager"
            />
            {data.websiteData.title}
          </Link>
        </div>
        <div className="navbar-end gap-4 mr-4">
          <label className="swap swap-rotate btn btn-ghost btn-circle">
            <input
              type="checkbox"
              className="swap-checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  setTheme("dark");
                } else {
                  setTheme("light");
                }
              }}
              defaultChecked={localStorage.getItem("theme") === "dark"}
            />

            {/* sun icon */}
            <svg
              className="swap-off fill-current w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on fill-current w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
          {/* The button to open modal */}
          {loggedIn ? (
            <div className="dropdown dropdown-end mr-4">
              <div className="avatar placeholder" tabIndex={0} role="button">
                <div className="w-10 rounded-full">
                  <img
                    src={`${API_BASE_URL}/api/upload/single/${formik.values.photo}`}
                    alt="profile"
                    title="profile"
                    width={40}
                    height={40}
                    loading="eager"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 bg-base-300 shadow-lg rounded-box w-52"
              >
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>

                {user && user.role === "admin" && (
                  <>
                    <li>
                      <Link to="/dashboard/website">My Website</Link>
                    </li>
                  </>
                )}
                {user && user.role === "member" && (
                  <>
                    <li>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                  </>
                )}
                <li className="text-error">
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          ) : (
            <Link to={"auth/login"} className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
