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
        <title>Home - Shailung Polyclinic</title>
        <meta
          name="description"
          content="Shailung Polyclinic is a medical facility that provides various health services to the people of Nepal."
        />
        <meta
          name="keywords"
          content="Shailung Polyclinic, Healthcare, Clinic, Consultation, Diagnostics, Treatments, Doctors, Staff, Care"
        />
        <link rel="canonical" href="https://report.shailungpolyclinic.com/" />
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
