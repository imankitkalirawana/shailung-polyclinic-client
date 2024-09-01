import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { API_BASE_URL } from "../utils/config";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { useFormik } from "formik";
import {
  IconCalendarClock,
  IconChevronDown,
  IconClipboardText,
  IconHistory,
  IconMenu2,
  IconMoon,
  IconNewSection,
  IconStethoscope,
  IconSun,
  IconTableExport,
  IconTestPipe,
  IconUserDollar,
  IconUserEdit,
  IconUserQuestion,
  IconUsers,
  IconUserScan,
  IconX,
} from "@tabler/icons-react";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import { Avatar, Button, Card } from "@nextui-org/react";
import { data } from "../utils/data";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // check if localStorage has theme if not then set light theme
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      setTheme("light");
    }
  }, []);

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
    navigate("/auth/login");
  };

  return (
    <>
      <header
        className={`bg-base-300/40 print:hidden backdrop-blur-lg ${
          !loggedIn ? "hidden" : ""
        } shadow-xl fixed top-0 left-0 w-full z-50`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Button as={Link} variant="light" to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">{data.title}</span>
              <div className="flex items-center gap-2">
                <Avatar
                  name="P"
                  src="/logo.png"
                  color="primary"
                  className="text-lg"
                  fallback
                />
                <span className="text-xl font-semibold">{data.title}</span>
              </div>
            </Button>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <IconMenu2 className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Popover.Group className="hidden lg:flex lg:gap-x-12">
            <Link to="/dashboard" className="text-sm font-semibold leading-6">
              Dashboard
            </Link>
            {user?.role === "user" && (
              <Link to="/profile" className="text-sm font-semibold leading-6">
                Profile
              </Link>
            )}
            <Popover className="relative">
              <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold outline-none leading-6">
                Appointments
                <IconChevronDown
                  className="h-5 w-5 flex-none"
                  aria-hidden="true"
                />
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl">
                  <Card className="p-4" shadow="lg">
                    {appointments.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-base-300"
                      >
                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-base-300 group-hover:bg-base-100">
                          <item.icon
                            className="h-6 w-6 group-hover:text-primary"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex-auto">
                          <Link
                            to={item.href}
                            className="block outline-none font-semibold"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </Card>
                </Popover.Panel>
              </Transition>
            </Popover>
            {user?.role !== "recp" && (
              <Popover className="relative">
                <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold outline-none leading-6">
                  Tests
                  <IconChevronDown
                    className="h-5 w-5 flex-none"
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl shadow-2xl">
                    <Card className="p-4" shadow="lg">
                      {tests.map((item) => (
                        <div
                          key={item.name}
                          className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-base-300"
                        >
                          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-base-300 group-hover:bg-base-100">
                            <item.icon
                              className="h-6 w-6 group-hover:text-primary"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="flex-auto">
                            <Link
                              to={item.href}
                              className="block outline-none font-semibold"
                            >
                              {item.name}
                              <span className="absolute inset-0" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </Card>
                  </Popover.Panel>
                </Transition>
              </Popover>
            )}
            {user?.role === "admin" || user?.role === "doctor" ? (
              <>
                <Popover className="relative">
                  <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold outline-none leading-6">
                    Users
                    <IconChevronDown
                      className="h-5 w-5 flex-none"
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl shadow-2xl">
                      <Card className="p-4" shadow="lg">
                        {users.map((item) => (
                          <div
                            key={item.name}
                            className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-base-300"
                          >
                            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-base-300 group-hover:bg-base-100">
                              <item.icon
                                className="h-6 w-6 group-hover:text-primary"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="flex-auto">
                              <Link
                                to={item.href}
                                className="block outline-none font-semibold"
                              >
                                {item.name}
                                <span className="absolute inset-0" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </Card>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              </>
            ) : null}
            <>
              <Popover className="relative">
                <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold outline-none leading-6">
                  Medical Examination
                  <IconChevronDown
                    className="h-5 w-5 flex-none"
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl shadow-2xl">
                    <Card className="p-4" shadow="lg">
                      {medicalExaminations.map((item) => (
                        <div
                          key={item.name}
                          className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-base-300"
                        >
                          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-base-300 group-hover:bg-base-100">
                            <item.icon
                              className="h-6 w-6 group-hover:text-primary"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="flex-auto">
                            <Link
                              to={item.href}
                              className="block outline-none font-semibold"
                            >
                              {item.name}
                              <span className="absolute inset-0" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </Card>
                  </Popover.Panel>
                </Transition>
              </Popover>
            </>
          </Popover.Group>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {loggedIn ? (
              <Button variant="light" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link
                to="/auth/login"
                className="text-sm font-semibold leading-6 btn btn-ghost btn-sm rounded-full"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 bg-base-300 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className="-m-1.5 p-1.5">
                <span className="sr-only">{data.title}</span>
                <div className="flex items-center gap-2">
                  <img
                    src={
                      `${API_BASE_URL}/api/upload/single/logo.webp` ||
                      "/logo.webp"
                    }
                    alt={data.title}
                    className="w-10 aspect-square rounded-full"
                    title={data.title}
                    width={30}
                    height={30}
                    loading="eager"
                  />
                  <span className="text-xl font-semibold">{data.title}</span>
                </div>
              </Link>
              <button
                type="button"
                className="btn btn-ghost btn-circle"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <IconX className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-base-2000/10">
                <div className="space-y-2 py-6">
                  <Link
                    to="/dashboard"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-base-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-base-200"
                  >
                    Profile
                  </Link>
                  <Disclosure as="div" className="-mx-3">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7">
                          Appointments
                          <IconChevronDown
                            className={classNames(
                              open ? "rotate-180" : "",
                              "h-5 w-5 flex-none"
                            )}
                            aria-hidden="true"
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-2 space-y-2">
                          {appointments.map((item) => (
                            <Disclosure.Button
                              key={item.name}
                              as={Link}
                              to={item.href}
                              className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 hover:bg-base-200"
                            >
                              {item.name}
                            </Disclosure.Button>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <Disclosure as="div" className="-mx-3">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7">
                          Tests
                          <IconChevronDown
                            className={classNames(
                              open ? "rotate-180" : "",
                              "h-5 w-5 flex-none"
                            )}
                            aria-hidden="true"
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-2 space-y-2">
                          {tests.map((item) => (
                            <Disclosure.Button
                              key={item.name}
                              as={Link}
                              to={item.href}
                              className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 hover:bg-base-200"
                            >
                              {item.name}
                            </Disclosure.Button>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  {(user?.role === "admin" || user?.role === "doctor") && (
                    <Disclosure as="div" className="-mx-3">
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7">
                            Users
                            <IconChevronDown
                              className={classNames(
                                open ? "rotate-180" : "",
                                "h-5 w-5 flex-none"
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="mt-2 space-y-2">
                            {users.map((item) => (
                              <Disclosure.Button
                                key={item.name}
                                as={Link}
                                to={item.href}
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 hover:bg-base-200"
                              >
                                {item.name}
                              </Disclosure.Button>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )}
                  <Link
                    to="/dashboard/medical-examination"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-base-200"
                  >
                    Medical Examination
                  </Link>
                </div>

                <div className="py-6">
                  {!loggedIn ? (
                    <Link
                      to="/auth/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-base-200"
                    >
                      Log in
                    </Link>
                  ) : (
                    <span
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-base-200"
                      onClick={handleLogout}
                    >
                      Logout
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <div className="fixed print:hidden bottom-8 z-10 right-0 bg-base-300/30 backdrop-blur-xl rounded-l-full">
        <label className="swap swap-rotate btn btn-ghost rounded-r-none btn-circle">
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
          <IconSun className="swap-off" />

          {/* moon icon */}
          <IconMoon className="swap-on" />
        </label>
      </div>
    </>
  );
};
const { user } = isLoggedIn();

const appointments = [
  {
    name: "Appointment History",
    description: "View your previously booked appointments",
    href: `${
      user?.role === "user"
        ? "/appointment/history"
        : "/dashboard/tests?status=booked"
    }`,
    icon: IconCalendarClock,
  },
];

const tests = [
  {
    name: "View Available Services",
    description: "View all available pathology tests",
    href: "/dashboard/tests/available-tests",
    icon: IconTestPipe,
  },
];

const medicalExaminations = [
  {
    name: "New Appointment",
    description: "View your previously booked medical examinations",
    href: "/dashboard/medical-examination",
    icon: IconNewSection,
  },
];

const users = [
  {
    name: "View All Users",
    description: "View all the users registered in the system",
    href: "/dashboard/users",
    icon: IconUsers,
  },

  {
    name: "View All Patients",
    description: "View all the patients registered in the system",
    href: "/dashboard/users?type=user&phone=true",
    icon: IconUserQuestion,
  },
];

if (user?.role === "admin") {
  appointments.unshift(
    {
      name: "New Appointment (Existing User)",
      description: "Book an appointment for an existing user",
      href: `/dashboard/appointments/new?user=existing`,
      icon: IconUserEdit,
    },
    {
      name: "New Appointment (New User)",
      description: "Book an appointment for a new user",
      href: `/dashboard/appointments/new?user=new`,
      icon: IconUserScan,
    }
  );
  tests.unshift(
    {
      name: "View All Tests",
      description: "View all the tests registered in the system",
      href: "/dashboard/tests?status=all",
      icon: IconStethoscope,
    },
    {
      name: "View All Reports",
      description: "View all the reports generated in the system",
      href: "/dashboard/reports",
      icon: IconClipboardText,
    }
  );
  users.push({
    name: "Register New User",
    description: "Register a new user in the system",
    href: "/dashboard/users?action=new",
    icon: IconNewSection,
  });
  medicalExaminations.unshift(
    {
      name: "New Medical Examination",
      description: "Create a new medical examination",
      href: "/dashboard/medical-examination/new",
      icon: IconNewSection,
    },
    {
      name: "Medical Examinations Reports",
      description: "View all the medical examinations registered in the system",
      href: "/dashboard/medical-examination/reports",
      icon: IconClipboardText,
    },
    {
      name: "Appointment History",
      description: "View all the medical examinations registered in the system",
      href: "/dashboard/medical-examination/appointments",
      icon: IconCalendarClock,
    }
  );
}
if (user?.role === "doctor") {
  tests.unshift(
    {
      name: "View All Tests",
      description: "View all the tests registered in the system",
      href: "/dashboard/tests?status=all",
      icon: IconStethoscope,
    },
    {
      name: "View All Reports",
      description: "View all the reports generated in the system",
      href: "/dashboard/reports",
      icon: IconClipboardText,
    }
  );
}

if (user?.role === "recp") {
  appointments.unshift(
    {
      name: "New Appointment (Existing User)",
      description: "Book an appointment for an existing user",
      href: `/dashboard/appointments/new?user=existing`,
      icon: IconUserEdit,
    },
    {
      name: "New Appointment (New User)",
      description: "Book an appointment for a new user",
      href: `/dashboard/appointments/new?user=new`,
      icon: IconUserScan,
    }
  );
  medicalExaminations.unshift(
    {
      name: "New Medical Examination",
      description: "Create a new medical examination",
      href: "/dashboard/medical-examination/new",
      icon: IconNewSection,
    },
    {
      name: "Medical Examinations Reports",
      description: "View all the medical examinations registered in the system",
      href: "/dashboard/medical-examination/reports",
      icon: IconClipboardText,
    },
    {
      name: "Appointment History",
      description: "View all the medical examinations registered in the system",
      href: "/dashboard/medical-examination/appointments",
      icon: IconCalendarClock,
    }
  );
}
if (user?.role === "user") {
  appointments.unshift({
    name: "New Appointment",
    description: "View all the appointments booked by the patients",
    href: "/dashboard/appointments/new",
    icon: IconCalendarClock,
  });
  medicalExaminations.push({
    name: "Appointment History",
    description: "View the medical examination details",
    href: "/dashboard/medical-examination/history",
    icon: IconHistory,
  });
}

if (user?.role === "admin") {
  users.push(
    {
      name: "View All Doctors",
      description: "View all the doctors registered in the system",
      href: "/dashboard/doctors",
      icon: IconUserDollar,
    },
    {
      name: "Export Users",
      description: "Export all the users registered in the system",
      href: "/dashboard/users?action=export",
      icon: IconTableExport,
    }
  );
}

export default Navbar;
