import React from "react";
import Login from "../../pages/auth/Login";
import Auction from "../../pages/auction/Auction";
import Dashboard from "../../pages/dashboard/Dashboard";
import Logout from "../../pages/auth/Logout";

//preauction
import SaleProgram from "../../pages/allModals/saleprogram/SaleProgram";

//SideBar
import Layout from "../../components/layout/mainLayout/Layout";

const userRoutes = [
  {
    path: "dashboard",
    element: (<Layout>
      <Dashboard />
    </Layout>)
  },
  {
    path: "auction",
    element: (
      <Layout>
        <Auction />
      </Layout>
    ),
  },
  {
    path: "sale-program",
    element: <SaleProgram />,
  },
];

const authRoutes = [
  {
    path: "*",
    element: <Logout />,
  },
  {
    path: "login",
    element: <Login />,
  },
];

export { userRoutes, authRoutes };
