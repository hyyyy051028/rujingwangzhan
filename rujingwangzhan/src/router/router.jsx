import { Navigate } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import PrivateRouter from "./PrivateRouter";
import MainLayout from "../layouts/MainLayout";
import Home from "../views/home/Home";
import Login from "../views/login/Login";
import Register from "../views/login/Register";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" />
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'dashboard',
        element: (
          <PrivateRouter>
            <div className="p-10 flex-1">用户仪表盘（受保护页面）</div>
          </PrivateRouter>
        )
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
])
export default router