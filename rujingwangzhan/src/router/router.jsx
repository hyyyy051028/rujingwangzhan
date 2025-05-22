import { Navigate } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import PrivateRouter from "./PrivateRouter";
import Home from "../views/home/Home";



const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" />
  },
  {
    path: '/home',
    element: (
      <PrivateRouter>
        <Home />
      </PrivateRouter>
    )
  }
])
export default router