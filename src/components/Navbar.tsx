import axios from "axios";
import { useEffect } from "react";
import { API_BASE_URL } from "../utils/config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { useFormik } from "formik";
import { data } from "../utils/data";

const themes = ["light", "dark"];

const Navbar = () => {
  const navigate = useNavigate();
  const { loggedIn, user } = isLoggedIn();
  const setTheme = (theme: any) => {
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
    navigate("/");
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
                <Link to="/appointment/history">History</Link>
              </li>
              <li>
                <a>About</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <Link to={"/"} className="btn btn-ghost text-xl">
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
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost m-1 hidden md:flex"
            >
              Theme
              <svg
                width="12px"
                height="12px"
                className="h-2 w-2 fill-current opacity-60 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
              >
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52"
            >
              {themes.map((theme, index) => (
                <li key={index} onClick={() => setTheme(theme)}>
                  <input
                    data-theme={theme}
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label={theme}
                    value={theme}
                  />
                </li>
              ))}
            </ul>
          </div>
          {/* The button to open modal */}
          {loggedIn ? (
            <div className="dropdown dropdown-end mr-4">
              <div className="avatar placeholder" tabIndex={0} role="button">
                <div className="w-10 rounded-full">
                  <img
                    src={`${API_BASE_URL}/api/upload/${formik.values.photo}`}
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

                {user && user.role === "admin" && (
                  <>
                    <li>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
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
