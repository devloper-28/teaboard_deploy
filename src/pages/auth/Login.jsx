/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { ICON, LOGINBG } from "../../assets/images";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { userRoutes, authRoutes } from "../../routes/mainRoutes/mainRoutes";
import { ToastContainer, toast } from "react-toastify";
const Login = () => {
  const [loginData, setLoginData] = useState({
    userCode: "",
    password: "",
  });
  const [passwordInputType, setPasswordInputType] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  console.log(currentPath);

  return (
    <div>
      <div class="LoginBox">
        <div className="container-fluid">
          <div class="row">
            <div class="col-md-6 p-0">
              <div class="LoginBg">
                <img src={LOGINBG} class="img-fluid" />
              </div>
            </div>
            <div class="col-md-6 p-0">
              <div class="LoginForm">
                <div class="row g-4">
                  <div class="col-md-12 mb-3">
                    <span className="LoginTitle">
                      <img src={ICON} className="img-fluid Logo" /> Tea Auction
                      Organiser
                    </span>
                  </div>
                  <h6>Welcome to e-Auction system</h6>
                  <div class="col-12 mt-2">
                    <h1>Login</h1>
                  </div>
                  <div class="col-lg-12 mt-2">
                    <input
                      type="text"
                      name="userCode"
                      value={loginData.userCode}
                      class="form-control"
                      placeholder="User Code"
                      onChange={(e) => {
                        setLoginData({
                          ...loginData,
                          userCode: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div class="col-lg-12 mt-2">
                    <div class="PasswordBox">
                      <input
                        id="password-field"
                        name="password"
                        type={passwordInputType ? "password" : "text"}
                        value={loginData.password}
                        class="form-control"
                        placeholder="Password"
                        onChange={(e) => {
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          });
                        }}
                      />
                      <span
                        onClick={() => setPasswordInputType(!passwordInputType)}
                        toggle="#password-field"
                        class="fa fa fa-eye field-icon toggle-password"
                      ></span>
                    </div>
                  </div>

                  <div class="col-lg-12 mt-3">
                    <input
                      type="submit"
                      value="Login"
                      class="LoginBtn"
                      onClick={() => {
                        let userCode = loginData.userCode.toString();

                        let password = loginData.password.toString();
                        if (
                          (userCode === "teaboard" &&
                            password === "teaboard") ||
                          (userCode === "auctioneer" &&
                            password === "auctioneer") ||
                          (userCode === "buyer" && password === "buyer")
                        ) {
                          localStorage.setItem(
                            "User",
                            JSON.stringify(loginData)
                          );
                          navigate("/auction");
                        } else {
                          toast.error("Incorrect credentials");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default Login;
