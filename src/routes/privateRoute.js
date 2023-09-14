import { type } from "@testing-library/user-event/dist/type";
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Import Routes all

const PrivateRoutes = () => {
  let auth = { token: localStorage.getItem("User") ? true : false };

  return auth.token ? <Outlet /> : <Navigate to="login" />;
};

export default PrivateRoutes;
