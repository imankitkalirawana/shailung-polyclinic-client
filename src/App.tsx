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
import { Toaster } from "react-hot-toast";
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

const MainLayout = ({ children }: any) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin/*" element={<Admin />}>
                    <Route path="" element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="users/:id" element={<ViewUser />} />
                    <Route path="users/:id/edit" element={<User />} />

                    <Route path="tests/" element={<Outlet />}>
                      <Route path="" element={<Tests />} />
                      <Route path="complete/:id" element={<Complete />} />
                      {/* <Route
                        path="complete/:id/:reportId/download"
                        element={<Download />}
                      /> */}
                    </Route>

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

                    <Route path="website" element={<Website />} />
                    <Route
                      path="appointments"
                      element={<h1>Admin Appointment View</h1>}
                    />
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
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
        </Routes>
      </Router>

      <Toaster position="bottom-center" containerClassName="mt-16" />
    </>
  );
}

export default App;
