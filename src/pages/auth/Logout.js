import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  let auth = { token: localStorage.getItem("User") ? true : false };

  useEffect(() => {
    auth.token == true ? navigate("auction") : navigate("login");
  }, []);
}

export default Logout;
