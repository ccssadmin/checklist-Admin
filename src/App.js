// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Rescheduling from "./pages/Rescheduling";
import Notifications from "./pages/Notifications";
import CreateTemplates from "./pages/CreateTemplate";
import Reports from "./pages/Reports";
import Compliance from "./pages/Compliance";
import AllChecklists from "./pages/AllChecklists";
import AdminLayout from "./AdminLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import CreateEmployee from "./pages/CreateEmployee";
import ApprovalQueue from "./pages/ApprovalQueue";
import AllEmployees from "./pages/AllEmployees";
import AssignChecklist from "./pages/AssignChecklist";
import AllTemplates from "./pages/AllTemplates";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
      {/* Toast Should be OUTSIDE Routes */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Pages under Admin Layout */}
        <Route
          path="/home"
          element={
            <AdminLayout>
              <Home />
            </AdminLayout>
          }
        />

        <Route
          path="/checklists/rescheduling"
          element={
            <AdminLayout>
              <Rescheduling />
            </AdminLayout>
          }
        />

        <Route
          path="/notifications"
          element={
            <AdminLayout>
              <Notifications />
            </AdminLayout>
          }
        />

        <Route
          path="/compliance"
          element={
            <AdminLayout>
              <Compliance />
            </AdminLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <AdminLayout>
              <Reports />
            </AdminLayout>
          }
        />

        <Route
          path="/checklists/create"
          element={
            <AdminLayout>
              <CreateTemplates />
            </AdminLayout>
          }
        />

        <Route
          path="/checklists/all-Templates"
          element={
            <AdminLayout>
              <AllTemplates />
            </AdminLayout>
          }
        />

        <Route
          path="/checklists/all-Checklists"
          element={
            <AdminLayout>
              <AllChecklists />
            </AdminLayout>
          }
        />

        <Route
          path="/checklists/assign-checklists"
          element={
            <AdminLayout>
              <AssignChecklist />
            </AdminLayout>
          }
        />

        <Route
          path="/checklists/approval-queue"
          element={
            <AdminLayout>
              <ApprovalQueue />
            </AdminLayout>
          }
        />

        <Route
          path="/employees/create"
          element={
            <AdminLayout>
              <CreateEmployee />
            </AdminLayout>
          }
        />

        <Route
          path="/employees/all-employees"
          element={
            <AdminLayout>
              <AllEmployees />
            </AdminLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
