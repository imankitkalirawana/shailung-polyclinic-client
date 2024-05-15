import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { API_BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { useFormik } from "formik";
import { data } from "../utils/data";
import { getWebsite } from "../functions/get";
import {
  IconCalendarClock,
  IconChevronDown,
  IconMenu2,
  IconReportMedical,
  IconStethoscope,
  IconTestPipe,
  IconUserDollar,
  IconUserEdit,
  IconUserQuestion,
  IconUsers,
  IconUserScan,
  IconX,
} from "@tabler/icons-react";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";

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
  const [websiteData, setWebsiteData] = useState<any>({});

  const formik = useFormik({
    initialValues: {
      photo: "profile-default.webp",
    },
    onSubmit: async () => {},
  });

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getWebsite();
      setWebsiteData(data);
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
      <header className="bg-base-100/30 backdrop-blur-lg fixed top-0 left-0 w-full z-50">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">
                {websiteData.title || data.websiteData.title}
              </span>
              <div className="flex items-center gap-2">
                <img
                  src={
                    `${API_BASE_URL}/api/upload/single/logo.webp` ||
                    "/logo.webp"
                  }
                  alt="logo"
                  className="w-10 aspect-square rounded-full"
                  title="Shailung Polyclinic"
                  width={30}
                  height={30}
                  loading="eager"
                />
                <span className="text-xl font-semibold">
                  {websiteData.title || data.websiteData.title}
                </span>
              </div>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              {/* <Bars3Icon className="h-6 w-6" aria-hidden="true" /> */}
              <IconMenu2 className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Popover.Group className="hidden lg:flex lg:gap-x-12">
            <a href="/dashboard" className="text-sm font-semibold leading-6">
              Dashboard
            </a>
            <a href="/profile" className="text-sm font-semibold leading-6">
              Profile
            </a>
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
                <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden bg-base-100 rounded-3xl shadow-2xl ring-1 ring-primary/40">
                  <div className="p-4">
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
                          <a
                            href={item.href}
                            className="block outline-none font-semibold"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
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
                <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden bg-base-100 rounded-3xl shadow-2xl ring-1 ring-primary/40">
                  <div className="p-4">
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
                          <a
                            href={item.href}
                            className="block outline-none font-semibold"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
            {user?.role === "admin" || user?.role === "member" ? (
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
                  <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden bg-base-100 rounded-3xl shadow-2xl ring-1 ring-primary/40">
                    <div className="p-4">
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
                            <a
                              href={item.href}
                              className="block outline-none font-semibold"
                            >
                              {item.name}
                              <span className="absolute inset-0" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-900/5">
                      <a
                        href={"/dashboard/users?action=new"}
                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 hover:bg-base-300"
                      >
                        Register new user
                      </a>
                      <a
                        href={"/dashboard/users"}
                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 hover:bg-base-300"
                      >
                        Export users
                      </a>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            ) : null}
          </Popover.Group>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {loggedIn ? (
              <span
                className="text-sm font-semibold leading-6 btn btn-ghost hover:text-error btn-sm rounded-full"
                onClick={handleLogout}
              >
                Logout
              </span>
            ) : (
              <a
                href="/auth/login"
                className="text-sm font-semibold leading-6 btn btn-ghost btn-sm rounded-full"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
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
              <a href="/dashboard" className="-m-1.5 p-1.5">
                <span className="sr-only">Shailung Polyclinic</span>
                <div className="flex items-center gap-2">
                  <img
                    src={
                      `${API_BASE_URL}/api/upload/single/logo.webp` ||
                      "/logo.webp"
                    }
                    alt="logo"
                    className="w-10 aspect-square rounded-full"
                    title="Shailung Polyclinic"
                    width={30}
                    height={30}
                    loading="eager"
                  />
                  <span className="text-xl font-semibold">
                    {websiteData.title || data.websiteData.title}
                  </span>
                </div>
              </a>
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
                  <a
                    href="/dashboard"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-base-200"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/profile"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-base-200"
                  >
                    Profile
                  </a>
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
                              as="a"
                              href={item.href}
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
                              as="a"
                              href={item.href}
                              className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 hover:bg-base-200"
                            >
                              {item.name}
                            </Disclosure.Button>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  {(user?.role === "admin" || user?.role === "member") && (
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
                                as="a"
                                href={item.href}
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
                </div>

                <div className="py-6">
                  {!loggedIn ? (
                    <a
                      href="/auth/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-base-200"
                    >
                      Log in
                    </a>
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
      <div className="fixed bottom-8 z-10 right-0 bg-base-300/30 backdrop-blur-xl rounded-l-full">
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
      user?.role === "admin"
        ? "/dashboard/tests?status=booked"
        : "/appointment/history"
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

const users = [
  {
    name: "View All Users",
    description: "View all the users registered in the system",
    href: "/dashboard/users",
    icon: IconUsers,
  },
  {
    name: "View All Doctors",
    description: "View all the doctors registered in the system",
    href: "/dashboard/doctors",
    icon: IconUserDollar,
  },
  {
    name: "View All Patients",
    description: "View all the patients registered in the system",
    href: "/dashboard/users?type=user",
    icon: IconUserQuestion,
  },
];

if (user?.role === "admin" || user?.role === "member") {
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
      href: "/dashboard/tests",
      icon: IconStethoscope,
    },
    {
      name: "View All Reports",
      description: "View all the reports generated in the system",
      href: "/dashboard/reports",
      icon: IconReportMedical,
    }
  );
} else {
  appointments.unshift({
    name: "New Appointment",
    description: "Book a new appointment with the doctor",
    href: `/appointment/new`,
    icon: IconUserEdit,
  });
}

export default Navbar;
