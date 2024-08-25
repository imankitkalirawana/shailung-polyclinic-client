import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage/Homepage";
import Profile from "./components/Profile";
import { Toaster } from "sonner";
import Website from "./components/update/Website/Website";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Users from "./components/admin/user/Users";
import User from "./components/admin/user/User";
import Dashboard from "./components/admin/Dashboard";
import ViewUser from "./components/admin/user/ViewUser";
import AvailableTests from "./components/admin/tests/AvailableTests";
import ViewAvailableTest from "./components/admin/tests/ViewAvailableTest";
import EditAvailableTest from "./components/admin/tests/EditAvailableTest";
import Admin from "./components/admin/Admin";
import Tests from "./components/admin/tests/Tests";
import New from "./components/appointment/New";
import History from "./components/appointment/History";
import Complete from "./components/admin/tests/Complete";
import Download from "./components/admin/tests/Download";
import { Helmet } from "react-helmet-async";
import Reports from "./components/admin/report/Reports";
import NewAppointment from "./components/admin/tests/NewAppointment";
import AvailableServices from "./components/Homepage/AvailableServices";
import { isLoggedIn } from "./utils/auth";
import UserDashboard from "./components/Homepage/UserDashboard";
import Register from "./components/auth/Register";
import Doctors from "./components/admin/doctors/Doctors";
import Doctor from "./components/admin/doctors/Doctor";
import ViewDoctor from "./components/admin/doctors/ViewDoctor";
import Stats from "./components/admin/Stats";
import CompleteHold from "./components/admin/tests/CompleteHold";
import NewMer from "./components/admin/mer/NewMer";
import Mer from "./components/admin/mer/Mer";
import EditMer from "./components/admin/mer/EditMer";
import RoughApp from "./components/admin/tests/AppRough";
import MERHistory from "./components/admin/mer/MERHistory";
import MERReport from "./components/admin/mer/MERReport";
import { data } from "./utils/data";
// @ts-ignore
import BookMER from "./components/admin/mer/MERHome";
import MERHome from "./components/admin/mer/MERHome";
import Appointments from "./components/admin/mer/Appointments";

const MainLayout = ({ children }: any) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  const { user } = isLoggedIn();
  return (
    <>
      <Helmet>
        <title>Home - {data.title}</title>
        <meta name="description" content={data.description} />
        <meta name="keywords" content={data.keywords} />
        <link
          rel="canonical"
          href={`${data.url}${window.location.pathname}${window.location.search}`}
        />
      </Helmet>
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/rough" element={<RoughApp />} />
                  <Route
                    path="/view-available-services"
                    element={<AvailableServices />}
                  />
                  <Route path="/dashboard/*" element={<Admin />}>
                    <Route path="stats" element={<Stats />} />
                    <Route
                      path=""
                      element={
                        user?.role === "user" ? (
                          <UserDashboard />
                        ) : (
                          <Dashboard />
                        )
                      }
                    />

                    <Route path="users" element={<Users />} />
                    <Route path="users/:id" element={<ViewUser />} />
                    <Route path="users/:id/edit" element={<User />} />

                    <Route path="tests/" element={<Outlet />}>
                      <Route path="" element={<Tests />} />
                      <Route path="complete/:id" element={<Complete />} />
                      <Route
                        path="complete/report/:id"
                        element={<CompleteHold />}
                      />
                      <Route path="appointment" element={<NewAppointment />} />
                    </Route>

                    <Route path="doctors/*" element={<Outlet />}>
                      <Route path="" element={<Doctors />} />
                      <Route path=":id" element={<ViewDoctor />} />
                      <Route path=":id/edit" element={<Doctor />} />
                    </Route>

                    <Route path="medical-examination/*" element={<Outlet />}>
                      <Route path="" element={<MERHome />} />
                      <Route path="appointments" element={<Appointments />} />
                      <Route path="reports" element={<MERReport />} />
                      <Route path="new" element={<NewMer />} />
                      <Route path=":id" element={<Mer />} />
                      <Route path=":id/edit" element={<EditMer />} />
                      <Route path="history" element={<MERHistory />}></Route>
                    </Route>

                    {/* reports */}
                    <Route path="reports" element={<Reports />} />

                    <Route
                      path="tests/available-tests"
                      element={<AvailableTests />}
                    />
                    <Route
                      path="tests/available-tests/:id"
                      element={<ViewAvailableTest />}
                    />
                    <Route
                      path="tests/available-tests/:id/edit"
                      element={<EditAvailableTest />}
                      // element={<DynamicTable />}
                    />
                    <Route path="appointments/" element={<Outlet />}>
                      <Route path="new" element={<NewAppointment />} />
                    </Route>

                    <Route path="website" element={<Website />} />
                  </Route>
                  <Route path="report/" element={<Outlet />}>
                    <Route path=":reportId/download" element={<Download />} />
                  </Route>
                  <Route path="/appointment/*" element={<Outlet />}>
                    <Route path="new" element={<New />} />
                    <Route path="history" element={<History />} />
                  </Route>
                </Routes>
              </MainLayout>
            }
          />
          <Route path="/auth/*" element={<Outlet />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
        </Routes>
      </Router>
      <Toaster
        theme={
          localStorage.getItem("theme") === "dark"
            ? "dark"
            : localStorage.getItem("theme") === "light"
            ? "light"
            : "system"
        }
        closeButton
      />
    </>
  );
}

export default App;
