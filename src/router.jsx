import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
// import Users from "./pages/Users";
import WorkDrive from "./pages/WorkDrive";
// import Attendance from "./pages/Attendance";
// import Leaves from "./pages/Leaves";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "dashboard", element: <Dashboard /> },
      // { path: "users", element: <Users /> },
      { path: "work-drive", element: <WorkDrive /> },
      // { path: "attendance", element: <Attendance /> },
      // { path: "leaves", element: <Leaves /> },
    ],
  },
]);

export default router;
